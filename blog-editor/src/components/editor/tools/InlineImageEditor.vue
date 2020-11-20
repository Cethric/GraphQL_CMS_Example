<template>
  <div
    :id="`inline-image-${src}`"
    v-b-modal="`inline-image-${src}-editor`"
    class="w-100 h-auto inline-image-editor"
    contenteditable="false"
  >
    <b-img :src="src" :alt="alt" center fluid-grow />

    <b-modal
      :id="`inline-image-${src}-editor`"
      centered
      lazy
      size="xl"
      title="Image Editor"
    >
      <b-container fluid="true">
        <b-row align-h="center" align-v="center">
          <b-col size="auto">
            <b-img
              :alt="alt"
              :src="src"
              center
              class="h-auto w-auto"
              fluid-grow
            />
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-form-group label="Alt Text" label-for="inline-image-editor-alt">
              <b-form-input id="inline-image-editor-alt" v-model="alt" trim />
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-btn-toolbar>
            <b-btn-group></b-btn-group>
          </b-btn-toolbar>
        </b-row>
      </b-container>
    </b-modal>
  </div>
</template>

<style lang="scss" scoped>
  .inline-image-editor {
    border: none;

    &:hover {
      border: 1px solid black;
    }
  }
</style>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';

  interface ImageData {
    src: string;
    alt: string;
  }

  @Component({})
  export default class InlineImageEditor extends Vue {
    @Prop()
    public data!: ImageData;

    private alt = '';
    private src = '';

    beforeMount() {
      this.alt = this.data.alt;
      this.src = this.data.src;
    }
  }
</script>
