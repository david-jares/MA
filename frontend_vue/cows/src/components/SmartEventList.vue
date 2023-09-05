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
    // gs.smartEvents.push({
    //     id: gs.getNextEventID(),
    //     description: "test",
    //     // cowId: '1',
    //     metaeventId: 1,
    //     profileIndex: 1,
    //     spaceIds: '1',
    //     capacityMetaPersonId: 1,
    //     capacityRangeMin: 1,
    //     capacityRangeMax: 10000,
    //     startDate: "2021-01-01",
    //     endDate: "2021-02-01",
    //     period: 'day',
    //     periodInterval: 1,
    //     startTime: "00:00",
    //     endTime: "23:59",
    //     requiredAttendance: '02:00',
    //     color: "red"})
}

</script>



<template>
    <div style="display:flex; flex-direction: column;">
        <MyButton @click="addEvent">Add New Event</MyButton>
        <SmartEvent v-for="event in gs.smartEvents" :key="event.id" v-bind="event"></SmartEvent>
    </div>
</template>