<template>
  <b-modal
    :id="`${id}-${modalId}`"
    ref="modal"
    centered
    siz="sm"
    title="Add Link"
    @hidden="resetForm"
    @ok="insertLink"
    @show="resetForm"
  >
    <b-form @submit.prevent="submitLink">
      <b-form-group label="Link Url" label-for="link-uri">
        <b-form-input
          id="link-uri"
          v-model="link"
          :placeholder="`http://example.com/?count=${Math.floor(
            Math.random() * 100
          )}`"
          trim
          type="url"
        />
      </b-form-group>
    </b-form>
  </b-modal>
</template>

<script lang="ts">
  import { Component, Prop, Ref, Vue } from 'vue-property-decorator';
  import { BvModalEvent } from 'bootstrap-vue';
  import { EditorActions } from '@/components/editor/EditorActions';
  import { INSERT_LINK_MODAL_ID } from '@/components/editor/tools/constants';

  @Component({})
  export default class InsertLink extends Vue {
    @Prop()
    public readonly id!: string;
    @Prop()
    public readonly range!: Range[];
    @Prop()
    public readonly editor!: EditorActions[];
    @Ref()
    private readonly modal!: HTMLDivElement;

    private readonly modalId: string = INSERT_LINK_MODAL_ID;

    private link = '';

    resetForm() {
      this.$nextTick(() => (this.link = ''));
    }

    submitLink() {
      const value = this.link;

      this.$nextTick(() => this.$bvModal.hide(`${this.id}-${this.modalId}`));

      this.$nextTick(() => {
        this.range.forEach((range) => this.processRange(range, value));
      });
    }

    processRange(range: Range, link: string) {
      const linkElement = document.createElement('a', {});
      linkElement.href = link;
      if (range.startOffset === range.endOffset) {
        const textNode = document.createTextNode(link);
        linkElement.appendChild(textNode);
        range.endContainer.parentNode?.appendChild(linkElement);
      } else {
        range.surroundContents(linkElement);
      }
    }

    insertLink(event: BvModalEvent) {
      event.preventDefault;
      this.submitLink();
    }
  }
</script>
