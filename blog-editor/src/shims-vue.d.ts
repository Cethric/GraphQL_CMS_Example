import { Auth0 } from '@/auth0';

declare module '*.vue' {
    import Vue from 'vue';


    interface VueAuth extends Vue {
        readonly $auth: Auth0;
    }

    export default VueAuth;
}
