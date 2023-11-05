

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