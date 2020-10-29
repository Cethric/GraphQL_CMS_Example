import { ResizeController } from '@/components/editor/ResizeController';

export class StatsController extends ResizeController {
    private wordCount = 0;
    private letterWSpacesCount = 0;
    private letterCount = 0;
    private paragraphs = 0;
    private lines = 0;

    protected calculateStats() {
        const text = this.editor.innerText;
        this.lines = text.split('\n').length;
        this.paragraphs = this.editor.getElementsByTagName('p').length;
        this.wordCount = text.split(' ').length;
        this.letterWSpacesCount = text.length;
        this.letterCount = text.replaceAll(/\W*/giu, '').length;
    }
}