import * as Vue from 'vue'
import App from './app'
import router from  "./router/router"

window.onload = function () {

    const app = Vue.createApp({
        render () {
            return Vue.h( App, {});
        }
    });

    app.use(router);
    app.mount('#faucet')

};
