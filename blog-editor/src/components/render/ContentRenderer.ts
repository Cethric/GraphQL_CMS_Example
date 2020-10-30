import { ContentElement } from '@/interfaces/ContentElement';
import { CreateElement, FunctionalComponentOptions, RenderContext, VNode } from 'vue';
import { CONTENT_READY_EVENT, recursiveRender, render, RendererContext } from '@/components/render/Renderer';
import { cleanContent } from '@/components/render/cleaner';

export { CONTENT_READY_EVENT };

export const ContentRenderer: FunctionalComponentOptions = {
    name: 'ContentRenderer',
    functional: true,
    props: {
        content: {
            type: Array,
        },
        readonly: {
            type: Boolean,
            default: false,
        },
    },
    render(
        createElement: CreateElement,
        context: RenderContext<{ content: ContentElement[], readonly: boolean }>,
    ): VNode | VNode[] {
        console.time('ContentRenderer - Render');
        const content: Array<ContentElement> = cleanContent(context.props.content);

        const renderContext: RendererContext = {
            readonly: context.props.readonly,
            createElement,
            recursiveRender,
            renderChildren: (children) => children.reduce<VNode[]>((p, c) => render(p, c, renderContext), []),
        };

        const cleanup: Array<VNode> = content.reduce<VNode[]>((p, c) => render(p, c, renderContext), []);

        const result: VNode | VNode[] = cleanup.length > 0
            ? cleanup
            : createElement('p', {}, 'Hello, World!');

        context.parent.$nextTick(() => context.parent.$root.$emit(CONTENT_READY_EVENT, content));
        console.timeEnd('ContentRenderer - Render');
        return result;
    },
};
