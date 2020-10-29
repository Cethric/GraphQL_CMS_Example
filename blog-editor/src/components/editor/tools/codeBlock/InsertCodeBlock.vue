<template>
  <b-modal
    :id="`${id}-${modalId}`"
    centered
    size="lg"
    title="Add Code Block"
    @hidden="resetForm"
    @ok="insertCode"
    @show="resetForm"
    @shown="resetForm"
  >
    <b-select v-model="language" :options="languages" />
    <div ref="content" />
  </b-modal>
</template>

<script lang="ts">
  import { Component, Prop, Ref, Vue } from 'vue-property-decorator';
  import { BvModalEvent } from 'bootstrap-vue';
  import { EditorActions } from '@/components/editor/EditorActions';
  import hljs from 'highlight.js';
  import { InlineCodeEditor } from '@/components/editor/tools/codeBlock/InlineCodeEditor';
  import {
    createCodeMirror,
    EditorView,
  } from '@/components/editor/tools/codeBlock/createCodeMirror';
  import { noop } from 'vue-class-component/lib/util';
  import { INSERT_CODE_BLOCK_MODAL_ID } from '@/components/editor/tools/constants';

  @Component({})
  export default class InsertCodeBlock extends Vue {
    @Prop()
    public readonly id!: string;
    @Prop()
    public readonly range!: Range[];
    @Prop()
    public readonly editor!: EditorActions[];
    @Ref()
    private readonly content!: HTMLDivElement;

    private readonly modalId: string = INSERT_CODE_BLOCK_MODAL_ID;

    private codeMirror: EditorView | null = null;

    private language = '';

    get languages(): string[] {
      return hljs.listLanguages();
    }

    resetForm() {
      if (this.content) {
        if (this.codeMirror !== null) {
          this.codeMirror.destroy();
          this.codeMirror = null;
        }

        this.codeMirror = createCodeMirror(
          this.range.map((r) => r.toString()).reduce((p, c) => p + c, ''),
          () => noop()
        );
        this.content.appendChild(this.codeMirror.dom);
      }
    }

    submitCode() {
      if (this.codeMirror) {
        const preElement = document.createElement('pre', {});
        preElement.contentEditable = 'false';
        const codeElement = document.createElement('code', {});
        preElement.appendChild(codeElement);
        codeElement.appendChild(
          document.createTextNode(this.codeMirror.state.toJSON().doc)
        );
        codeElement.classList.add('hljs', this.language);
        hljs.highlightBlock(codeElement);
        ((preElement as unknown) as HTMLPreElement & {
          owner: InlineCodeEditor;
        }).owner = new InlineCodeEditor(preElement, this.language);

        this.$nextTick(() => this.$bvModal.hide(`${this.id}-${this.modalId}`));

        this.$nextTick(() =>
          this.range.forEach((range) => this.processRange(range, preElement))
        );
      }
    }

    processRange(range: Range, preElement: HTMLPreElement) {
      if (range.startOffset !== range.endOffset) {
        range.deleteContents();
      }
      range.insertNode(preElement);
    }

    insertCode(event: BvModalEvent) {
      event.preventDefault;
      this.submitCode();
    }
  }
</script>
