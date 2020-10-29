/** @format */
import { ActionTree, GetterTree, Module, MutationTree } from 'vuex';

export interface ThemeState {
    useDarkTheme: boolean;
}

export const ThemeGetter: GetterTree<ThemeState, ThemeState> = {
    isDark: (state): boolean => {
        return state.useDarkTheme;
    },
};

export const ThemeActions: ActionTree<ThemeState, ThemeState> = {
    updateTheme: {
        root: true,
        handler: ({ commit }, payload: boolean) => {
            commit(payload ? 'makeDark' : 'makeLight');
        },
    },
};

export const ThemeMutations: MutationTree<ThemeState> = {
    makeDark: (state) => {
        state.useDarkTheme = true;
    },
    makeLight: (state) => {
        state.useDarkTheme = false;
    },
};

export const ThemeModule: Module<ThemeState, ThemeState> = {
    namespaced: true,
    state: {
        useDarkTheme: false,
    },
    getters: ThemeGetter,
    actions: ThemeActions,
    mutations: ThemeMutations,
};
