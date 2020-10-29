<template>
  <b-container class="login-required">
    <p>You are required to login to access this app</p>

    <b-button v-on:click="login">Log in</b-button>
  </b-container>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { StoreGetter } from '@/store/StoreGetter';

  @Component({})
  export default class LoginRequired extends Vue {
    @StoreGetter('theme/isDark')
    private readonly darkTheme!: boolean;

    public login() {
      this.$auth.loginWithRedirect();
    }
  }
</script>
