/** @format */

import { BasicElement, ContentElement } from '@/interfaces/ContentElement';

const NEW_LINE = '\r\n';
// const NEW_LINE = '&#10;';

const processCodeBlock = (_: BasicElement): string => {
    return `<span>
INSERT_CODE_BLOCK&nbsp;&gt;&gt;&nbsp;HERE
</span>`;
};

const processImage = (element: BasicElement): string => {
    return `<span>
INSERT_IMAGE&nbsp;&gt;&gt;&nbsp;${JSON.stringify(element.attributes)})
</span>`;
};

const processAnchor = (element: BasicElement): string => {
    const content = {
        link: element.attributes.href,
        text: element.children.map(processContentElement).join(NEW_LINE),
    };
    return `<span>
INSERT_LINK&nbsp;&gt;&gt;&nbsp;(${JSON.stringify(content)}
</span>`;
};

const processHeader = (element: BasicElement): string => {
    const content = element.children.map(processContentElement).join(NEW_LINE);
    return `<${element.type} class="copy-small">
${content}
</${element.type}>`;
};

const processContentElement = (element: ContentElement): string => {
    if (element) {
        if (typeof element === 'string')
            return element.replaceAll(' ', '&nbsp;');
        if (element.type === 'pre') return processCodeBlock(element);
        if (element.type === 'img') return processImage(element);
        if (element.type === 'a') return processAnchor(element);
        if (element.type.match(/h[1-6]/)) return processHeader(element);
        return `<${element.type} class="copy-small">
${element.children.map(processContentElement).join(NEW_LINE)}
</${element.type}>`;
    }
    return '';
};

export const exportForAEM = (content: ContentElement[]): string => {
    return content.map(processContentElement).join(NEW_LINE);
};
