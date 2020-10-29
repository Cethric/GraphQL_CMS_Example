/** @format */
import { FormatState, FormatStateFontLevel } from '@/components/editor/tools/FormatState';

export interface EditorActionCommands {
    'styleWithCSS': true | false | 'true' | 'false';
    'enableInlineTableEditing': true | false | 'true' | 'false';
    'enableObjectResizing': true | false | 'true' | 'false';
    'enableAbsolutePositionEditor': true | false | 'true' | 'false';
    'insertImage': string;
    'insertOrderedList': undefined;
    'insertUnorderedList': undefined;
    'insertHTML': string;
    'bold': undefined;
    'italic': undefined;
    'underline': undefined;
    'strikeThrough': undefined;
    'formatBlock': FormatStateFontLevel;
    'justifyLeft': undefined;
    'justifyCenter': undefined;
    'justifyFull': undefined;
    'justifyRight': undefined;
    'indent': undefined;
    'outdent': undefined;
}

export interface EditorActions {
    // eslint-disable-next-line prettier/prettier
    readonly formatState: FormatState;

    execCommand<Command extends keyof EditorActionCommands, Value extends EditorActionCommands[Command]>(command: Command, value: Value): void

    resetFormatState(): void;

    processFormatState(node: Node): void;

    insertLink(): void;

    insertImage(): void;

    insertTable(): void;

    insertCode(): void;

    insertCodeBlock(): void;
}
