/** @format */

import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import { ThemeModule, ThemeState } from '@/store/theme';

Vue.use(Vuex);

const options: StoreOptions<ThemeState> = {
    modules: {
        theme: ThemeModule,
    },
};

const store = new Vuex.Store(options);

export default store;
