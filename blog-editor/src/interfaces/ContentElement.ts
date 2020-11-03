/** @format */

export const HEADER_LINK_PARAGRAPH_CLASS_NAME = 'header-link-paragraph';

export interface BasicElement {
    type: string;
    attributes: { [name: string]: string };
    children: (ContentElement | string)[];
}

export type ContentElement = null | string | BasicElement;

export function makeReferencableId(title: string | number | boolean): string {
    const base = encodeURIComponent(title);
    return base
        .replaceAll(/%20/giu, '__')
        .replaceAll(/'/giu, '__')
        .replaceAll(/%3F/giu, '__');
}

export function flattenElement(element: ContentElement): string {
    if (element === null) return '';
    if (typeof element === 'string') return element;
    return (
        element.children.map(flattenElement).join('') +
        (element.type === 'p' ? '\n' : '')
    );
}
