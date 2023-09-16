<script setup lang="ts">
import { useGlobalsStore } from '@/stores/globals';
import { ref } from 'vue';

const gs = useGlobalsStore();

const displayType = ref(0);
const displayTypes = ["Image", "Point", "Id", "AmountOfCows"];
const textValue = ref(displayTypes[0]);
gs.cowDisplayMode = textValue.value;
function selectNext() {
    if (displayType.value < displayTypes.length - 1) {
        displayType.value++;
    }
    textValue.value = displayTypes[displayType.value];
    gs.cowDisplayMode = textValue.value;
}
function selectPrevious() {
    if (displayType.value > 0) {
        displayType.value--;
    }
    textValue.value = displayTypes[displayType.value];
    gs.cowDisplayMode = textValue.value;
}

</script>

<template>
    <div style="display: flex; flex-direction: row;justify-content: space-between; align-items: center;">
        <p style="display: inline;  ; padding: 0 10px 0 5px;"  > Cow Visualisation </p>

        <button class="elem" @click="selectPrevious">&larr;</button>
        <div style="display: inline;  text-align: center; padding: 0 60px 0 60px;" class="elem" > {{ textValue }}</div>
        <button class="elem" @click="selectNext">&rarr;</button>
    </div>
</template>

<style scoped>
.elem {
    flex: 1;
}
</style>