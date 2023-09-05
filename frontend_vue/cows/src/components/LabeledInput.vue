
<script setup lang="ts">
import { getCurrentInstance, onMounted, ref, toRefs, watch } from 'vue';


const props = defineProps<{
    labelText: string;
    defaultValue?: string;
    inputType: string;
    minValue?: number;
    maxValue?: number;
}>();

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
console.log("Start value is: " + inputValue.value);

const emit = defineEmits<{
    (e: 'onInput', value: any): void;
}>();

defineExpose({
    getData
})

function getData() {
    return inputValue.value;
}
</script>


<template>
    <div class="important">
        <div style="display: flex;flex-direction: row;">
            <label for="myinput" style="flex: 0 1 250px;">{{ labelText }}</label>
            <input :type="inputType" id="myinput" v-model="inputValue" style="flex: 0 1 100px;" :min="minValue"
                :max="maxValue" />
            <!-- <input :type="inputType" id="myinput" v-model="inputValue" @input="() => $emit('onInput', inputValue)"
                style="flex: 0 1 100px;" :min="minValue" :max="maxValue" /> -->
            <!-- <input :type="inputType" id="myinput" v-model="props.defaultValue" @input="() => $emit('onInput', inputValue)"
                style="flex: 0 1 100px;" :min="minValue" :max="maxValue" /> -->
        </div>
    </div>
</template>
