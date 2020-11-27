<template>
  <b-container class="home">
    <b-row>
      <b-col>
        <h1>Drafts</h1>
      </b-col>
    </b-row>
    <b-row>
      <b-col class="mb-4" lg="3" md="6" sm="12">
        <b-card
          :bg-variant="darkTheme ? 'dark' : 'light'"
          no-body
          tag="article"
        >
          <b-card-img-lazy
            alt="Image"
            blank-color="secondary"
            blank-height="300"
            blank-width="600"
            src="https://picsum.photos/600/300"
            top
          />
          <b-card-body>
            <b-card-title> Create new draft </b-card-title>
            <b-card-text>Create a new draft blog post</b-card-text>
            <b-button :to="{ name: 'New' }" variant="primary">
              New Draft
            </b-button>
          </b-card-body>
        </b-card>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <ApolloQuery :query="drafts" class="mb-4 card-deck">
          <template v-slot="{ result: { loading, error, data } }">
            <b-spinner v-if="loading" />
            <p v-else-if="error">Error {{ error }}</p>
            <blog-post-card
              v-for="post in data.cms_post"
              v-else-if="data"
              :key="encodeURIComponent(post.permalink)"
              :is-draft="true"
              :post="post"
            />
          </template>
        </ApolloQuery>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <h1>Published</h1>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <ApolloQuery :query="published" class="mb-4 card-deck">
          <template v-slot="{ result: { loading, error, data } }">
            <b-spinner v-if="loading" />
            <p v-else-if="error">Error {{ error }}</p>
            <blog-post-card
              v-for="post in data.cms_post"
              v-else-if="data"
              :key="encodeURIComponent(post.permalink)"
              :is-draft="false"
              :post="post"
            />
          </template>
        </ApolloQuery>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import BlogPostCard from '@/components/BlogPostCard.vue';
  import { StoreGetter } from '@/store/StoreGetter';
  import gql from 'graphql-tag';

  type GQLFunc = typeof gql;

  @Component({
    components: { BlogPostCard },
  })
  export default class Home extends Vue {
    @StoreGetter('theme/isDark')
    private readonly darkTheme!: boolean;

    drafts(gql: GQLFunc) {
      return gql`
        query posts {
          cms_post(
            where: { published_at: { _is_null: true } }
            order_by: { created_at: asc }
          ) {
            id
            title
            description
            image
            permalink
            created_at
          }
        }
      `;
    }

    published(gql: GQLFunc) {
      return gql`
        query posts {
          cms_post(
            where: { published_at: { _is_null: false } }
            order_by: { published_at: asc }
          ) {
            id
            title
            description
            image
            permalink
            published_at
          }
        }
      `;
    }
  }
</script>
