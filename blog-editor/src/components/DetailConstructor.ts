import Vue, { FunctionalComponentOptions, VNode } from 'vue';
import { RecordPropsDefinition } from 'vue/types/options';

interface RenderNodeProps {
    node: VNode
}

const RenderNode: FunctionalComponentOptions<RenderNodeProps, RecordPropsDefinition<RenderNodeProps>> = {
    functional: true,
    props: {
        'node': {
            type: Object,
        },
    },
    render(): VNode | VNode[] {
        const self: { node: VNode } = this as unknown as RenderNodeProps;
        // eslint-disable-next-line prettier/prettier
        const node: VNode | undefined = self.node;
        return node ? node : [];
    },
};
export const DetailConstructor = Vue.extend<RenderNodeProps>(RenderNode);