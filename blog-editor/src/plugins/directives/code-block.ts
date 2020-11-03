import Vue from 'vue';
import { InlineCodeEditor } from '@/components/editor/tools/codeBlock/InlineCodeEditor';

Vue.directive('code-block', (el, { value }) => {
    const pre = el as HTMLPreElement & {
        owner: InlineCodeEditor | undefined;
    };
    if (pre.owner === undefined) {
        pre.owner = new InlineCodeEditor(el as HTMLPreElement, value.language);
    }
});