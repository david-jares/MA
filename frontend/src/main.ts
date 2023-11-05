import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import router from './router'
import App from './App.vue'

import { useGlobalsStore } from './stores/globals'

const app = createApp(App)
export const EventBus = app;

app.use(createPinia())
app.use(router)
const globalsStore = useGlobalsStore();

app.mount('#app')

// events
export const OnCowIDChanged = 'OnCowIDChanged';