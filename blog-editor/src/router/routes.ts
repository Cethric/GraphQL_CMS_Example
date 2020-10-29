/** @format */

import { RouteConfig } from 'vue-router';

export const routes: RouteConfig[] = [
    {
        path: '/',
        name: 'Home',
        component: () =>
            import(
                /* webpackChunkName: "home" */
                '@/views/authenticated/Home.vue'
            ),
    },
    {
        path: '/about',
        name: 'About',
        component: () =>
            import(
                /* webpackChunkName: "about" */
                '@/views/authenticated/About.vue'
            ),
    },
    {
        path: '/edit/:id',
        name: 'Edit',
        component: () =>
            import(
                /* webpackChunkName: "edit" */
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                '@/views/authenticated/Edit.vue'
            ),
    },
    {
        path: '/new',
        name: 'New',
        component: () =>
            import(
                /* webpackChunkName: "new" */
                '@/views/authenticated/New.vue'
            ),
    },
    {
        path: '/view/:id',
        name: 'View',
        component: () =>
            import(
                /* webpackChunkName: "view" */
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                '@/views/authenticated/ContentView.vue'
            ),
    },
];
