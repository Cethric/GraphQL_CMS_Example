declare module 'mousetrap' {
    type KeyInput = string | string[];
    // eslint-disable-next-line prettier/prettier
    type KeyType = 'keyup' | 'keydown' | 'keypress';
    type KeyCallbackEvent = (event: Event, combo: string) => (void | boolean);

    export namespace Mousetrap {
        function bind(key: KeyInput, callback: KeyCallbackEvent, type?: KeyType): void;

        function unbind(key: KeyInput, type: KeyType): void;

        function trigger(key: KeyInput): void;

        function stopCallback(event: Event, element: Element, combo: string): boolean;

        function reset(): void;

        function handleKey(character: string, modifiers: string[], event: Event): void;

        function addKeycodes(codes: { [keyCode: number]: string }): void;
    }

    export default class Mousetrap {
        constructor(element: Element);

        public bind(key: KeyInput, callback: KeyCallbackEvent, type?: KeyType): void;

        public unbind(key: KeyInput, type: KeyType): void;

        public trigger(key: KeyInput): void;

        public stopCallback(event: Event, element: Element, combo: string): boolean;

        public reset(): void;

        public handleKey(character: string, modifiers: string[], event: Event): void;

        public addKeycodes(codes: { [keyCode: number]: string }): void;
    }
}