<template>
  <b-modal
    :id="modalId"
    ref="modal"
    centered
    siz="sm"
    title="Embed Github"
    @hidden="resetForm"
    @ok="insertGithubEmbed"
    @show="resetForm"
  >
    <b-container>
      <b-row>
        <b-col>
          <b-form @submit="insertGithubEmbed">
            <b-form-group label="Url" label-for="github-insert-url">
              <b-form-input
                id="github-insert-url"
                placeholder="https://github.com/user/repository/blob/branch/src/hello.cpp#L2-L6"
                type="url"
              />
            </b-form-group>
            <b-form-group
              label="Highlighter Style"
              label-for="github-insert-style"
            >
              <b-form-select id="github-insert-style" />
            </b-form-group>
            <b-form-group
              label="Options"
              label-for="github-insert-options-group"
            >
              <b-checkbox-group id="github-insert-options-group">
                <b-checkbox>Border</b-checkbox>
                <b-checkbox>Line Numbers</b-checkbox>
                <b-checkbox>File metadata</b-checkbox>
              </b-checkbox-group>
            </b-form-group>
          </b-form>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <div v-emgithub :data-src="previewSource" />
        </b-col>
      </b-row>
    </b-container>
  </b-modal>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import { INSERT_GITHUB_EMBED_MODAL_ID } from '@/components/editor/tools/constants';
  import { EditorActions } from '../EditorActions';

  @Component
  export default class InsertGithubEmbed extends Vue {
    @Prop()
    public readonly id!: string;
    @Prop()
    public readonly editor!: EditorActions[];
    @Prop()
    public readonly range!: Range[];

    get modalId(): string {
      return `${this.id}-${INSERT_GITHUB_EMBED_MODAL_ID}`;
    }

    get previewSource(): string {
      const target = encodeURIComponent(
        'https://github.com/yusanshi/embed-like-gist/blob/master/embed.js'
      );
      const style = encodeURIComponent('github');
      const showBorder = encodeURIComponent('on');
      const showLineNumbers = encodeURIComponent('on');
      const showFileMeta = encodeURIComponent('on');
      return `https://emgithub.com/embed.js?target=${target}&style=${style}&showBorder=${showBorder}&showLineNumbers=${showLineNumbers}&showFileMeta=${showFileMeta}`;
    }

    resetForm(): void {
      console.log('reset form');
    }

    insertGithubEmbed(): void {
      console.log('submit form');
    }
  }
</script>

<style lang="scss" scoped></style>
