import { BasicElement, ContentElement } from '@/interfaces/ContentElement';
import { CreateElement, VNode } from 'vue';
import { BImgLazy } from 'bootstrap-vue';

type RecursiveRender = (content: ContentElement, context: RendererContext) => (VNode | undefined);

export interface RendererContext {
    recursiveRender: RecursiveRender;
    readonly: boolean;
    createElement: CreateElement;
    renderChildren: (children: ContentElement[]) => VNode[];
}

function renderCodeBlock(element: BasicElement, context: RendererContext): VNode {
    const code: BasicElement = element.children.find(
        (e: ContentElement) => typeof e !== 'string' ? e?.type === 'code' : false,
    ) as BasicElement;
    // eslint-disable-next-line
    const language = code.attributes['class'].split(' ')[1];
    const data = {
        attrs: { ...element.attributes },
        directives: [{ name: 'code-block', value: { language } }],
    };
    return context.createElement(element.type, data, context.renderChildren(element.children));
}

function renderHeader(element: BasicElement, context: RendererContext): VNode {
    return context.createElement(
        element.type,
        { attrs: { ...element.attributes }, directives: [{ name: 'header-link' }] },
        context.renderChildren(element.children),
    );
}

function renderAnchor(element: BasicElement, context: RendererContext): VNode {
    if (/^#.*?$/.test(element.attributes.href)) {
        return context.createElement(
            element.type,
            { attrs: { ...element.attributes } },
            context.renderChildren(element.children),
        );
    }
    const attributes = element.attributes;
    delete attributes['style'];
    return context.createElement(
        element.type,
        { attrs: { ...attributes, target: '_blank', rel: 'noreferrer noopener' } },
        context.renderChildren(element.children),
    );
}

function renderImage(element: BasicElement, context: RendererContext): VNode {
    // if (context.readonly) {
    return context.createElement(BImgLazy, {
        props: {
            src: element.attributes['src'],
            'class': 'w-auto h-auto',
            fluid: true,
            center: true,
            blank: true,
            blankColor: '#BBB',
        },
    });
    // }
    // return context.createElement(InlineImageEditor, {
    //     props: {
    //         data: element.attributes,
    //     },
    // });
}

function renderElement(element: BasicElement, context: RendererContext): VNode {
    return context.createElement(
        element.type,
        { attrs: { ...element.attributes } },
        context.renderChildren(element.children),
    );
}

function renderText(element: string): VNode {
    return {
        text: element,
        isComment: false,
        isRootInsert: true,
    };
}

export function recursiveRender(
    itemToRender: ContentElement,
    context: RendererContext,
): VNode | undefined {
    if (itemToRender !== null) {
        if (typeof itemToRender === 'string') return renderText(itemToRender);
        const element = itemToRender as BasicElement;
        const elementType = element.type.toLowerCase();

        if (elementType === 'pre' && !context.readonly) {
            return renderCodeBlock(element, context);
        } else if (elementType === 'img') {
            return renderImage(element, context);
        } else if (elementType === 'a') {
            return renderAnchor(element, context);
        } else if (elementType.startsWith('h')) {
            return renderHeader(element, context);
        } else if (elementType === 'span') {
            delete element.attributes['rel'];
            delete element.attributes['target'];
            return renderElement(element, context);
        }

        return renderElement(element, context);
    }
}

export function render(rest: VNode[], content: ContentElement, renderContext: RendererContext): VNode[] {
    const result = recursiveRender(content, renderContext);
    if (result) {
        rest.push(result);
    }
    return rest;
}

export const CONTENT_READY_EVENT = 'DiffRenderer:Ready';