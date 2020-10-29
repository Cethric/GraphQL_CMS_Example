/** @format */

export type FormatStateJustify = 'left' | 'right' | 'center' | 'justify';

export type FormatStateFontLevel =
    | 'H1'
    | 'H2'
    | 'H3'
    | 'H4'
    | 'H5'
    | 'H6'
    | 'P';

export interface FormatState {
    isBold: boolean;
    isItalic: boolean;
    isUnderline: boolean;
    isStrikeThrough: boolean;
    fontLevel: FormatStateFontLevel;
    justify: FormatStateJustify;
    isAnchor: boolean;
}
