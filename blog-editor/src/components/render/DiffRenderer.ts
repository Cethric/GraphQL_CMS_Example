import { ContentElement } from '@/interfaces/ContentElement';
import { CreateElement, FunctionalComponentOptions, RenderContext, VNode } from 'vue';
import { CONTENT_READY_EVENT, recursiveRender, render, RendererContext } from '@/components/render/Renderer';

export { CONTENT_READY_EVENT };

export const DiffRenderer: FunctionalComponentOptions = {
    name: 'DiffRenderer',
    functional: true,
    props: {
        content: {
            type: Object,
        },
        readonly: {
            type: Boolean,
            default: false,
        },
    },
    render(
        createElement: CreateElement,
        context: RenderContext<{ content: { oldContent?: ContentElement[], newContent: ContentElement[] }, readonly: boolean }>,
    ): VNode | VNode[] {
        console.time('DiffRenderer - Render');

        const renderContext: RendererContext = {
            readonly: context.props.readonly,
            createElement,
            recursiveRender,
            renderChildren: (children) => children.reduce<VNode[]>((p, c) => render(p, c, renderContext), []),
            // eslint-disable-next-line
        };

        const content = context.props.content.newContent;
        const content2 = context.props.content.oldContent;

        const rendered: Array<VNode> = content.reduce<VNode[]>((p, c) => render(p, c, renderContext), []);
        if (content2) {
            const diffed: Array<VNode> = content2.reduce<VNode[]>((p, c) => render(p, c, renderContext), []);
            console.log(diffed);
        }

        const result: VNode | VNode[] = rendered.length > 0
            ? rendered
            : createElement('p', {}, 'Hello, World!');

        context.parent.$nextTick(() => context.parent.$root.$emit(CONTENT_READY_EVENT, content));
        console.timeEnd('DiffRenderer - Render');
        return result;
    },
};
