<script setup lang="ts">
import { useGlobalsStore } from '@/stores/globals';
import { ref } from 'vue';

const gs = useGlobalsStore();

const props = defineProps<{
    id: number;
    space1: number;
    space2: number;
}>();

const id = ref(props.id);
const space1 = ref(props.space1);
const space2 = ref(props.space2);

</script>

<template>
    <div style="display: flex">
        <!-- <input type="number" v-model="space1" :default-value="space1" step="1" @input="(ev)=>gs.bridgeSpaceIdPairs.find(b=>b.id == id)!.space1Id = space1" /> -->
        <input type="number" v-model="space1" :default-value="space1" step="1"
            @input="(ev) => gs.bridgeSpaceIdPairs.find(b => b.id == id)!.space1Id = space1" />
        <input type="number" v-model="space2" :default-value="space2" step="1"
            @input="(ev) => gs.bridgeSpaceIdPairs.find(b => b.id == id)!.space2Id = space2" />
        <button style="margin-left: 10px; flex-grow: 1;" @click="gs.removeBridgeSpaceIdPair(id)">Delete</button>
    </div>
</template>