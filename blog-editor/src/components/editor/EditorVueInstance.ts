/* eslint-disable vue/custom-event-name-casing */

import { Prop, Vue } from 'vue-property-decorator';
import { EditorActionCommands, EditorActions } from '@/components/editor/EditorActions';
import { FormatState, FormatStateFontLevel, FormatStateJustify } from '@/components/editor/tools/FormatState';
import { EditorTools, Tools } from '@/components/editor/tools/Tool';
import {
    INSERT_CODE_BLOCK_MODAL_ID,
    INSERT_GITHUB_EMBED_MODAL_ID,
    INSERT_LINK_MODAL_ID,
} from '@/components/editor/tools/constants';

export class EditorVueInstance extends Vue implements EditorActions {
    @Prop()
    public readonly id!: string;
    public readonly formatState: FormatState = {
        isBold: false,
        isItalic: false,
        // eslint-disable-next-line
        isUnderline: false,
        isStrikeThrough: false,
        fontLevel: 'P',
        justify: 'left',
        isAnchor: false,
    };

    public get tools(): Tools {
        return EditorTools;
    }

    protected get editorComp(): EditorActions {
        return this;
    }

    public execCommand<Command extends keyof EditorActionCommands,
        Value extends EditorActionCommands[Command]>(command: Command, value: Value): void {
        let commandValue: string | undefined;
        if (typeof value === 'boolean') {
            commandValue = value ? 'true' : 'false';
        } else {
            commandValue = value as string | undefined;
        }
        document.execCommand(command, false, commandValue);
    }

    public resetFormatState(): void {
        this.formatState.isBold = false;
        this.formatState.isItalic = false;
        this.formatState.isUnderline = false;
        this.formatState.isStrikeThrough = false;
        this.formatState.fontLevel = 'P';
        this.formatState.justify = 'left';
        this.formatState.isAnchor = false;
    }

    public processFormatState(node: Node): void {
        if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as HTMLElement;
            if (element.style.fontWeight === 'bold') {
                this.formatState.isBold = true;
            }
            if (element.style.fontStyle === 'italic') {
                this.formatState.isItalic = true;
            }
            if (element.style.textDecorationLine.includes('underline')) {
                this.formatState.isUnderline = true;
            }
            if (element.style.textDecorationLine.includes('line-through')) {
                this.formatState.isStrikeThrough = true;
            }
            if (/P|H[0-6]/.test(element.nodeName)) {
                this.formatState.fontLevel = element.nodeName as FormatStateFontLevel;
            }
            if (element.style.textAlign) {
                this.formatState.justify = element.style
                    .textAlign as FormatStateJustify;
            }
            if (element.nodeName === 'A') {
                this.formatState.isAnchor = true;
            }
        }
    }

    insertLink(): void {
        this.$root.$emit(
            'bv::show::modal',
            `${this.id}-${INSERT_LINK_MODAL_ID}`,
            `#${this.id}`,
        );
    }

    insertImage(): void {
        document.getElementById(`${this.id}-toolbar-item-Image`)?.click();
    }

    insertTable(): void {
        // this.$root.$emit(
        //     'bv::show::modal',
        //     `${this.id}-${InsertTableId}`,
        //     `#${this.id}`,
        // );
        this.execCommand(
            'insertHTML',
            `<div class="table-responsive">
  <table class="table table-striped table-bordered table-hover">
      <thead>
      <tr>
          <th scope="col"></th>
          <th scope="col"></th>
      </tr>
      </thead>
      <tbody>
      <tr>
          <th scope="row"></th>
          <td></td>
      </tr>
      <tr>
          <th scope="row"></th>
          <td></td>
      </tr>
      </tbody>
      <tfoot>
      <tr>
          <th scope="row"></th>
          <td></td>
      </tr>
      </tfoot>
  </table>
</div>`,
        );
        this.$nextTick();

    }

    insertCode(): void {
        const selection = document.getSelection();
        this.execCommand(
            'insertHTML',
            `<code>${selection === null ? 'code' : selection.toString()}</code>`,
        );
    }

    insertCodeBlock(): void {
        this.$root.$emit(
            'bv::show::modal',
            `${this.id}-${INSERT_CODE_BLOCK_MODAL_ID}`,
            `#${this.id}`,
        );
    }

    insertGithubEmbed(): void {
        this.$root.$emit(
            'bv::show::modal',
            `${this.id}-${INSERT_GITHUB_EMBED_MODAL_ID}`,
            `#${this.id}`,
        );
    }

    exportForAEM(): void {
        return;
    }

    exportToMarkdown(): void {
        return;
    }
}