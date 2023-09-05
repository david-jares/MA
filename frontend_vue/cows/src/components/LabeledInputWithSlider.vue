
<script setup lang="ts">
import { getCurrentInstance, onMounted, ref, toRefs } from 'vue';


const props = defineProps<{
    labelText: string;
    defaultValue: number;
    minValue: number;
    maxValue: number;
}>();

const inputValue = ref(props.defaultValue);

</script>


<template>
    <div class="important">
        <div style="display: flex;flex-direction: row;">
            <label for="myinput" style="flex: 0 1 250px;">{{ labelText }}</label>
            <input type="number" id="myinput" v-model="inputValue" @input="() => $emit('onInput', inputValue)"
                style="flex: 0 1 100px;" :min="minValue" :max="maxValue" />
            <input type="range" id="myinput" v-model="inputValue" @input="() => $emit('onInput', inputValue)" :min="minValue" :max="maxValue" step="1"
                style="flex: 0 1 100px;" />
        </div>
    </div>
</template>
