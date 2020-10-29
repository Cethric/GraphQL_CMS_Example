/** @format */
import Vue, { PluginObject } from 'vue';
import createAuth0Client, {
    Auth0Client,
    GetIdTokenClaimsOptions,
    GetTokenSilentlyOptions,
    GetTokenWithPopupOptions,
    IdToken,
    LogoutOptions,
    PopupLoginOptions,
    RedirectLoginOptions,
} from '@auth0/auth0-spa-js';
import config from './auth0.json';
import { CombinedVueInstance } from 'vue/types/vue';

/** Define a default action to perform after authentication */
const DEFAULT_REDIRECT_CALLBACK = () =>
    window.history.replaceState({}, document.title, window.location.pathname);

export interface Auth0InstanceData {
    loading: boolean;
    isAuthenticated: boolean;
    user: unknown;
    auth0Client: Auth0Client | null;
    popupOpen: boolean;
    error: unknown | null;
}

export interface Auth0InstanceMethods {
    loginWithPopup(options?: PopupLoginOptions): Promise<void>;

    handleRedirectCallback(): Promise<void>;

    loginWithRedirect(options?: RedirectLoginOptions): Promise<void>;

    getIdTokenClaims(options?: GetIdTokenClaimsOptions): Promise<IdToken>;

    getTokenSilently(options?: GetTokenSilentlyOptions): Promise<unknown>;

    getTokenWithPopup(options?: GetTokenWithPopupOptions): Promise<string>;

    logout(options?: LogoutOptions): Promise<void>;

    blockLoading(): Promise<void>;
}

type ComputedInstanceTypes =
    | (Auth0InstanceData &
          Auth0InstanceMethods &
          object &
          Record<
              | 'loading'
              | 'isAuthenticated'
              | 'user'
              | 'auth0Client'
              | 'popupOpen'
              | 'error',
              string
          > &
          Record<never, string> &
          Vue)
    | undefined;

export type Instance = CombinedVueInstance<
    Vue,
    Auth0InstanceData,
    Auth0InstanceMethods,
    ComputedInstanceTypes,
    Record<never, unknown>
>;

let instance: Vue | Instance | undefined = undefined;

interface Auth0PluginOptions {
    onRedirectCallback: (state: unknown) => void;
    redirectUri: string;
    domain: string;
    clientId: string;
    audience?: string;
}

/** Returns the current instance of the SDK */
export const getInstance = () => instance;

/** Creates an instance of the Auth0 SDK. If one has already been created, it returns that instance */
export const useAuth0 = (options: Auth0PluginOptions) => {
    if (instance) return instance;

    // The 'instance' is simply a Vue object

    instance = new Vue({
        data(): Auth0InstanceData {
            return {
                loading: true,
                isAuthenticated: false,
                user: {},
                auth0Client: null,
                popupOpen: false,
                error: null,
            };
        },
        methods: {
            /** Authenticates the user using a popup window */
            async loginWithPopup(options?: PopupLoginOptions) {
                if (this.auth0Client) {
                    const client: Auth0Client = this.auth0Client;
                    this.popupOpen = true;

                    try {
                        await client.loginWithPopup(options);
                    } catch (e) {
                        // eslint-disable-next-line
                        console.error(e);
                    } finally {
                        this.popupOpen = false;
                    }

                    this.user = await client.getUser();
                    this.isAuthenticated = true;
                }
            },
            /** Handles the callback when logging in using a redirect */
            async handleRedirectCallback() {
                if (this.auth0Client) {
                    const client: Auth0Client = this.auth0Client;
                    this.loading = true;
                    try {
                        await client.handleRedirectCallback();
                        this.user = await client.getUser();
                        this.isAuthenticated = true;
                    } catch (e) {
                        this.error = e;
                    } finally {
                        this.loading = false;
                    }
                }
            },
            /** Authenticates the user using the redirect method */
            async loginWithRedirect(options?: RedirectLoginOptions) {
                if (this.auth0Client) {
                    const client: Auth0Client = this.auth0Client;
                    return await client.loginWithRedirect(options);
                }
            },
            /** Returns all the claims present in the ID token */
            async getIdTokenClaims(options?: GetIdTokenClaimsOptions) {
                if (this.auth0Client) {
                    const client: Auth0Client = this.auth0Client;
                    return client.getIdTokenClaims(options);
                }
            },
            /** Returns the access token. If the token is invalid or missing, a new one is retrieved */
            async getTokenSilently(options?: GetTokenSilentlyOptions) {
                if (this.auth0Client) {
                    const client: Auth0Client = this.auth0Client;
                    console.log('[useAuth0]', this.auth0Client);
                    return await client.getTokenSilently(options);
                }
            },
            /** Gets the access token using a popup window */
            getTokenWithPopup: function(options?: GetTokenWithPopupOptions) {
                if (this.auth0Client) {
                    const client: Auth0Client = this.auth0Client;
                    return client.getTokenWithPopup(options);
                }
            },
            /** Logs the user out and removes their session on the authorization server */
            logout: function(options: LogoutOptions) {
                if (this.auth0Client) {
                    const client: Auth0Client = this.auth0Client;
                    client.logout(options);
                }
            },

            async blockLoading() {
                while (this.loading) {
                    await new Promise((r) => setTimeout(r, 20));
                }
            },
        },
        /** Use this lifecycle method to instantiate the SDK client */
        async created() {
            // Create a new instance of the SDK client using members of the given options object
            this.auth0Client = await createAuth0Client({
                domain: options.domain,
                // eslint-disable-next-line @typescript-eslint/camelcase
                client_id: options.clientId,
                audience: options.audience,
                // eslint-disable-next-line @typescript-eslint/camelcase
                redirect_uri: options.redirectUri,
                useRefreshTokens: true,
            });

            try {
                // If the user is returning to the app after authentication..
                if (
                    window.location.search.includes('code=') &&
                    window.location.search.includes('state=')
                ) {
                    // handle the redirect and retrieve tokens
                    const {
                        appState,
                    } = await this.auth0Client.handleRedirectCallback();

                    // Notify subscribers that the redirect callback has happened, passing the appState
                    // (useful for retrieving any pre-authentication state)
                    options.onRedirectCallback(appState);
                }
            } catch (e) {
                this.error = e;
                console.error(e);
            } finally {
                // Initialize our internal authentication state
                this.isAuthenticated = await this.auth0Client.isAuthenticated();
                this.user = await this.auth0Client.getUser();
                this.loading = false;
            }
        },
    });

    return instance;
};

// Create a simple Vue plugin to expose the wrapper object throughout the application
export const Auth0Plugin: PluginObject<Auth0PluginOptions> = {
    install(Vue, options) {
        const authOptions = options || {
            onRedirectCallback: DEFAULT_REDIRECT_CALLBACK,
            redirectUri: window.location.origin,
            domain: config.domain,
            clientId: config.clientID,
        };
        Vue.prototype.$auth = useAuth0(authOptions);
    },
};
