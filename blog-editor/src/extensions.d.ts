import { Auth0 } from '@/auth0';

declare module 'vue/types/vue' {
    interface Vue {
        // eslint-disable-next-line prettier/prettier
        readonly $auth: Auth0;
    }
}