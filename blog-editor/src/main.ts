/** @format */

import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import './styles/_themes.scss';

import 'pwacompat';

import { apolloProvider } from './plugins';

Vue.config.productionTip = false;

const app = new Vue({
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    router,
    store,
    apolloProvider,
    render: (h) => h(App),
});

app.$mount('#app');
