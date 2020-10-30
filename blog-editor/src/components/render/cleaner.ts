import { BasicElement, ContentElement } from '@/interfaces/ContentElement';

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