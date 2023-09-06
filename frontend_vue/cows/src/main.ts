import './assets/main.css'

import { VueElement, createApp } from 'vue'
import { createPinia } from 'pinia'

import router from './router'
import App from './App.vue'

// import {combined} from './playground/myglobals';
import {ref} from 'vue';
import { useGlobalsStore } from './stores/globals'

const app = createApp(App)
export const EventBus = app;

app.use(createPinia())
app.use(router)
const globalsStore = useGlobalsStore();
// app.config.globalProperties.myglobals = combined;
// let globals = ref(combined);
// app.provide('myglobals', globals);
app.mount('#app')


// events
export const OnCowIDChanged = 'OnCowIDChanged';