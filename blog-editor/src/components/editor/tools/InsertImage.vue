<template>
  <div ref="uploader" class="uploader" />
</template>

<style lang="scss">
  @use 'src/styles/uppy';
</style>

<script lang="ts">
  import { Component, Prop, Ref, Vue } from 'vue-property-decorator';
  import { EditorActions } from '@/components/editor/EditorActions';
  import { createUppy, StrictUppy } from '@/components/editor/tools/Uppy';
  import { BImgLazy } from 'bootstrap-vue';
  import { DetailConstructor } from '@/components/DetailConstructor';

  @Component({})
  export default class InsertImage extends Vue {
    @Prop()
    public readonly id!: string;
    @Prop()
    public readonly editor!: EditorActions[];
    @Prop()
    public readonly range!: Range[];
    protected uppy: StrictUppy | null = null;
    @Ref()
    private readonly uploader!: HTMLDivElement;

    mounted() {
      this.uppy = createUppy(this.id, this.uploader);
      if (this.uppy) {
        this.uppy.on('upload-success', (file, body) => {
          console.log(file.preview, body.uploadURL);
          this.range.forEach((range) => {
            console.log(file.preview, body.uploadURL);
            const img = new DetailConstructor({
              propsData: {
                node: this.$root.$createElement(BImgLazy, {
                  props: {
                    src: body.uploadURL || '',
                    'blank-src': file.preview || '',
                    class: 'w-auto h-auto',
                    fluid: true,
                    center: true,
                    blank: true,
                    blankColor: '#BBB',
                  },
                }),
              },
            });
            img.$mount(undefined, false);

            range.insertNode(img.$el);

            // const img = document.createElement('img');
            // img.src = file.preview || '';
            // range.insertNode(img);
            // const loaded = document.createElement('img');
            // loaded.src = body.uploadURL;
            // loaded.onload = () => img.replaceWith(loaded);
          });
        });
        this.uppy.on('complete', (result) => {
          if (result.failed.length === 0) {
            this.uppy?.reset();
          }
        });
      }
    }

    beforeDestroy() {
      this.uppy?.close();
      this.uppy = null;
    }
  }
</script>
