<template>
  <b-overlay
    :show="loading"
    blur="1rem"
    opacity="0.8"
    rounded="sm"
    spinner-type="grow"
    spinner-variant="primary"
    style="min-height:100vh;"
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
                  rounded
                  opacity="0.6"
                  spinner-small
                  spinner-variant="secondary"
                  class="d-inline-block"
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
                  rounded
                  opacity="0.6"
                  spinner-small
                  spinner-variant="secondary"
                  class="d-inline-block"
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
    private routeParams!: object;
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

    get params(): unknown {
      return this.routeParams;
    }

    mounted() {
      this.$root.$on('editor:update:content', this.contentChanged);
      this.$root.$on('editor:save', this.writeShortcutChanges);
    }

    beforeDestroy() {
      this.$root.$off('editor:update:content', this.contentChanged);
      this.$root.$off('editor:save', this.writeShortcutChanges);
    }

    contentReady() {
      this.loading = false;
    }

    writeShortcutChanges() {
      console.group('ShortcutSave');
      console.log('[ShortcutSave] saving document...');
      this.saveChanges.click();
      console.groupEnd();
    }

    writeChanges() {
      console.group('AutoSave');
      console.log('[AutoSave] saving document...');
      this.saveChanges.click();
      console.groupEnd();
    }

    normaliseVariables(post: Post) {
      return {
        id: post.id,
        title: post.title,
        description: post.description,
        content: post.content,
        image: post.image,
      };
    }

    onSaveChangesClick(mutate: () => void) {
      console.log('[ManualSave] saving document...');
      this.contentChanged.cancel();
      mutate();
    }

    onPublishClick(post: Post) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      const { $apollo, $router } = this;

      $apollo
        .mutate({
          mutation: require('@/graphql/publish.graphql'),
          variables: {
            id: post.id,
            published: new Date().toUTCString(),
          },
        })
        .then((data: unknown) => console.log(data))
        .catch((error: unknown) => console.error(error));
      $router.push({
        name: 'View',
        params: {
          id: encodeURIComponent(post.id),
        },
      });
    }
  }
</script>
