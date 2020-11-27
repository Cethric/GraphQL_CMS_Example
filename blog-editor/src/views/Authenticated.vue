<template>
  <div class="authenticated">
    <b-navbar sticky toggleable="lg" type="dark" variant="primary">
      <b-navbar-brand :to="{ name: 'Home' }">Blog Editor</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse" />

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item :to="{ name: 'Home' }">Home</b-nav-item>
          <b-nav-item :to="{ name: 'About' }">Published</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item v-on:click="logout"> Logout</b-nav-item>
          <b-nav-item v-on:click="toggleTheme">
            <b-icon-brightness-low v-if="darkTheme" />
            <b-icon-brightness-high v-else />
          </b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <router-view />

    <div class="bg-dark text-light py-2 mt-4">
      <b-container class="my-3">
        <b-row align-h="center" class="my-3">
          <b-col cols="auto">
            <b-button :to="{ name: 'Home' }" variant="link">Home</b-button>
          </b-col>
          <b-col cols="auto">
            <b-button :to="{ name: 'About' }" variant="link">About</b-button>
          </b-col>
        </b-row>
        <b-row align-h="center" class="my-3">
          <b-col cols="auto"> &copy; 2020 Blake Rogan</b-col>
        </b-row>
      </b-container>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { StoreGetter } from '@/store/StoreGetter';

  @Component({})
  export default class Authenticated extends Vue {
    @StoreGetter('theme/isDark')
    private readonly darkTheme!: boolean;

    toggleTheme(): void {
      this.$store.dispatch('updateTheme', !this.darkTheme);
    }

    logout(): void {
      this.$auth.logout();
    }
  }
</script>
