<template>
  <b-container class="editor-ui" fluid="true">
    <b-row>
      <b-col>
        <b-form-group
          description="What is the name of your blog"
          label="Title"
          label-for="post-title"
        >
          <b-form-input id="post-title" v-model="post.title" trim />
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-form-group
          description="What is the header image?"
          label="Header Image"
          label-for="post-header-image"
        >
          <b-form-input id="post-header-image" v-model="post.image" trim />
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-form-group
          description="What is your post about"
          label="Description"
          label-for="post-blurb"
        >
          <Editor id="post-blurb" v-model="post.description" />
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-form-group
          description="What is the contents of the post"
          label="Content"
          label-for="post-content"
        >
          <Editor id="post-content" v-model="post.content" :large="true" />
        </b-form-group>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
  import { Component, Model } from 'vue-property-decorator';
  import { StoreGetter } from '@/store/StoreGetter';
  import { Post } from '@/interfaces/Post';
  import { MetaManager } from '@/components/MetaManager';
  import { flattenElement } from '@/interfaces/ContentElement';

  @Component({
    components: {
      Editor: () =>
        import(
          /* webpackChunkName: "Editor" */
          /* webpackPrefetch: true */
          /* webpackPreload: true */
          '@/components/editor/Editor.vue'
        ),
    },
  })
  export default class EditorUI extends MetaManager {
    @Model()
    public readonly post!: Post;
    @StoreGetter('theme/isDark')
    private readonly darkTheme!: boolean;

    mounted() {
      this.updateHeadMeta(`Blog Editor - Edit: ${this.post.title}`, {
        description: flattenElement({
          children: this.post.description,
          attributes: {},
          type: '',
        }),
      });
    }
  }
</script>
