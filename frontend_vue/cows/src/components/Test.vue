<!-- <script setup lang="ts">
import { getCurrentInstance } from 'vue';
import { ref } from 'vue';
import { increaseValue, myvalue } from "../testfunctions";
import { inject } from 'vue';
import { useGlobalsStore } from '@/stores/theglobals';

const globals = inject('myglobals');
const instance = getCurrentInstance();
const myglobals = instance?.appContext.config.globalProperties.myglobals;
const counter = ref(0);
let thevalue = ref(myvalue);
function increaseCounter() {
    counter.value = increaseValue(counter.value);
}

const globalsStore = useGlobalsStore();

</script> -->

<!-- 
<template>
    <div class="important">
        <h2>Hi Dave ;)</h2>
        <p>here is some info</p>
        <p>{{ globals }}</p>
        <button @click="globals.steps++">Add Steps </button>
        <button @click="globalsStore.name += '1'">Store Name : {{ globalsStore.name }} </button>
        <button @click="globalsStore.setName(globalsStore.name +2)">Store Name : {{ globalsStore.name }} </button>
        <p >Store Name : {{ globalsStore.getName }} </p>
        <button @click="console.log(globalsStore)">print store</button>
    </div>
</template> -->


<script setup lang="ts">
import { useGlobalsStore } from '@/stores/globals';
import { getCurrentInstance, onMounted } from 'vue';
import { ref } from 'vue';
import { testSomething } from '@/myfunctions/interactionfunctions';
const globalsStore = useGlobalsStore();

const testbutton = ref();
onMounted(() => {
    testbutton.value.addEventListener('click', testSomething);
})

// function log(): void {
//     console.log("log");
// }

</script>


<template>
    <div class="important">
        <!-- <button ref="testbutton" @click="testSomething"> Do it</button> -->
        <button ref="testbutton"> Do it</button>
    </div>
</template>