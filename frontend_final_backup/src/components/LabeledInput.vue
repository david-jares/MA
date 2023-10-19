
<script setup lang="ts">
import { getCurrentInstance, onMounted, ref, toRefs, watch } from 'vue';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import { useGlobalsStore } from '@/stores/globals';

const props = defineProps<{
    labelText: string;
    defaultValue?: string;
    inputType: string;
    minValue?: number;
    maxValue?: number;
    tooltip?: string
}>();
let gs = useGlobalsStore();
let id = gs.nextUtilityId++;
let startValue: any = 0;
if (props.inputType == "number") {
    startValue = props.defaultValue ? props.defaultValue : 0;
} else if (props.inputType == "text") {
    startValue = props.defaultValue ? props.defaultValue : "";
} else if (props.inputType == "date") {
    startValue = props.defaultValue ? props.defaultValue : "2020-01-01";
} else if (props.inputType == "time") {
    startValue = props.defaultValue ? props.defaultValue : "00:00";
} else if (props.inputType == "color") {
    startValue = props.defaultValue ? props.defaultValue : "rgba(255,255,0,255)";
}
const inputValue = ref(startValue);
watch(inputValue, async (newValue, oldValue) => {
    // console.log("inputValue changed from "+oldValue+" to "+newValue);
    emit('onInput', newValue);
})
// console.log("Start value is: " + inputValue.value);

const emit = defineEmits<{
    (e: 'onInput', value: any): void;
}>();

defineExpose({
    getData
})

function getData() {
    return inputValue.value;
}
let tooltipClass = 'tooltip' + (gs.nextUtilityId++).toString();
// let tooltipClass = 'tooltip';
onMounted(() => {
    if (props.tooltip) {
        tippy('.'+tooltipClass, {
            content: props.tooltip,
        });
    }
});
</script>


<template>
    <div class="important">
        <div style="display: flex;flex-direction: row; padding: 3px 0 3px 0; border: 1px solid #00000033;">
            <label :for="id.toString()" style="flex: 1; padding: 0 0 0 5px;"
                :class="tooltipClass">{{ labelText }}</label>
            <input :type="inputType" :id="id.toString()" v-model="inputValue" style="flex: 1; width: 250px;"
                :min="minValue" :max="maxValue" />
            <!-- <input :type="inputType" id="myinput" v-model="inputValue" @input="() => $emit('onInput', inputValue)"
                style="flex: 0 1 100px;" :min="minValue" :max="maxValue" /> -->
            <!-- <input :type="inputType" id="myinput" v-model="props.defaultValue" @input="() => $emit('onInput', inputValue)"
                style="flex: 0 1 100px;" :min="minValue" :max="maxValue" /> -->
        </div>
    </div>
</template>
