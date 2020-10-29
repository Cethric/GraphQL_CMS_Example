import { StatsController } from '@/components/editor/StatsController';
import Mousetrap from 'mousetrap';

export class KeymapController extends StatsController {
    private trap: Mousetrap | null = null;

    protected bindKeymap() {
        this.trap = new Mousetrap(this.editor);
        this.trap.bind('mod+s', () => {
            this.$root.$emit('editor:save');
            return false;
        });
        this.trap.bind('mod+1', () => {
            this.editorComp.execCommand('formatBlock', 'H1');
            return false;
        });
        this.trap.bind('mod+2', () => {
            this.editorComp.execCommand('formatBlock', 'H2');
            return false;
        });
        this.trap.bind('mod+3', () => {
            this.editorComp.execCommand('formatBlock', 'H3');
            return false;
        });
        this.trap.bind('mod+4', () => {
            this.editorComp.execCommand('formatBlock', 'H4');
            return false;
        });
        this.trap.bind('mod+5', () => {
            this.editorComp.execCommand('formatBlock', 'H5');
            return false;
        });
        this.trap.bind('mod+6', () => {
            this.editorComp.execCommand('formatBlock', 'H6');
            return false;
        });
        this.trap.bind('mod+0', () => {
            this.editorComp.execCommand('formatBlock', 'P');
            return false;
        });
        this.trap.bind('tab', () => {
            this.editorComp.execCommand('indent', undefined);
            return false;
        });
        this.trap.bind('shift+tab', () => {
            this.editorComp.execCommand('outdent', undefined);
            return false;
        });
        this.trap.bind('mod+k', () => {
            this.editorComp.insertLink();
            return false;
        });
        this.trap.bind('mod+shift+k', () => {
            this.editorComp.insertImage();
            return false;
        });
        this.trap.bind('mod+shift+b', () => {
            this.editorComp.insertCodeBlock();
            return false;
        });
    }

    protected unbindKeymap() {
        this.trap?.reset();
        this.trap = null;
    }
}