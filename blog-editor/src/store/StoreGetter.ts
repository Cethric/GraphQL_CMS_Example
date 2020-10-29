import { createDecorator } from 'vue-class-component';
import { Store as VuexStore } from 'vuex';
import { ThemeState } from '@/store/theme';

export function StoreGetter(getterKey: string) {
    return createDecorator(function(options, key) {
        options.computed = options.computed || {};
        options.computed[key] = {
            cache: false,
            get: function() {
                const store = (this as { $store: VuexStore<ThemeState> }).$store;
                return store.getters[getterKey || key];
            },
        };
    });
}