<template>
  <b-container class="loading">
    <b-row align-h="center" align-v="center" class="h-100">
      <b-col class="text-center" cols="auto">
        <b-spinner style="width: 6rem; height: 6rem;" variant="primary" />
        <span class="details mt-3">Loading your profile please wait</span>
      </b-col>
    </b-row>
  </b-container>
</template>

<style lang="scss">
  .loading {
    height: 100vh;
  }

  .details {
    display: block;
  }
</style>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';

  @Component({})
  export default class LoadingProfile extends Vue {}
</script>
