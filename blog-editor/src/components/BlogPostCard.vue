<template>
  <b-card
    :bg-variant="darkTheme ? 'dark' : 'light'"
    class="post-card"
    no-body
    tag="article"
  >
    <b-card-img-lazy
      :src="post.image"
      alt="Image"
      blank-color="secondary"
      blank-height="300"
      blank-width="600"
      top
    />
    <b-card-body>
      <b-card-title>{{ post.title }}</b-card-title>
      <b-card-sub-title>
        {{
          isDraft
            ? post.created_at
            : post.published_at
              | moment('calendar', { sameElse: 'dddd, MMMM Do YYYY' })
        }}
      </b-card-sub-title>
      <b-card-text>
        <ContentRenderer :content="post.description" readonly />
      </b-card-text>
    </b-card-body>
    <b-card-footer>
      <b-button :to="link" variant="primary">
        {{ isDraft ? 'Edit Draft' : 'View Post' }}
      </b-button>
      <b-button v-if="isDraft" variant="secondary" v-on:click="publishDraft">
        Publish Draft
      </b-button>
    </b-card-footer>
  </b-card>
</template>

<style lang="scss" scoped>
  @use "src/styles/custom-bootstrap/bs-variables";

  $post-card-width: 100%;

  .post-card {
    min-width: $post-card-width;
    max-width: $post-card-width;
    margin-bottom: bs-variables.$card-deck-margin !important;
    margin-top: bs-variables.$card-deck-margin !important;
  }
</style>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import { Location } from 'vue-router';
  import { PostBrief } from '@/interfaces/PostBrief';
  import { ContentRenderer } from '@/components/ContentRenderer';

  @Component({
    components: {
      ContentRenderer,
    },
  })
  export default class BlogPostCard extends Vue {
    @Prop()
    public readonly post!: PostBrief;
    @Prop()
    public readonly isDraft!: boolean;

    get darkTheme(): boolean {
      return this.$store.getters['theme/isDark'];
    }

    get link(): Location {
      if (this.isDraft) {
        return {
          name: 'Edit',
          params: {
            id: encodeURIComponent(this.post.id),
          },
        };
      }
      return {
        name: 'View',
        params: {
          id: encodeURIComponent(this.post.id),
          permalink: encodeURIComponent(this.post.permalink),
        },
      };
    }

    publishDraft(): void {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      const { $apollo } = this;
      console.log('Publish Draft: ', this.post.id, $apollo);
      $apollo
        .mutate({
          mutation: require('@/graphql/publish.graphql'),
          variables: {
            id: this.post.id,
            published: new Date().toUTCString(),
          },
        })
        .then((data: unknown) => console.log(data))
        .catch((error: unknown) => console.error(error));
    }
  }
</script>
