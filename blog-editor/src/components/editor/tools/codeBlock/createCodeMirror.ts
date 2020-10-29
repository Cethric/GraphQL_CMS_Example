/** @format */

import { EditorState, EditorView } from '@codemirror/next/basic-setup';
import { cpp as cppSyntax } from '@codemirror/next/lang-cpp';
import { css as cssSyntax } from '@codemirror/next/lang-css';
import { html as htmlSyntax, htmlSupport } from '@codemirror/next/lang-html';
import { java as javaSyntax } from '@codemirror/next/lang-java';
import { javascript as javascriptSyntax } from '@codemirror/next/lang-javascript';
import { json as jsonSyntax } from '@codemirror/next/lang-json';
import { python as pythonSyntax } from '@codemirror/next/lang-python';
import { rust as rustSyntax } from '@codemirror/next/lang-rust';
import { sql as sqlSyntax } from '@codemirror/next/lang-sql';
import { xml as xmlSyntax } from '@codemirror/next/lang-xml';
import { oneDark } from '@codemirror/next/theme-one-dark';
import { Extension } from '@codemirror/next/state';
import store from '@/store';
import { lineNumbers } from '@codemirror/next/gutter';
import { history } from '@codemirror/next/history';
import {
    drawSelection,
    highlightSpecialChars,
    indentOnInput,
    keymap,
    placeholder,
} from '@codemirror/next/view';
import { foldGutter, foldKeymap } from '@codemirror/next/fold';
import { defaultHighlighter } from '@codemirror/next/highlight';
import { bracketMatching } from '@codemirror/next/matchbrackets';
import {
    closeBrackets,
    closeBracketsKeymap,
} from '@codemirror/next/closebrackets';
import {
    autocompletion,
    completionKeymap,
} from '@codemirror/next/autocomplete';
import { rectangularSelection } from '@codemirror/next/rectangular-selection';
import {
    highlightActiveLine,
    highlightSelectionMatches,
} from '@codemirror/next/highlight-selection';
import { defaultKeymap } from '@codemirror/next/commands';
import { searchKeymap } from '@codemirror/next/search';
import { historyKeymap } from '@codemirror/next/history/dist';
import { commentKeymap } from '@codemirror/next/comment';
import { gotoLineKeymap } from '@codemirror/next/goto-line';
import { lintKeymap } from '@codemirror/next/lint';
import { tooltips } from '@codemirror/next/tooltip';

export { EditorView };

export function createCodeMirror(
    doc: string,
    onBlur: (event: FocusEvent) => void
): EditorView {
    const extensions: Extension[] = [
        // gutters({
        //     fixed: true,
        // }),
        lineNumbers({}),
        highlightSpecialChars({}),
        history({}),
        foldGutter({}),
        drawSelection({}),
        EditorState.allowMultipleSelections.of(true),
        indentOnInput(),
        defaultHighlighter,
        bracketMatching({ afterCursor: true }),
        closeBrackets(),
        autocompletion({ activateOnTyping: true }),
        rectangularSelection(),
        highlightActiveLine(),
        highlightSelectionMatches({}),
        keymap([
            ...closeBracketsKeymap,
            ...defaultKeymap,
            ...searchKeymap,
            ...historyKeymap,
            ...foldKeymap,
            ...commentKeymap,
            ...gotoLineKeymap,
            ...completionKeymap,
            ...lintKeymap,
        ]),
        placeholder('Enter your code here'),
        highlightSpecialChars({}),
        tooltips(),
        cppSyntax(),
        cssSyntax(),
        htmlSyntax(),
        htmlSupport(),
        javaSyntax(),
        javascriptSyntax({ jsx: false, typescript: false }),
        javascriptSyntax({ jsx: true, typescript: false }),
        javascriptSyntax({ jsx: false, typescript: true }),
        javascriptSyntax({ jsx: true, typescript: true }),
        jsonSyntax(),
        pythonSyntax(),
        rustSyntax(),
        sqlSyntax({}),
        xmlSyntax({}),
        EditorView.domEventHandlers({
            blur: onBlur,
        }),
    ];
    if (store.state.useDarkTheme) {
        extensions.push(oneDark);
        extensions.push(EditorView.theme({}, { dark: true }));
    }
    return new EditorView({
        state: EditorState.create({
            doc,
            extensions,
        }),
    });
}
