module 'htmldiff.js' {
    export default class Diffr {
        public htmldiff(from: string, to: string): string;

        public textdiff(from: string, to: string): string;
    }
}