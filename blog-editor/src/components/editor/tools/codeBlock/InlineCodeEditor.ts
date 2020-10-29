import hljs from 'highlight.js';
import { createElement } from '@/components/editor/createElement';
import { createCodeMirror, EditorView } from '@/components/editor/tools/codeBlock/createCodeMirror';

type HLJSApi = typeof hljs;


hljs.registerLanguage('graphql', (e?: HLJSApi): Language => {
    if (!e) return { contains: [] };

    const api: HLJSApi = e;
    return {
        aliases: ['gql'],
        keywords: {
            keyword:
                'query mutation subscription|10 type input schema directive interface union scalar fragment|10 enum on ...',
            literal: 'true false null',
        },
        contains: [
            api.HASH_COMMENT_MODE,
            api.QUOTE_STRING_MODE,
            api.NUMBER_MODE,
            {
                className: 'type',
                begin: '[^\\w][A-Z][a-z]',
                end: '\\W',
                excludeEnd: !0,
            },
            {
                className: 'literal',
                begin: '[^\\w][A-Z][A-Z]',
                end: '\\W',
                excludeEnd: !0,
            },
            {
                className: 'variable',
                begin: '\\$',
                end: '\\W',
                excludeEnd: !0,
            },
            {
                className: 'keyword',
                begin: '[.]{2}',
                end: '\\.',
            },
            {
                className: 'meta',
                begin: '@',
                end: '\\W',
                excludeEnd: !0,
            },
        ],
        illegal: /([;<']|BEGIN)/,
    };
});

export class InlineCodeEditor {
    private codeMirror: EditorView | null = null;
    private codeMirrorDiv: HTMLDivElement | null = null;

    private readonly observer: MutationObserver;
    private readonly $handleFocus: () => void;
    private readonly $handleBlur: (e: FocusEvent) => void;
    private selectedLanguage: string;

    private static inlineCodeEditorIds = 0;
    private readonly id: string;

    constructor(
        private readonly preElement: HTMLPreElement,
        private activeLanguage: string,
    ) {
        this.selectedLanguage = this.activeLanguage;

        this.$handleFocus = this.handleFocus.bind(this);
        this.$handleBlur = this.handleBlur.bind(this);

        this.preElement.addEventListener('click', this.$handleFocus);

        this.observer = new MutationObserver(this.mutationEvent);
        this.observer.observe(preElement, { subtree: false, childList: true });

        this.id = `CodeMirrorEditor-${++InlineCodeEditor.inlineCodeEditorIds}`;
    }

    handleFocus() {
        const contents = this.preElement.textContent || '';
        this.codeMirror = createCodeMirror(contents, this.$handleBlur);
        this.codeMirrorDiv = createElement('div', (div) => {
            div.contentEditable = 'false';
            div.spellcheck = false;
            div.id = this.id;
        });
        const languageSelect = createElement('select', (select) => {
            select.id = `${this.id}-LanguageSelector`;
            select.classList.add('form-control');
            select.classList.add('custom-select');
            hljs.listLanguages().forEach((language) => {
                select.add(
                    createElement('option', (option) => {
                        option.value = language;
                        option.appendChild(document.createTextNode(language));
                    }),
                );
            });
            select.value = this.selectedLanguage = this.activeLanguage;
            select.addEventListener('change', (e: Event) => {
                const element = e.target as HTMLSelectElement;
                this.selectedLanguage = element.value || this.activeLanguage;
            });
            select.addEventListener('blur', () => this.codeMirror?.focus());
        });
        const toolbarDiv = createElement('div', (div) => {
            div.classList.add('sticky-top');
            div.style.top = '6.6em';
            div.style.zIndex = '600';
            div.appendChild(languageSelect);
            // div.appendChild(button);
        });
        this.codeMirrorDiv.appendChild(toolbarDiv);
        this.codeMirrorDiv.appendChild(this.codeMirror.dom);
        this.codeMirror.contentDOM.onblur = this.$handleBlur;
        this.preElement.replaceWith(this.codeMirrorDiv);
        this.codeMirror.focus();
    }

    handleBlur(e: FocusEvent) {
        if ((e.relatedTarget as HTMLElement).id === `${this.id}-LanguageSelector`) return false;
        if (this.codeMirror) {
            const contents = this.codeMirror.state.toJSON().doc;
            const codeElement = this.preElement.firstChild as HTMLElement | null;
            if (codeElement) {
                codeElement.innerText = contents;
                codeElement.classList.remove(this.activeLanguage);
                codeElement.classList.add(this.selectedLanguage);
                this.activeLanguage = this.selectedLanguage;
                this.selectedLanguage = '';
                hljs.highlightBlock(codeElement);
                this.codeMirrorDiv?.replaceWith(this.preElement);
                this.codeMirror.destroy();
                this.codeMirrorDiv?.remove();
                this.codeMirrorDiv = null;
                this.codeMirror = null;
            }
            return true;
        }
    }

    mutationEvent(mutations: MutationRecord[]) {
        if (mutations.every((r) => r.removedNodes.length > 0)) {
            console.log('disconnect');
            this.observer.disconnect();
            ((this.preElement as unknown) as {
                owner: InlineCodeEditor | undefined;
            }).owner = undefined;
        }
    }
}
