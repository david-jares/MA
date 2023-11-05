<script setup lang="ts">
import { ref } from 'vue';
import MyButton from './MyButton.vue';
import SmartEvent from './SmartEvent.vue';
import { useGlobalsStore } from '@/stores/globals';

let gs = useGlobalsStore()
let events = ref([]);

function addEvent() {
    console.log("addEvent");
    let eventId = gs.addDefaultEvent();
}

</script>



<template>
    <div style="display:flex; flex-direction: column;">
        <button @click="addEvent"  class="mybutton">Add New Event</button>
        <SmartEvent v-for="event in gs.smartEvents" :key="event.id" v-bind="event"></SmartEvent>
    </div>
</template>