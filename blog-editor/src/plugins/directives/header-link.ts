import { HEADER_LINK_PARAGRAPH_CLASS_NAME, makeReferencableId } from '@/interfaces/ContentElement';
import { BIcon } from 'bootstrap-vue';
import { createElement } from '@/components/editor/createElement';
import Vue from 'vue';
import { DetailConstructor } from '@/components/DetailConstructor';
import { scrollTo } from './scrollTo';

Vue.directive('header-link', (el, _, vnode) => {
    if (el.textContent && vnode.context) {
        const linkId = makeReferencableId(el.textContent);
        el.id = linkId;
        const existing: HTMLCollectionOf<HTMLAnchorElement> = el.getElementsByClassName(HEADER_LINK_PARAGRAPH_CLASS_NAME) as HTMLCollectionOf<HTMLAnchorElement>;
        if (existing.length > 0) {
            Array.from({ length: existing.length }, (v, k) => existing.item(k)).forEach((a) => {
                if (a) a.href = `#${linkId}`;
            });
        } else {
            const icon = new DetailConstructor({
                propsData: {
                    node: vnode.context.$createElement(BIcon, { props: { icon: 'paragraph' } }),
                },
            });
            icon.$mount(undefined, false);
            el.prepend(createElement('a', (a) => {
                a.classList.add(HEADER_LINK_PARAGRAPH_CLASS_NAME);
                a.appendChild(icon.$el);
                a.href = `#${linkId}`;
                a.onclick = (evt: MouseEvent) => {
                    evt.preventDefault();
                    const href = `#${linkId}`;
                    const el = document.querySelector<HTMLElement>(href);
                    if (el && vnode.context) {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                        // @ts-ignore
                        const router = vnode.context.$router;
                        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                        // @ts-ignore
                        const route = vnode.context.$route;

                        scrollTo(vnode.context, el.offsetTop, router, route, href);
                    }
                };
            }));
        }
    }
});