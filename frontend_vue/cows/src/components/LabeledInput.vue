
<script setup lang="ts">
import { getCurrentInstance, onMounted, ref, toRefs } from 'vue';


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
// const inputValue = ref(props.defaultValue? props.defaultValue : props.inputType == "text" ? "": 0);

// function emitInputValue() {
//     getCurrentInstance()?.emit('onInput', inputValue.value);
// }
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
            <input :type="inputType" id="myinput" v-model="inputValue" @input="() => $emit('onInput', inputValue)"
                style="flex: 0 1 100px;" :min="minValue" :max="maxValue" />
        </div>
    </div>
</template>
