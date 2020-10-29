<template>
  <b-modal
    :id="`${id}-${modalId}`"
    ref="modal"
    centered
    size="lg"
    title="Insert Table"
    @hidden="resetForm"
    @ok="insertLink"
    @show="resetForm"
  >
    <b-form @submit.prevent="submitLink">
      <b-container fluid>
        <b-form-row>
          <b-col>
            <b-form-group label="Shape" label-cols-lg="3" label-size="lg">
              <b-form-group
                label="Rows"
                label-cols-sm="2"
                label-for="rows"
                size="sm"
              >
                <b-form-spinbutton
                  id="rows"
                  v-model="rows"
                  min="1"
                  placeholder="1"
                />
              </b-form-group>
              <b-form-group
                label="Cols"
                label-cols-sm="2"
                label-for="cols"
                size="sm"
              >
                <b-form-spinbutton
                  id="cols"
                  v-model="cols"
                  min="1"
                  placeholder="1"
                />
              </b-form-group>
            </b-form-group>
          </b-col>
        </b-form-row>
        <b-form-row>
          <b-col>
            <b-form-group label="Caption" label-cols-lg="3" label-size="lg">
              <b-form-checkbox id="caption-caption-top" v-model="captionTop">
                Caption Top
              </b-form-checkbox>
              <b-form-group
                label="Caption"
                label-cols-sm="2"
                label-for="caption-caption"
                size="sm"
              >
                <b-form-input
                  id="caption-caption"
                  v-model="caption"
                  type="text"
                />
              </b-form-group>
            </b-form-group>
          </b-col>
        </b-form-row>
        <b-form-row>
          <b-col>
            <b-form-group label="Options" label-cols-lg="3" label-size="lg">
              <b-form-checkbox id="option-striped" v-model="striped" inline>
                Striped
              </b-form-checkbox>
              <b-form-checkbox id="option-bordered" v-model="bordered" inline>
                Bordered
              </b-form-checkbox>
              <b-form-checkbox
                id="option-borderless"
                v-model="borderless"
                inline
              >
                Borderless
              </b-form-checkbox>
              <b-form-checkbox id="option-outlined" v-model="outlined" inline>
                Outlined
              </b-form-checkbox>
              <b-form-checkbox id="option-dark" v-model="dark" inline>
                Dark
              </b-form-checkbox>
              <b-form-checkbox id="option-hover" v-model="hover" inline>
                Hover
              </b-form-checkbox>
              <b-form-checkbox id="option-small" v-model="small" inline>
                Small
              </b-form-checkbox>
              <b-form-checkbox id="option-fixed" v-model="fixed" inline>
                Fixed
              </b-form-checkbox>
              <b-form-checkbox
                id="option-responsive"
                v-model="responsive"
                inline
              >
                Responsive
              </b-form-checkbox>
              <b-form-checkbox
                id="option-stickyHeader"
                v-model="stickyHeader"
                inline
              >
                Sticky Header
              </b-form-checkbox>
              <b-form-checkbox
                id="option-noBorderCollapse"
                v-model="noBorderCollapse"
                inline
              >
                No Border Collapse
              </b-form-checkbox>
              <b-form-checkbox id="option-stacked" v-model="stacked" inline>
                Stacked
              </b-form-checkbox>
              <b-form-checkbox id="option-footClone" v-model="footClone" inline>
                Foot Clone
              </b-form-checkbox>
            </b-form-group>
          </b-col>
        </b-form-row>
      </b-container>
    </b-form>
    <div class="preview">
      <b-table-simple
        ref="preview-table"
        :bordered="bordered"
        :borderless="borderless"
        :caption="caption"
        :caption-top="captionTop"
        :dark="dark"
        :fixed="fixed"
        :foot-clone="footClone"
        :hover="hover"
        :no-border-collapse="noBorderCollapse"
        :outlined="outlined"
        :responsive="responsive"
        :small="small"
        :stacked="stacked"
        :sticky-header="stickyHeader"
        :striped="striped"
      >
        <b-tbody>
          <b-tr
            v-for="row in Array.from({ length: rows }, (_, i) => i)"
            :key="row"
          >
            <b-td
              v-for="col in Array.from({ length: cols }, (_, i) => i)"
              :key="col"
            >
              Row {{ row }} | Column {{ col }}
            </b-td>
          </b-tr>
        </b-tbody>
      </b-table-simple>
    </div>
  </b-modal>
</template>

<script lang="ts">
  import { Component, Prop, Ref, Vue } from 'vue-property-decorator';
  import { BvModalEvent } from 'bootstrap-vue';
  import { EditorActions } from '@/components/editor/EditorActions';

  export const MODAL_ID = 'insert-table-form';

  @Component({})
  export default class InsertTable extends Vue {
    @Prop()
    public readonly id!: string;
    @Prop()
    public readonly range!: Range[];
    @Prop()
    public readonly editor!: EditorActions[];
    @Ref()
    private readonly modal!: HTMLDivElement;
    @Ref('preview-table')
    private readonly previewTable!: Vue;

    private readonly modalId: string = MODAL_ID;

    private rows = 1;
    private cols = 1;
    private striped = false;
    private bordered = false;
    private borderless = false;
    private outlined = false;
    private dark = false;
    private hover = false;
    private small = false;
    private fixed = false;
    private responsive = false;
    private stickyHeader = false;
    private noBorderCollapse = false;
    private stacked = false;
    private footClone = false;

    private captionTop = false;
    private caption = '';

    get items() {
      return Array.from({ length: this.cols }, (_, k) => k).map((col) => {
        return Array.from({ length: this.rows }, (_, k) => k).map((row) => {
          return { [`Row ${row}`]: `Col ${col}` };
        });
      });
    }

    get fields() {
      return Array.from({ length: this.cols }, (_, k) => k).map((col) => {
        return Array.from({ length: this.rows }, (_, k) => k).map((row) => {
          return { [`Row ${row}`]: `Col ${col}` };
        });
      });
    }

    resetForm() {
      // this.$nextTick(() => (this.link = ''));
    }

    submitLink() {
      const table: HTMLTableElement = this.previewTable.$el as HTMLTableElement;
      console.log(this.previewTable.$el.innerHTML);

      this.$nextTick(() => this.$bvModal.hide(`${this.id}-${this.modalId}`));

      this.$nextTick(() => {
        this.range.forEach((range) => this.processRange(range, table));
      });
    }

    processRange(range: Range, table: unknown) {
      console.log(table);
      // const linkElement = document.createElement('a', {});
      // linkElement.href = link;
      // if (range.startOffset === range.endOffset) {
      //   const textNode = document.createTextNode(link);
      //   linkElement.appendChild(textNode);
      //   range.endContainer.parentNode?.appendChild(linkElement);
      // } else {
      //   range.surroundContents(linkElement);
      // }
    }

    insertLink(event: BvModalEvent) {
      event.preventDefault;
      this.submitLink();
    }
  }
</script>
