import { BasicElement, ContentElement } from '@/interfaces/ContentElement';
import { CreateElement, FunctionalComponentOptions, RenderContext, VNode } from 'vue';
import { BImgLazy } from 'bootstrap-vue';

const CLEAN_CONTENT = false;

export function cleanContent(content: ContentElement[]): ContentElement[] {
    if (!CLEAN_CONTENT) return content;

    type CleanupResult = null | string | BasicElement | ContentElement[];
    type RecursiveCleanup = (itemToRender: ContentElement) => CleanupResult;

    function cleanChildren(children: ContentElement[], recursiveCleanup: RecursiveCleanup): ContentElement[] {
        return children.map(recursiveCleanup)
            .reduce<Array<ContentElement>>((prev, curr) => {
                return Array.isArray(curr)
                    ? prev.concat(curr)
                    : prev.concat([curr]);
            }, []);
    }

    function recursiveCleanup(itemToRender: ContentElement): CleanupResult {
        if (itemToRender === null) return null;
        if (typeof itemToRender === 'string') return itemToRender;
        const element = itemToRender as BasicElement;
        // eslint-disable-next-line
        if (
            /span/.test(element.type) &&
            element.attributes.rel === 'noreferrer noopener' &&
            element.attributes.target === '_blank'
        ) {
            return cleanChildren(element.children, recursiveCleanup);
        }
        element.children = cleanChildren(element.children, recursiveCleanup);
        return element;
    }

    const elements: ContentElement[] = JSON.parse(
        JSON.stringify(content),
    );

    return elements
        .map<CleanupResult>(recursiveCleanup)
        .reduce<Array<ContentElement>>(
            (prev, curr) =>
                Array.isArray(curr) ? prev.concat(curr) : prev.concat([curr]),
            [],
        );
}

type RecursiveRender = (content: ContentElement, context: ContentRendererContext) => (VNode | undefined);

interface ContentRendererContext {
    recursiveRender: RecursiveRender;
    readonly: boolean;
    createElement: CreateElement;
    renderChildren: (children: ContentElement[]) => VNode[];
}

function renderCodeBlock(element: BasicElement, context: ContentRendererContext): VNode {
    const code: BasicElement = element.children.find(
        (e: ContentElement) => typeof e !== 'string' ? e?.type === 'code' : false,
    ) as BasicElement;
    const language = code.attributes['class'].split(' ')[1];
    const data = {
        attrs: { ...element.attributes },
        directives: [{ name: 'code-block', value: { language } }],
    };
    return context.createElement(element.type, data, context.renderChildren(element.children));
}

function renderHeader(element: BasicElement, context: ContentRendererContext): VNode {
    return context.createElement(
        element.type,
        { attrs: { ...element.attributes }, directives: [{ name: 'header-link' }] },
        context.renderChildren(element.children),
    );
}

function renderAnchor(element: BasicElement, context: ContentRendererContext): VNode {
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

function renderImage(element: BasicElement, context: ContentRendererContext): VNode {
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

function renderElement(element: BasicElement, context: ContentRendererContext): VNode {
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

function recursiveRender(
    itemToRender: ContentElement,
    context: ContentRendererContext,
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

function render(rest: VNode[], content: ContentElement, renderContext: ContentRendererContext): VNode[] {
    const result = recursiveRender(content, renderContext);
    if (result) {
        rest.push(result);
    }
    return rest;
}

export const CONTENT_READY_EVENT = 'ContentRenderer:Ready';

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

        const renderContext: ContentRendererContext = {
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
