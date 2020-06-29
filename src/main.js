import '@babel/polyfill'
import Vue from 'vue'
import VueRouter from 'vue-router'
import axios from 'axios'
import VueCookie from 'vue-cookie'
import VueAxios from 'vue-axios'
import Vuetify from 'vuetify'
import App from './App.vue'
import Authenticated from './components/authenticated.vue'
import Sutta from './components/sutta.vue'
import 'vuetify/dist/vuetify.min.css'

// eslint no-console 0 

Vue.use(VueAxios, axios);
Vue.use(VueRouter);
Vue.use(VueCookie);
Vue.use(Vuetify);

var routes = [{
    path: "/auth",
    component: Authenticated,
},{
    path: "/sutta",
    component: Sutta,
},{
    path: "*",
    redirect: "/sutta",
}];

var router = new VueRouter({
    routes,
});

Vue.config.productionTip = false;

var scvSingleton = new exports.ScvSingleton({
    window,
    navigator,
    Vue,
});

import cs from './i18n/vuetify/cs.ts';
import da from './i18n/vuetify/da.ts';
import de from './i18n/vuetify/de.ts';
import en from './i18n/vuetify/en.ts';
import fr from './i18n/vuetify/fr.ts';
import hi from './i18n/vuetify/hi.ts';
import is from './i18n/vuetify/is.ts';
import ja from './i18n/vuetify/ja.ts';
import nb from './i18n/vuetify/nb.ts';
import nl from './i18n/vuetify/nl.ts';
import pl from './i18n/vuetify/pl.ts';
import pt from './i18n/vuetify/pt.ts';
import ro from './i18n/vuetify/ro.ts';
import si from './i18n/vuetify/si.ts';
import vi from './i18n/vuetify/vi.ts';

const vuetifyOptions = {
  theme: { 
    dark: true,
    themes: {
        dark: {
            primary: '#82B1FF',
            secondary:'#00ff00',
            accent: '#82B1FF',
        },
    }
  },
  lang: {
    locales: { 
        cs,
        da, 
        de, 
        en, 
        fr,
        hi,
        is, 
        ja, 
        nb, 
        nl, 
        pl, 
        pt, 
        ro, 
        si,
        vi, 

    },
    current: 'en',
  },
};

console.log(`mounting #app ...`);
var vueRoot = new Vue({
    render: h => h(App),
    router,
    data: scvSingleton,
    //el: '#app',
    vuetify: new Vuetify(vuetifyOptions),
    mounted() {
        console.log(`vueRoot mounted`);
        scvSingleton.mounted(this);
    },
//});
}).$mount('#app')
console.log(`mounting #app OK`, typeof vueRoot);

//scvSingleton.mounted(vueRoot);

