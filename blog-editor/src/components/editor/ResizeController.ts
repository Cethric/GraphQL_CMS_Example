import { EditorVueInstance } from '@/components/editor/EditorVueInstance';
import { Ref } from 'vue-property-decorator';

export class ResizeController extends EditorVueInstance {
    @Ref()
    protected readonly editor!: HTMLDivElement;

    private isResizing = false;
    private lastY = 0;
    private lastHeight = 0;

    private boundResizeEditor:
        | ((ev: MouseEvent) => void)
        | undefined = undefined;
    private boundEndResizingEditor:
        | ((ev: MouseEvent) => void)
        | undefined = undefined;

    beginResizingEditor(ev: MouseEvent) {
        ev.preventDefault();
        window.addEventListener(
            'mousemove',
            (this.boundResizeEditor = this.resizeEditor.bind(this)),
        );
        window.addEventListener(
            'mouseup',
            (this.boundEndResizingEditor = this.endResizingEditor.bind(this)),
        );
        this.isResizing = true;
        this.lastY = ev.pageY;
        this.editor.style.height = `${this.editor.offsetHeight}px`;
        this.lastHeight = this.editor.offsetHeight;
    }

    resizeEditor(ev: MouseEvent) {
        console.log('resize event', this);
        if (this.isResizing) {
            ev.preventDefault();
            const delta = ev.pageY - this.lastY;
            console.log(delta);
            // this.lastY = ev.pageY;
            this.editor.style.height = `${this.lastHeight + delta}px`;
        }
    }

    endResizingEditor() {
        this.isResizing = false;
        if (this.boundResizeEditor) {
            window.removeEventListener('mousemove', this.boundResizeEditor);
            this.boundResizeEditor = undefined;
        }
        if (this.boundEndResizingEditor) {
            window.removeEventListener('mouseup', this.boundEndResizingEditor);
            this.boundEndResizingEditor = undefined;
        }
    }
}