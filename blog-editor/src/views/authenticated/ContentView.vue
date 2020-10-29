<template>
  <b-overlay
    :show="loadingPost"
    :style="{ height: loadingPost ? '100vh' : '100%', width: '100%' }"
    blur="1rem"
    opacity="0.8"
    rounded="sm"
    spinner-type="grow"
    spinner-variant="primary"
    variant="transparent"
  >
    <b-container class="content-view">
      <b-row>
        <ApolloQuery
          :poll-interval="35000"
          :query="require('@/graphql/query_post_with_author.graphql')"
          :variables="{ id: routeParams.id }"
          class="col"
          prefetch
        >
          <template v-slot="{ result: { loading, error, data } }">
            <b-spinner v-if="loading" />
            <p v-else-if="error">Error {{ error }}</p>
            <b-container v-if="data" fluid="true">
              <b-row>
                <b-col>
                  <b-jumbotron ref="headerJumbo" class="headerJumbo">
                    <template #header class="headerJumboText">
                      {{ prepareData(data).title }}
                    </template>
                    <template #lead class="headerJumboText">
                      <ContentRenderer
                        :content="prepareData(data).description"
                        readonly
                      />
                    </template>
                    <div class="my-2 d-flex flex-row lead">
                      <b-avatar
                        :src="prepareData(data).author.picture"
                        :text="prepareData(data).author.name"
                        icon="people-fill"
                        size="3rem"
                      />
                      <div class="d-inline ml-2">
                        <div>{{ prepareData(data).author.name }}</div>
                        <div>
                          {{
                            prepareData(data).published_at ||
                              prepareData(data).created_at
                                | moment('calendar', {
                                  sameElse: 'dddd, MMMM Do YYYY',
                                })
                          }}
                        </div>
                      </div>
                    </div>
                  </b-jumbotron>
                </b-col>
              </b-row>
              <b-row align-h="center">
                <b-col class="p-0 d-none d-md-block" cols="2">
                  <b-list-group
                    ref="scrollspyArea"
                    class="sticky-top toc"
                    variant="dark"
                  >
                    <b-list-group-item
                      v-for="link in prepareLinks(data)"
                      :key="link.text"
                      :href="makeId(link.text)"
                      variant="dark"
                      v-on:click="scrollToHeader"
                    >
                      <span :class="`indent-${link.level}`">
                        {{ link.text }}
                      </span>
                    </b-list-group-item>
                  </b-list-group>
                </b-col>
                <b-col
                  ref="content"
                  :class="{
                    'theme-light': !darkTheme,
                    'theme-dark': darkTheme,
                  }"
                  cols="9"
                >
                  <article>
                    <section>
                      <ContentRenderer
                        :content="prepareData(data).content"
                        readonly
                      />
                    </section>
                  </article>
                </b-col>
              </b-row>
              <PageLoaded :post="prepareData(data)" :ready="postLoaded" />
            </b-container>
          </template>
        </ApolloQuery>
      </b-row>
    </b-container>
  </b-overlay>
</template>

<style lang="scss" scoped>
  @use "src/styles/custom-bootstrap/bs-variables";

  .headerJumbo {
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;

    h1,
    p,
    div {
      text-shadow: -1px -1px 0 bs-variables.$gray-400,
        1px -1px 0 bs-variables.$gray-400, -1px 1px 0 bs-variables.$gray-400,
        1px 1px 0 bs-variables.$gray-400;
    }
  }

  .toc {
    top: bs-variables.$navbar-padding-y * 12;
    z-index: 1;
  }
</style>

<script lang="ts">
  import { Component, Ref } from 'vue-property-decorator';
  import { RouteKey } from '@/router/RouteKey';
  import { StoreGetter } from '@/store/StoreGetter';
  import { ContentRenderer } from '@/components/ContentRenderer';
  import { Post } from '@/interfaces/Post';
  import {
    BasicElement,
    flattenElement,
    makeReferencableId,
  } from '@/interfaces/ContentElement';
  import { CreateElement, DirectiveOptions, RenderContext, VNode } from 'vue';
  import { VBScrollspy } from 'bootstrap-vue';
  import { scrollTo } from '@/plugins/directives';
  import { MetaManager } from '@/components/MetaManager';

  type GraphQLPostResponse = { cms_post: Post[] };

  @Component({
    components: {
      ContentRenderer,
      PageLoaded: {
        functional: true,
        render(
          createElement: CreateElement,
          context: RenderContext<{
            ready: (post: Post) => void;
            post: Post;
          }>
        ): VNode | VNode[] {
          const { ready, post } = context.props;
          setTimeout(() => ready(post), 250);
          return [];
        },
      },
    },
  })
  export default class ContentView extends MetaManager {
    @RouteKey('params')
    private routeParams!: { id: string };
    @StoreGetter('theme/isDark')
    private readonly darkTheme!: boolean;
    @Ref('scrollspyArea')
    private readonly scrollspyArea!: HTMLDivElement;
    @Ref('content')
    private readonly content!: HTMLElement;
    @Ref('headerJumbo')
    private readonly headerJumbo!: HTMLDivElement;

    private loadingPost = true;

    makeId(title: string | number | boolean): string {
      return `#${makeReferencableId(title)}`;
    }

    // eslint-disable-next-line @typescript-eslint/camelcase
    prepareData({ cms_post }: GraphQLPostResponse): Post {
      // eslint-disable-next-line @typescript-eslint/camelcase
      return cms_post[0];
    }

    postLoaded(post: Post) {
      this.updateTitle(post);
      this.contentReady();
      this.prepareHeaderJumbo(post.image);
    }

    prepareHeaderJumbo(imageSrc: string) {
      this.headerJumbo.style.backgroundImage = `url(${imageSrc})`;
    }

    prepareLinks(data: GraphQLPostResponse): { level: number; text: string }[] {
      const post = this.prepareData(data);
      return post.content
        .filter((c) =>
          typeof c === 'string'
            ? false
            : c === null
            ? false
            : /h[0-6]/.test(c.type)
        )
        .map((header) => ({
          text: flattenElement(header),
          level:
            Number.parseInt(
              /h(?<level>[0-6])/i.exec((header as BasicElement).type)?.groups
                ?.level || '1'
            ) - 1,
        }));
    }

    contentReady() {
      if (this.scrollspyArea && this.content) {
        const directive: DirectiveOptions = VBScrollspy as DirectiveOptions;
        if (directive.update) {
          directive.update(
            this.scrollspyArea,
            {
              value: {
                offset: 100,
                method: 'auto',
                throttle: 100,
              },
              modifiers: {},
              name: '',
            },
            this.$vnode,
            this.$vnode
          );
        }
        this.loadingPost = false;
      }
    }

    updateTitle(post: Post) {
      this.updateHeadMeta(`Blog Editor - ${post.title}`, {
        description: flattenElement({
          children: post.description,
          attributes: {},
          type: '',
        }),
      });
    }

    scrollToHeader(ev: MouseEvent) {
      ev.preventDefault();
      if (ev.target) {
        const href =
          (ev.target as HTMLElement).getAttribute('href') ||
          (ev.target as HTMLElement).parentElement?.getAttribute('href');
        const el = href ? (document.querySelector(href) as HTMLElement) : null;
        if (el && href) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
          // @ts-ignore
          const { $router, $route } = this;
          scrollTo(this, el.offsetTop, $router, $route, href);
        }
      }
    }
  }
</script>
