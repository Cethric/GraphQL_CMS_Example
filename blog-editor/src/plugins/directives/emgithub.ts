import Vue from 'vue';

Vue.directive('emgithub', (el, { value }) => {
    const div = el as HTMLDivElement;
    const script = div.getElementsByTagName('script').item(0);
    if (script) {
        script.src = div.dataset['src'] || '';
    } else {
        const script2 = document.createElement('script');
        script2.src = div.dataset['src'] || '';
        script2.async = false;
        script2.defer = false;
        // script2.
        div.appendChild(script2);
    }
});