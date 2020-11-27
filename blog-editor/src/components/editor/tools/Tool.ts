/** @format */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { EditorActions } from '@/components/editor/EditorActions';

interface ToolBase {
    type: string;
    name: string;
    action: (editor: EditorActions) => void;
    enabled: (editor: EditorActions) => boolean;
    toggled: (editor: EditorActions) => boolean;
}

export interface ToolButton extends ToolBase {
    type: 'button';
    icon: string;
}

export interface ToolDropdownValue {
    name: string;
    action: (editor: EditorActions) => void;
    enabled: (editor: EditorActions) => boolean;
    toggled: (editor: EditorActions) => boolean;
}

export interface ToolDropdown extends ToolBase {
    type: 'dropdown';
    values: ToolDropdownValue[];
}

export type Tool = ToolBase;

export interface Tools {
    [groupName: string]: Tool[];
}

export const StyleTools: ToolButton[] = [
    {
        type: 'button',
        name: 'Bold',
        icon: 'type-bold',
        enabled: () => true,
        toggled: (action) => action.formatState.isBold,
        action: (action) => action.execCommand('bold', undefined),
    },
    {
        type: 'button',
        name: 'Italic',
        icon: 'type-italic',
        enabled: () => true,
        toggled: (action) => action.formatState.isItalic,
        action: (action) => action.execCommand('italic', undefined),
    },
    {
        type: 'button',
        name: 'Underline',
        icon: 'type-underline',
        enabled: () => true,
        toggled: (action) => action.formatState.isUnderline,
        action: (action) => action.execCommand('underline', undefined),
    },
    {
        type: 'button',
        name: 'Strike Through',
        icon: 'type-strikethrough',
        enabled: () => true,
        toggled: (action) => action.formatState.isStrikeThrough,
        action: (action) => action.execCommand('strikeThrough', undefined),
    },
];

export const FontTools: ToolDropdown[] = [
    {
        type: 'dropdown',
        name: 'Paragraph',
        enabled: () => true,
        toggled: () => false,
        action: (action) => action.execCommand('formatBlock', 'P'),
        values: [
            {
                name: '<h1>Heading 1</h1>',
                action: (action) => action.execCommand('formatBlock', 'H1'),
                enabled: () => true,
                toggled: (action) => action.formatState.fontLevel === 'H1',
            },
            {
                name: '<h2>Heading 2</h2>',
                action: (action) => action.execCommand('formatBlock', 'H2'),
                enabled: () => true,
                toggled: (action) => action.formatState.fontLevel === 'H2',
            },
            {
                name: '<h3>Heading 3</h3>',
                action: (action) => action.execCommand('formatBlock', 'H3'),
                enabled: () => true,
                toggled: (action) => action.formatState.fontLevel === 'H3',
            },
            {
                name: '<h4>Heading 4</h4>',
                action: (action) => action.execCommand('formatBlock', 'H4'),
                enabled: () => true,
                toggled: (action) => action.formatState.fontLevel === 'H4',
            },
            {
                name: '<h5>Heading 5</h5>',
                action: (action) => action.execCommand('formatBlock', 'H5'),
                enabled: () => true,
                toggled: (action) => action.formatState.fontLevel === 'H5',
            },
            {
                name: '<h6>Heading 6</h6>',
                action: (action) => action.execCommand('formatBlock', 'H6'),
                enabled: () => true,
                toggled: (action) => action.formatState.fontLevel === 'H6',
            },
            {
                name: '<p>Paragraph</p>',
                action: (action) => action.execCommand('formatBlock', 'P'),
                enabled: () => true,
                toggled: (action) => action.formatState.fontLevel === 'P',
            },
        ],
    },
];

export const JustifyTools: ToolButton[] = [
    {
        type: 'button',
        name: 'Justify Left',
        icon: 'text-left',
        enabled: () => true,
        toggled: (action) => action.formatState.justify === 'left',
        action: (action) => action.execCommand('justifyLeft', undefined),
    },
    {
        type: 'button',
        name: 'Justify Center',
        icon: 'text-center',
        enabled: () => true,
        toggled: (action) => action.formatState.justify === 'center',
        action: (action) => action.execCommand('justifyCenter', undefined),
    },
    {
        type: 'button',
        name: 'Justify Full',
        icon: 'text-paragraph',
        enabled: () => true,
        toggled: (action) => action.formatState.justify === 'justify',
        action: (action) => action.execCommand('justifyFull', undefined),
    },
    {
        type: 'button',
        name: 'Justify Right',
        icon: 'text-right',
        enabled: () => true,
        toggled: (action) => action.formatState.justify === 'right',
        action: (action) => action.execCommand('justifyRight', undefined),
    },
];

export const IndentTools: ToolButton[] = [
    {
        type: 'button',
        name: 'Indent',
        icon: 'text-indent-left',
        enabled: () => true,
        toggled: () => false,
        action: (action) => action.execCommand('indent', undefined),
    },
    {
        type: 'button',
        name: 'Dedent',
        icon: 'text-indent-right',
        enabled: () => true,
        toggled: () => false,
        action: (action) => action.execCommand('outdent', undefined),
    },
];

export const InsertTools: ToolButton[] = [
    {
        type: 'button',
        name: 'Link',
        icon: 'link',
        enabled: () => true,
        toggled: (editor) => editor.formatState.isAnchor,
        action: (editor) => editor.insertLink(),
    },
    {
        type: 'button',
        name: 'Image',
        icon: 'card-image',
        enabled: () => true,
        toggled: () => false,
        action: (editor) => editor.insertImage(),
    },
    {
        type: 'button',
        name: 'Ordered List',
        icon: 'list-ol',
        enabled: () => true,
        toggled: () => false,
        action: (editor) => editor.execCommand('insertOrderedList', undefined),
    },
    {
        type: 'button',
        name: 'Unordered List',
        icon: 'list-ul',
        enabled: () => true,
        toggled: () => false,
        action: (editor) =>
            editor.execCommand('insertUnorderedList', undefined),
    },
    {
        type: 'button',
        name: 'Table',
        icon: 'table',
        enabled: () => true,
        toggled: () => false,
        action: (editor) => editor.insertTable(),
    },
    {
        type: 'button',
        name: 'Code',
        icon: 'code',
        enabled: () => true,
        toggled: () => false,
        action: (editor) => editor.insertCode(),
    },
    {
        type: 'button',
        name: 'Code Block',
        icon: 'code-slash',
        enabled: () => true,
        toggled: () => false,
        action: (editor) => editor.insertCodeBlock(),
    },
    {
        type: 'button',
        name: 'Github Embed',
        icon: 'file-earmark-code',
        enabled: () => true,
        toggled: () => false,
        action: (editor) => editor.insertGithubEmbed(),
    },
];

export const ExportTools: ToolButton[] = [
    {
        type: 'button',
        name: 'Export for AEM',
        icon: 'book',
        enabled: () => true,
        toggled: () => false,
        action: (editor) => editor.exportForAEM(),
    },
    {
        type: 'button',
        name: 'Export to markdown',
        icon: 'markdown',
        enabled: () => true,
        toggled: () => false,
        action: (editor) => editor.exportToMarkdown(),
    },
];

export const EditorTools: Tools = {
    style: StyleTools,
    headings: FontTools,
    justify: JustifyTools,
    indent: IndentTools,
    insert: InsertTools,
    exporter: ExportTools,
};
