<template>
  <div>
    <b-img
      :id="`inline-image-${data.src}`"
      :src="data.src"
      :rounded="data.rounding"
      center
      class="w-100 h-auto"
      contenteditable="false"
      fluid-grow
      :data-data="JSON.stringify(data)"
    />
    <b-popover
      :target="`inline-image-${data.src}`"
      placement="top"
      triggers="hover"
      custom-class="custom-class"
    >
      <b-btn-toolbar size="sm">
        <b-btn-group class="ml-1 mr-1" size="sm">
          <b-btn>
            <b-icon-align-start />
          </b-btn>
          <b-btn>
            <b-icon-align-middle />
          </b-btn>
          <b-btn>
            <b-icon-align-end />
          </b-btn>
        </b-btn-group>
        <b-btn-group class="ml-1 mr-1" size="sm">
          <b-btn :pressed="data.lazy" v-on:click="toggleLazy">
            <b-icon-clock-history />
          </b-btn>
          <b-input
            class="btn btn-secondary btn-block"
            style="width: 2.5em;"
            type="color"
            v-model="data.lazyColour"
          />
        </b-btn-group>
        <b-btn-group class="ml-1 mr-1" size="sm">
          <b-btn
            :pressed="data.rounding === 'circle'"
            v-on:click="toggleRounding('circle')"
          >
            <b-icon-circle />
          </b-btn>
          <b-btn
            :pressed="data.rounding === true"
            v-on:click="toggleRounding(true)"
          >
            <b-icon-square />
          </b-btn>
          <b-btn
            :pressed="data.rounding === 'top'"
            v-on:click="toggleRounding('top')"
          >
            <b-icon-caret-up-square />
          </b-btn>
          <b-btn
            :pressed="data.rounding === 'bottom'"
            v-on:click="toggleRounding('bottom')"
          >
            <b-icon-caret-down-square />
          </b-btn>
          <b-btn
            :pressed="data.rounding === 'left'"
            v-on:click="toggleRounding('left')"
          >
            <b-icon-caret-left-square />
          </b-btn>
          <b-btn
            :pressed="data.rounding === 'right'"
            v-on:click="toggleRounding('right')"
          >
            <b-icon-caret-right-square />
          </b-btn>
        </b-btn-group>
      </b-btn-toolbar>
    </b-popover>
  </div>
</template>

<style lang="scss" scoped>
  .popover {
    max-width: inherit;
    padding: 0;
  }
</style>

<style lang="scss">
  .popover-body {
    margin: 0 !important;
    padding: 0 !important;
  }
</style>

<script lang="ts">
  import { Component, Model, Vue } from 'vue-property-decorator';

  type RoundingState =
    | true
    | false
    | 'top'
    | 'right'
    | 'bottom'
    | 'left'
    | 'circle'
    | '0'
    | undefined;

  interface InlineImageEditorData {
    src: string;
    rounding: RoundingState;
    lazy: boolean;
    lazyColour: string;
  }

  const MODEL_EVENT = 'InlineImageEditor::model::update';

  @Component({})
  export default class InlineImageEditor extends Vue {
    @Model(MODEL_EVENT)
    public readonly data!: InlineImageEditorData;

    toggleRounding(state: RoundingState) {
      const result = { ...this.data };
      if (result.rounding === state) {
        result.rounding = false;
      } else {
        result.rounding = state;
      }
      console.log('Updated rounding', result, this.data);
      this.$emit(MODEL_EVENT, result);
      // this.data = result;
    }

    toggleLazy() {
      const result = { ...this.data };
      result.lazy = !result.lazy;
      console.log('Updated lazy loading', result, this.data);
      this.$emit(MODEL_EVENT, result);
      // this.data = result;
    }
  }
</script>
