<template>
  <b-overlay
    :show="loading"
    blur="1rem"
    opacity="0.8"
    rounded="sm"
    spinner-type="grow"
    spinner-variant="primary"
    variant="transparent"
  >
    <div :class="{ 'theme-dark': darkTheme, 'theme-light': !darkTheme }">
      <b-button-toolbar
        :class="{
          toolbar: true,
          'bg-secondary': !darkTheme,
          'bg-dark': darkTheme,
          'sticky-top': true,
        }"
        aria-label="Editor Toolbar"
        key-nav
        size="sm"
      >
        <b-button-group
          v-for="[groupName, groupTools] in Object.entries(tools)"
          :key="groupName"
          class="mx-1"
          size="sm"
        >
          <ToolbarItem
            v-for="[tool, index] in groupTools.map((t, i) => [t, i])"
            :id="id"
            :key="index"
            :editor="editorComp"
            :tool="tool"
          />
        </b-button-group>
      </b-button-toolbar>
      <div
        ref="editor"
        :class="{
          'theme-dark': darkTheme,
          'theme-light': !darkTheme,
          'form-control': true,
          'editable-input': true,
          'editable-input-lg': large,
        }"
        contenteditable="true"
        v-on:input="inputChange"
      >
        <ContentRenderer :content="initialContent" />
      </div>
      <div class="resizer" v-on:mousedown="(e) => beginResizingEditor(e)" />
      <div class="element-breadcrumb d-flex flex-row">
        <span
          v-for="[item, index] in breadcrumbs.map((b, i) => [b, i])"
          :key="index"
          class="element-breadcrumb-item"
        >
          <b>{{ item.text }}</b>
        </span>
        <span :id="`${id}-word-count`" class="element-breadcrumb-count">
          Words: {{ wordCount }}
        </span>
        <b-popover
          :target="`${id}-word-count`"
          placement="top"
          title="Stats"
          triggers="hover"
        >
          <b-table-simple borderless hover responsive="sm" small>
            <b-tbody>
              <b-tr>
                <b-td>Words</b-td>
                <b-td>{{ wordCount }}</b-td>
              </b-tr>
              <b-tr>
                <b-td>Characters w/ spaces</b-td>
                <b-td>{{ letterWSpacesCount }}</b-td>
              </b-tr>
              <b-tr>
                <b-td>Characters</b-td>
                <b-td>{{ letterCount }}</b-td>
              </b-tr>
              <b-tr>
                <b-td>Paragraphs</b-td>
                <b-td>{{ paragraphs }}</b-td>
              </b-tr>
              <b-tr>
                <b-td>Lines</b-td>
                <b-td>{{ lines }}</b-td>
              </b-tr>
            </b-tbody>
          </b-table-simple>
        </b-popover>
      </div>

      <InsertLink :id="id" :editor="editorComp" :range="range" />
      <InsertCodeBlock :id="id" :editor="editorComp" :range="range" />
      <InsertTable :id="id" :editor="editorComp" :range="range" />
      <InsertImage :id="id" :editor="editorComp" :range="range" />
      <InsertGithubEmbed :id="id" :editor="editorComp" :range="range" />
    </div>
    <textarea ref="copyArea" class="copyArea"></textarea>
  </b-overlay>
</template>

<style lang="scss" scoped>
  @use "src/styles/custom-bootstrap/bs-variables";

  .toolbar {
    border-top-left-radius: bs-variables.$input-border-radius;
    border-top-right-radius: bs-variables.$input-border-radius;
    top: bs-variables.$navbar-padding-y * 9 !important;
    z-index: inherit !important;
  }

  .word-count-container {
    min-width: 18rem;
  }

  .element-breadcrumb {
    border-radius: 0 !important;
    font-size: 0.9rem;
    padding: 0.25rem 0.75rem;
    z-index: 0;
    position: sticky;
    bottom: 0;
    background-color: bs-variables.$gray-200;

    .element-breadcrumb-item {
      $margin-offset: 0.25rem;
      margin-left: $margin-offset;
      margin-right: $margin-offset;

      &:not(:first-child):not(:last-child):before {
        content: '/';
        margin-right: $margin-offset;
      }
    }

    .element-breadcrumb-count {
      margin-left: auto;
    }
  }

  .editable-input {
    min-height: 1.2rem;
    height: auto !important;
    border-radius: 0 !important;
    overflow-y: auto;
  }

  .editable-input-lg {
    min-height: 8rem;
  }

  pre {
    code {
      &.hljs {
        cursor: pointer;
      }
    }
  }

  .resizer {
    position: absolute;
    bottom: -0.5em;
    right: 0;
    width: 100%;
    height: 0.5em;
    background-color: bs-variables.$gray-300;
    z-index: 100;
    cursor: ns-resize;
    border-bottom-left-radius: bs-variables.$input-border-radius;
    border-bottom-right-radius: bs-variables.$input-border-radius;

    &:hover {
      background-color: bs-variables.$gray-400;
    }

    &:active {
      background-color: bs-variables.$gray-600;
    }
  }

  .copyArea {
    position: absolute;
    top: -30000px;
    left: -30000px;
  }
</style>

