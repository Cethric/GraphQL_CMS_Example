/** @format */

console.log('I am a service worker');

class MyServiceWorker {
    constructor() {
        console.log('Hello World');
    }
}

(() => new MyServiceWorker())();
