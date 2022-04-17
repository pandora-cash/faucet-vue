import {createRouter, createWebHistory} from "vue-router"

import Home from "src/views/home"
import HomeResults from "src/views/home_results"
import Form from "src/views/form"
import Faq from "src/views/faq"
import Results from "src/views/results"

const routes = [
    //{path: '/', component: Home },
    {path: '/', component: HomeResults },
    {path: '/form', component: Form },
    {path: '/faq', component: Faq },
    {path: '/results', component: Results },
];

export default createRouter({
    base: '/',
    history: createWebHistory(),
    routes
});