<script lang="ts">
  import { Component, Model, Prop, Ref } from 'vue-property-decorator';
  import ToolbarItem from '@/components/editor/tools/ToolbarItem.vue';
  import { StoreGetter } from '@/store/StoreGetter';
  import { ContentElement } from '@/interfaces/ContentElement';
  import {
    CONTENT_READY_EVENT,
    ContentRenderer,
  } from '@/components/render/ContentRenderer';
  import {
    EDITOR_MAPPER_CONTROLLER_CONTENT_UPDATE_EVENT,
    EditorMapperController,
  } from '@/components/editor/EditorMapperController';
  import { exportForAEM } from '@/components/editor/tools/exporters/exportForAEM';
  import { exportToMarkdown } from '@/components/editor/tools/exporters/exportToMarkdown';
  import InsertGithubEmbed from '@/components/editor/tools/InsertGithubEmbed.vue';

  export const EDITOR_UPDATE_EVENT = 'editor:update:content';

  @Component({
    components: {
      InsertGithubEmbed,
      ContentRenderer,
      InsertImage: () =>
        import(
          /* webpackChunkName: "InsertImage" */
          /* webpackPrefetch: true */
          /* webpackPreload: true */
          '@/components/editor/tools/InsertImage.vue'
        ),
      InsertTable: () =>
        import(
          /* webpackChunkName: "InsertTable" */
          /* webpackPrefetch: true */
          /* webpackPreload: true */
          '@/components/editor/tools/InsertTable.vue'
        ),
      ToolbarItem,
      InsertLink: () =>
        import(
          /* webpackChunkName: "InsertLink" */
          /* webpackPrefetch: true */
          /* webpackPreload: true */
          '@/components/editor/tools/InsertLink.vue'
        ),
      InsertCodeBlock: () =>
        import(
          /* webpackChunkName: "InsertCodeBlock" */
          /* webpackPrefetch: true */
          /* webpackPreload: true */
          '@/components/editor/tools/codeBlock/InsertCodeBlock.vue'
        ),
    },
  })
  export default class Editor extends EditorMapperController {
    @Prop()
    public readonly large!: boolean;
    public loading = true;
    public range: Range[] = [];
    public breadcrumbs: { text: string }[] = [];
    public initialContent: ContentElement[] = [];
    @StoreGetter('theme/isDark')
    private readonly darkTheme!: boolean;
    @Model(EDITOR_MAPPER_CONTROLLER_CONTENT_UPDATE_EVENT, {})
    private model!: ContentElement[];
    @Ref('copyArea')
    private readonly copyArea!: HTMLTextAreaElement;

    mounted(): void {
      this.bindKeymap();

      this.initialContent = this.model;
      document.addEventListener('selectionchange', this.handleSelectionChange);
      this.updateBreadcrumb(this.editor);

      this.$root.$on(CONTENT_READY_EVENT, this.handleContentReady);
      this.$nextTick(() => {
        this.editor.style.height = `${this.editor.scrollHeight * 1.05}px`;
      });
    }

    beforeDestroy(): void {
      this.unbindKeymap();
      document.removeEventListener(
        'selectionchange',
        this.handleSelectionChange
      );
      this.$root.$off(CONTENT_READY_EVENT, this.handleContentReady);
    }

    handleContentReady(): void {
      this.loading = false;
      this.calculateStats();
    }

    handleSelectionChange(): void {
      const selection: Selection | null = document.getSelection();
      if (
        selection &&
        (this.editor.contains(selection.anchorNode) ||
          this.editor.isEqualNode(selection.anchorNode))
      ) {
        this.execCommand('styleWithCSS', true);
        this.execCommand('enableInlineTableEditing', true);
        this.execCommand('enableObjectResizing', true);
        this.execCommand('enableAbsolutePositionEditor', true);

        this.updateBreadcrumb(selection.getRangeAt(0).endContainer);
        this.range = Array.from({ length: selection.rangeCount }, (v, k) =>
          selection.getRangeAt(k)
        );
        this.walkEditor();
      }
    }

    updateBreadcrumb(node: Node): void {
      const nodes: Node[] = [];
      this.resetFormatState();
      if (!this.editor.isEqualNode(node)) {
        let parent: Node | null = node;
        while (parent) {
          this.processFormatState(parent);
          nodes.push(parent);
          if (parent.isEqualNode(this.editor)) {
            break;
          }
          parent = parent?.parentNode;
        }
      } else {
        this.processFormatState(node);
        nodes.push(node);
      }
      this.breadcrumbs = nodes.map((n) => ({ text: n.nodeName })).reverse();
    }

    inputChange(): void {
      const content = this.mapChildren(this.editor.childNodes);
      this.$root.$emit(EDITOR_UPDATE_EVENT, content);
      this.calculateStats();
    }

    exportForAEM(): void {
      const content = this.mapChildren(this.editor.childNodes);
      const result = exportForAEM(content);
      this.copyArea.innerText = result;
      this.copyArea.select();
      this.copyArea.setSelectionRange(0, result.length * 2);
      this.execCommand('copy', undefined);
    }

    exportToMarkdown(): void {
      const content = this.mapChildren(this.editor.childNodes);
      const result = exportToMarkdown(content);
      this.copyArea.innerText = result;
      this.copyArea.innerHTML = this.copyArea.innerText.replaceAll(
        '</br>',
        '\r\n'
      );
      this.copyArea.select();
      this.copyArea.setSelectionRange(0, result.length * 2);
      this.execCommand('copy', undefined);
    }
  }
</script>
