import { ZenObservable } from 'zen-observable-ts';
import { ApolloLink, FetchResult, NextLink, Operation } from 'apollo-link';
import { Observable, Subscription } from 'apollo-client/util/Observable';

type SubscriptionObserver = ZenObservable.SubscriptionObserver<FetchResult>;


const VERBOSE_DETAILS = false;

/* eslint-disable */
class RetryLinkError extends Error {
    constructor(reason: string) {
        super(reason);
    }

    public get name(): string {
        return 'RetryLinkError';
    }
}

/* eslint-enable */

interface RetryLinkOptions {
    willRetry: (count: number, operation: Operation, error: unknown) => boolean,
    delayFor: (count: number, operation: Operation) => number
}

class RetryLinkRetryable {
    private subscribers: SubscriptionObserver[];

    private readonly $next: (value: FetchResult) => void;
    private readonly $error: (error: unknown) => void;
    private readonly $complete: () => void;


    private activeSubscription: Subscription | null;
    private hasResults: FetchResult[];
    private isCanceled: boolean;
    private isComplete: boolean;
    private hasError: unknown | null;

    private attemptTimerId: NodeJS.Timeout | null;
    private retryCount: number;

    constructor(private readonly operation: Operation, private readonly nextLink: NextLink, private readonly options: RetryLinkOptions) {
        this.subscribers = [];

        this.$next = this.next.bind(this);
        this.$error = this.error.bind(this);
        this.$complete = this.complete.bind(this);

        this.activeSubscription = null;
        this.hasResults = [];
        this.isCanceled = false;
        this.isComplete = false;
        this.hasError = null;

        this.attemptTimerId = null;
        this.retryCount = 0;
    }

    public attach(subscriber: SubscriptionObserver) {
        if (this.isCanceled) {
            throw new RetryLinkError('Failed to attach subscriber to canceled retryable');
        }

        this.subscribers.push(subscriber);
        this.hasResults.forEach(subscriber.next);
        if (this.isComplete) {
            subscriber.complete();
        }
        if (this.hasError) {
            subscriber.error(this.hasError);
        }
    }

    public detach(subscriber: SubscriptionObserver) {
        this.subscribers = this.subscribers.filter((s) => s === subscriber);
        if (this.subscribers.length === 0) {
            this.cancel();
        }
    }

    public run() {
        if (this.activeSubscription) return;
        this.makeAttempt();
    }

    private attemptRetry(delay: number) {
        this.attemptTimerId = setTimeout(() => {
            this.makeAttempt();
            this.attemptTimerId = null;
        }, delay);
    }

    private cancel() {
        this.isCanceled = true;
        this.activeSubscription?.unsubscribe();
        this.activeSubscription = null;
    }

    private makeAttempt() {
        this.activeSubscription = this.nextLink(this.operation).subscribe({
            next: this.$next,
            error: this.$error,
            complete: this.$complete,
        });
    }

    private next(value: FetchResult) {
        if (Object.prototype.hasOwnProperty.call(value, 'errors')) {
            this.error(value.errors);
        } else {
            if (VERBOSE_DETAILS) {
                console.log('[RetryLinkRetryable]', 'next', value);
            }
            this.hasResults.push(value);
            this.subscribers.forEach((subscriber) => subscriber.next(value));
        }
    }

    private error(error: unknown) {
        if (this.options.willRetry(++this.retryCount, this.operation, error)) {
            if (VERBOSE_DETAILS) {
                console.log('[RetryLinkRetryable]', 'retry', error);
            }
            this.attemptRetry(this.options.delayFor(this.retryCount, this.operation));
        } else {
            if (VERBOSE_DETAILS) {
                console.log('[RetryLinkRetryable]', 'error', error);
            }
            this.hasError = error;
            this.subscribers.forEach((subscriber) => subscriber.error(error));
        }
    }

    private complete() {
        if (this.attemptTimerId) return;
        this.isComplete = true;
        this.subscribers.forEach((subscriber) => subscriber.complete());
    }
}

export class RetryLink extends ApolloLink {
    constructor(private readonly options: RetryLinkOptions) {
        super();
    }

    request(operation: Operation, forward: NextLink): Observable<FetchResult> | null {
        const retryable = new RetryLinkRetryable(operation, forward, this.options);
        retryable.run();
        return new Observable<FetchResult>((subscriber: SubscriptionObserver) => {
            retryable.attach(subscriber);
            return () => {
                retryable.detach(subscriber);
            };
        });
    }
}
