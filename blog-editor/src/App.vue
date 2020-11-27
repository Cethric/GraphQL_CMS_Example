<template>
  <main
    id="app"
    :class="{ 'theme-dark': darkTheme, 'theme-light': !darkTheme }"
  >
    <LoadingProfile v-if="authLoading" />
    <Authenticated v-else-if="authAuthenticated" />
    <LoginRequired v-else />
  </main>
</template>

<style lang="scss">
  @import url('https://fonts.googleapis.com/css2?family=Didact+Gothic&family=Raleway:wght@500&display=swap');

  #app {
    min-height: 100%;
  }
</style>

<script lang="ts">
  import { Component, Vue, Watch } from 'vue-property-decorator';
  import { StoreGetter } from '@/store/StoreGetter';

  @Component({
    components: {
      Authenticated: () =>
        import(
          /* webpackChunkName: "authenticated" */
          /* webpackPrefetch: true */
          /* webpackPreload: true */
          '@/views/Authenticated.vue'
        ),
      LoadingProfile: () =>
        import(
          /* webpackChunkName: "loading" */
          /* webpackPrefetch: true */
          /* webpackPreload: true */
          '@/views/LoadingProfile.vue'
        ),
      LoginRequired: () =>
        import(
          /* webpackChunkName: "login" */
          /* webpackPrefetch: true */
          /* webpackPreload: true */
          '@/views/LoginRequired.vue'
        ),
    },
  })
  export default class App extends Vue {
    @StoreGetter('theme/isDark')
    private readonly darkTheme!: boolean;

    get authLoading(): boolean {
      return this.$auth.loading;
    }

    get authAuthenticated(): boolean {
      return this.$auth.isAuthenticated;
    }

    @Watch('darkTheme')
    themeChanged(newTheme: boolean): void {
      if (newTheme) {
        document.body.classList.remove('theme-light');
        document.body.classList.add('theme-dark');
        document.body.parentElement?.classList.remove('theme-light');
        document.body.parentElement?.classList.add('theme-dark');
      } else {
        document.body.classList.add('theme-light');
        document.body.classList.remove('theme-dark');
        document.body.parentElement?.classList.add('theme-light');
        document.body.parentElement?.classList.remove('theme-dark');
      }
    }

    mounted(): void {
      this.themeChanged(this.darkTheme);
    }
  }
</script>
