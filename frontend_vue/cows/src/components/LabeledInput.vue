
<script setup lang="ts">
import { getCurrentInstance, onMounted, ref, toRefs } from 'vue';


const props = defineProps<{
    labelText: string;
    defaultValue: number;
    inputType: string;
    minValue?: number;
    maxValue?: number;
}>();

const inputValue = ref(props.defaultValue);

// function emitInputValue() {
//     getCurrentInstance()?.emit('onInput', inputValue.value);
// }
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
