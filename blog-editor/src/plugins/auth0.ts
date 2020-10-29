/** @format */

import Vue from 'vue';
import { Auth0Plugin } from '@/auth0';
import config from '@/auth0/auth0.json';
import router from '@/router';

Vue.use(Auth0Plugin, {
    onRedirectCallback: (state) =>
        router.push(
            state && (state as { targetUrl?: string; }).targetUrl
                ? (state as { targetUrl: string; }).targetUrl
                : window.location.pathname,
        ),
    redirectUri: window.location.origin,
    domain: config.domain,
    clientId: config.clientID,
});
