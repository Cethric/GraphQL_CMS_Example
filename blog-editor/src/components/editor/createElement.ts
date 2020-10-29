export function createElement<Tag extends keyof HTMLElementTagNameMap>(tag: Tag, factory: (element: HTMLElementTagNameMap[Tag]) => void): HTMLElementTagNameMap[Tag] {
    // eslint-disable-next-line prettier/prettier
    type ElementType = HTMLElementTagNameMap[Tag];
    const element: ElementType = document.createElement<Tag>(tag);
    factory(element);
    return element;
}