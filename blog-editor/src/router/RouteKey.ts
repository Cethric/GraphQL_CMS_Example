import { createDecorator } from 'vue-class-component';
import { ComponentOptions } from 'vue';
import { Vue } from 'vue-property-decorator';


export function RouteKey(routeKey?: string) {
    return createDecorator((options: ComponentOptions<Vue>, key: string) => {
        options.computed = options.computed || {};
        options.computed[key] = {
            cache: false,
            get: function() {
                const self: {
                    $route: { [key: string]: unknown };
                } = (this as unknown) as { $route: { [key: string]: unknown } };
                return self.$route[routeKey || key];
            },
        };
    });
}