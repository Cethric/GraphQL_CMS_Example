/** @format */

import { RouteConfig } from 'vue-router';

import Edit from '@/views/authenticated/Edit.vue';

export const routes: RouteConfig[] = [
    {
        path: '/',
        name: 'Home',
        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
        component: () =>
            import(
                /* webpackChunkName: "home" */
                '@/views/authenticated/Home.vue'
            ),
    },
    {
        path: '/about',
        name: 'About',
        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
        component: () =>
            import(
                /* webpackChunkName: "about" */
                '@/views/authenticated/About.vue'
            ),
    },
    {
        path: '/edit/:id',
        name: 'Edit',
        // component: () =>
        //     import(
        //         /* webpackChunkName: "edit" */
        //         /* webpackPrefetch: true */
        //         /* webpackPreload: true */
        //         '@/views/authenticated/Edit.vue'
        //     ),
        component: Edit,
    },
    {
        path: '/new',
        name: 'New',
        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
        component: () =>
            import(
                /* webpackChunkName: "new" */
                '@/views/authenticated/New.vue'
            ),
    },
    {
        path: '/view/:id',
        name: 'View',
        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
        component: () =>
            import(
                /* webpackChunkName: "view" */
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                '@/views/authenticated/ContentView.vue'
            ),
    },
];
