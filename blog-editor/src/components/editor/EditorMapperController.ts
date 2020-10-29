import { KeymapController } from '@/components/editor/KeymapController';
import { ContentElement, HEADER_LINK_PARAGRAPH_CLASS_NAME } from '@/interfaces/ContentElement';

export class EditorMapperController extends KeymapController {
    protected mapChildren(children: NodeListOf<Node>): ContentElement[] {
        return Array.from<unknown, Node>(
            { length: children.length },
            (v, k) => children.item(k),
        )
            .map<ContentElement | undefined>(this.walkNode)
            .reduce<ContentElement[]>(
                (p, c) => (c !== undefined ? p.concat([c]) : p),
                [],
            );
    }

    protected walkNode(node: Node): ContentElement | undefined {
        if (node.nodeType === Node.TEXT_NODE) {
            const text = node as Text;
            return text.wholeText;
        }
        if (node.nodeType === Node.ELEMENT_NODE) {
            const element: Element = node as Element;
            if (element.classList.contains(HEADER_LINK_PARAGRAPH_CLASS_NAME)) {
                return undefined;
            }
            if (/inline-image-.*?/.test(element.id)) {
                return element.firstChild
                    ? this.walkNode(element.firstChild)
                    : undefined;
            }
            return {
                type: node.nodeName.toLowerCase(),
                children: this.mapChildren(node.childNodes),
                attributes: element
                    .getAttributeNames()
                    .filter((name) => !name.startsWith('data-v-'))
                    .map<{ [key: string]: string }>((name) => ({
                        [name]: element.getAttribute(name) || name,
                    }))
                    .reduce<{ [key: string]: string }>((p, c) => ({ ...p, ...c }), {}),
            };
        }
        return undefined;
    }

    protected walkEditor(): void {
        const result = this.mapChildren(this.editor.childNodes);
        this.$emit('editor:update', result);
    }
}