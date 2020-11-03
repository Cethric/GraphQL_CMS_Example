/** @format */

import Vue from 'vue';
import { Route, VueRouter } from 'vue-router/types/router';

export async function scrollTo(
    vm: Vue,
    top: number,
    router: VueRouter,
    route: Route,
    href: string
): Promise<unknown> {
    vm.$nextTick(() =>
        window.scrollTo({
            behavior: 'smooth',
            top: top + 50,
        })
    );
    if (route.hash !== href) {
        return await router.replace({ hash: href });
    }
}
