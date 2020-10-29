/** @format */

import Vue from 'vue';

interface MetaManagerInput {
    description: string;

    [key: string]: string;
}

export class MetaManager extends Vue {
    // eslint-disable-next-line prettier/prettier
    protected static get defaultValue(): MetaManagerInput {
        return {
            description: 'A really bad blogging application',
        };
    }

    beforeDestroy() {
        this.resetHeadMeta();
    }

    private static get metaElements(): HTMLMetaElement[] {
        const result = document.getElementsByTagName('meta');
        return Array.from(result);
    }

    protected updateHeadMeta(title: string, input: MetaManagerInput): void {
        document.title = title;
        console.log(MetaManager.metaElements);
        MetaManager.metaElements.forEach((e) => Object.prototype.hasOwnProperty.call(input, e.name.toLowerCase()) ? e.content = input[e.name.toLowerCase()] : undefined);
    }

    protected resetHeadMeta() {
        this.updateHeadMeta('Blog Editor', MetaManager.defaultValue);
    }
}
