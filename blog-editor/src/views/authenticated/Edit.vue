<template>
  <b-overlay
    :show="loading"
    blur="1rem"
    opacity="0.8"
    rounded="sm"
    spinner-type="grow"
    spinner-variant="primary"
    style="min-height: 100vh"
    variant="transparent"
  >
    <div class="edit">
      <ApolloQuery
        :query="require('@/graphql/query_post_with_author.graphql')"
        :variables="{ id: params.id }"
        class="container"
      >
        <template v-slot="{ result: { loading, error, data } }">
          <b-spinner v-if="loading" />
          <p v-else-if="error">Error {{ error }}</p>
          <div v-else-if="data">
            <ApolloMutation
              :mutation="require('@/graphql/mutate_post.graphql')"
              :variables="normaliseVariables(data.cms_post[0])"
            >
              <template v-slot="{ mutate, loading, error }">
                <b-overlay
                  :show="loading"
                  class="d-inline-block"
                  opacity="0.6"
                  rounded
                  spinner-small
                  spinner-variant="secondary"
                >
                  <b-button
                    ref="saveChanges"
                    :disabled="loading"
                    variant="primary"
                    v-on:click="onSaveChangesClick(mutate)"
                  >
                    Save Changes
                  </b-button>
                </b-overlay>

                <b-overlay
                  :show="loading"
                  class="d-inline-block"
                  opacity="0.6"
                  rounded
                  spinner-small
                  spinner-variant="secondary"
                >
                  <b-button
                    :disabled="loading"
                    class="ml-3"
                    variant="primary"
                    v-on:click="onPublishClick(data.cms_post[0])"
                  >
                    Publish
                  </b-button>
                </b-overlay>

                <div v-if="error">
                  {{ error }}
                </div>
                <template v-else>
                  <EditorUI v-model="data.cms_post[0]" />
                  <PageLoaded :ready="contentReady" />
                </template>
              </template>
            </ApolloMutation>
          </div>
        </template>
      </ApolloQuery>
    </div>
  </b-overlay>
</template>

<style lang="scss" scoped>
  @use "src/styles/custom-bootstrap/bs-variables";

  .edit {
    padding-top: bs-variables.$navbar-padding-y * 1.5;
  }
</style>

<script lang="ts">
  import { Component, Ref, Vue } from 'vue-property-decorator';
  import { RouteKey } from '@/router/RouteKey';
  import { StoreGetter } from '@/store/StoreGetter';
  import { Post } from '@/interfaces/Post';
  import debounce from 'lodash/debounce';
  import { CreateElement, RenderContext, VNode } from 'vue';
  import { EDITOR_UPDATE_EVENT } from '@/components/editor/Editor.vue';
  import VueRouter from 'vue-router';
  import { DollarApollo } from 'vue-apollo/types/vue-apollo';

  type NormalisedPost = Pick<Post, 'id'> &
    Pick<Post, 'title'> &
    Pick<Post, 'description'> &
    Pick<Post, 'content'> &
    Pick<Post, 'image'>;

  @Component({
    components: {
      EditorUI: () =>
        import(
          /* webpackChunkName: "EditorUI" */
          /* webpackPrefetch: true */
          /* webpackPreload: true */
          '@/components/EditorUI.vue'
        ),
      PageLoaded: {
        functional: true,
        render(
          createElement: CreateElement,
          context: RenderContext<{
            ready: () => void;
          }>
        ): VNode | VNode[] {
          const { ready } = context.props;
          setTimeout(ready, 1500);
          return [];
        },
      },
    },
  })
  export default class Edit extends Vue {
    @RouteKey('name')
    private routeName!: string;
    @RouteKey('params')
    private routeParams!: Record<string, unknown>;
    @StoreGetter('theme/isDark')
    private readonly darkTheme!: boolean;
    @Ref('saveChanges')
    private readonly saveChanges!: HTMLButtonElement;
    private readonly contentChanged = debounce(this.writeChanges, 30000, {
      leading: false,
      trailing: true,
      maxWait: 5000,
    });

    private loading = true;

    get params(): Record<string, unknown> {
      return this.routeParams;
    }

    mounted(): void {
      console.log('[Edit] Mounted');
      this.$root.$on(EDITOR_UPDATE_EVENT, this.contentChanged);
      this.$root.$on('editor:save', this.writeShortcutChanges);
    }

    beforeDestroy(): void {
      this.$root.$off(EDITOR_UPDATE_EVENT, this.contentChanged);
      this.$root.$off('editor:save', this.writeShortcutChanges);
    }

    contentReady(): void {
      this.loading = false;
    }

    writeShortcutChanges(): void {
      console.group('ShortcutSave');
      console.log('[ShortcutSave] saving document...');
      this.saveChanges.click();
      console.groupEnd();
    }

    writeChanges(): void {
      console.group('AutoSave');
      console.log('[AutoSave] saving document...');
      this.saveChanges.click();
      console.groupEnd();
    }

    normaliseVariables(post: Post): NormalisedPost {
      return {
        id: post.id,
        title: post.title,
        description: post.description,
        content: post.content,
        image: post.image,
      };
    }

    onSaveChangesClick(mutate: () => void): void {
      console.log('[ManualSave] saving document...');
      this.contentChanged.cancel();
      mutate();
    }

    onPublishClick(post: Post): void {
      const { $apollo, $router } = (this as unknown) as {
        $apollo: DollarApollo<Vue>;
        $router: VueRouter;
      };

      $apollo
        .mutate<unknown, { id: string; published: string }>({
          mutation: require('@/graphql/publish.graphql'),
          variables: {
            id: post.id,
            published: new Date().toUTCString(),
          },
        })
        .then((data) => console.log(data))
        .catch((error) => console.error(error));
      $router.push({
        name: 'View',
        params: {
          id: encodeURIComponent(post.id),
        },
      });
    }
  }
</script>
