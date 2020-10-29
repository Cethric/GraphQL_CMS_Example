<template>
  <b-button
    v-if="tool.type === 'button'"
    :id="`${id}-toolbar-item-${buttonTool.name}`"
    v-b-tooltip.hover
    :disabled="!buttonTool.enabled(editor)"
    :pressed="buttonTool.toggled(editor)"
    :title="buttonTool.name"
    :variant="darkTheme ? 'dark' : 'secondary'"
    v-on:click="buttonTool.action(editor)"
  >
    <b-icon :icon="buttonTool.icon" />
  </b-button>
  <b-dropdown
    v-else
    :id="`${id}-toolbar-dropdown-${dropdownTool.name}`"
    v-b-tooltip
    :active="dropdownTool.toggled(editor)"
    :disabled="!dropdownTool.enabled(editor)"
    :text="dropdownTool.name"
    :title="dropdownTool.name"
    :variant="darkTheme ? 'dark' : 'secondary'"
    lazy
    split
    v-on:click="dropdownTool.action(editor)"
  >
    <b-dropdown-item
      v-for="[item, index] in dropdownTool.values.map((t, i) => [t, i])"
      :key="index"
      :active="item.toggled(editor)"
      :disabled="!item.enabled(editor)"
      v-on:click="item.action(editor)"
    >
      <span v-html="item.name" />
    </b-dropdown-item>
  </b-dropdown>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import {
    Tool,
    ToolButton,
    ToolDropdown,
  } from '@/components/editor/tools/Tool';
  import { StoreGetter } from '@/store/StoreGetter';
  import { EditorActions } from '@/components/editor/EditorActions';

  @Component({})
  export default class ToolbarItem extends Vue {
    @Prop()
    public readonly tool!: Tool;

    @Prop()
    public readonly editor!: EditorActions;

    @Prop()
    public readonly id!: string;

    @StoreGetter('theme/isDark')
    private readonly darkTheme!: boolean;

    private get dropdownTool(): ToolDropdown {
      return this.tool as ToolDropdown;
    }

    private get buttonTool(): ToolButton {
      return this.tool as ToolButton;
    }
  }
</script>
