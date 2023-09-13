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

//----------------------------------------------
//try to save and load store in browser
// store key for local storage
// const STORE_KEY = 'myStore';

// // load store state from local storage
// const storedState = localStorage.getItem(STORE_KEY);
// const initialState = storedState ? JSON.parse(storedState) : undefined;

// // create the store instance with the initial state
// const globalsStore = initialState? useGlobalsStore(initialState): useGlobalsStore();

// // save store state to local storage on every mutation
// globalsStore.$subscribe((mutation) => {
//   localStorage.setItem(STORE_KEY, JSON.stringify(globalsStore.$state));
// });
//----------------------------------------------


// app.config.globalProperties.myglobals = combined;
// let globals = ref(combined);
// app.provide('myglobals', globals);
app.mount('#app')








// events
export const OnCowIDChanged = 'OnCowIDChanged';