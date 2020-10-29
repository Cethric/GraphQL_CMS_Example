/** @format */

import { expect } from 'chai';
import { createLocalVue, mount } from '@vue/test-utils';
import App from '@/App.vue';
import VueRouter from 'vue-router';
import router from '@/router';

const localVue = createLocalVue();
localVue.use(VueRouter);

describe('App', () => {
    it('should render default route', () => {
        // @ts-ignore
        const wrapper = mount(App, {
            localVue,
            router,
        });
        expect(wrapper.text()).to.include(`Welcome to Your Vue.js App`);
    });
});
