<script setup lang="ts">
import { onMounted, ref } from 'vue';
import LabeledInput from './LabeledInput.vue';
import SeparationLine from './SeparationLine.vue';
import { useGlobalsStore } from '@/stores/globals';

const gs = useGlobalsStore();
let isFolded = ref(false);

const props = defineProps<{
    // event: SMARTEvent;
    id: number;
    description: string;
    metaeventId: number;
    profileIndex: number;
    spaceIds: string;
    capacityMetaPersonId: number;
    capacityRangeMin: number;
    capacityRangeMax: number;
    startDate: string;
    endDate: string;
    period: string;
    periodInterval: number;
    startTime: string;
    endTime: string;
    requiredAttendance: string;
    color: string;
}>();

const description = ref();
const eventid = ref();
const metaeventId = ref();
const profileIndex = ref();
const spaceIds = ref();
const capacityMetaPersonId = ref();
const capacityRangeMin = ref();
const capacityRangeMax = ref();
const startDate = ref();
const endDate = ref();
const period = ref();
const periodInterval = ref();
const startTime = ref();
const endTime = ref();
const requiredAttendance = ref();
const color = ref();

// onMounted(() => {
// console.log("props.description");
// console.log(props.description);
description.value = props.description;
eventid.value = props.id;
metaeventId.value = props.metaeventId;
profileIndex.value = props.profileIndex;
spaceIds.value = props.spaceIds;
capacityMetaPersonId.value = props.capacityMetaPersonId;
capacityRangeMin.value = props.capacityRangeMin;
capacityRangeMax.value = props.capacityRangeMax;
startDate.value = props.startDate;
endDate.value = props.endDate;
period.value = props.period;
periodInterval.value = props.periodInterval;
startTime.value = props.startTime;
endTime.value = props.endTime;
requiredAttendance.value = props.requiredAttendance;
color.value = props.color;
// })



function getData() {
    let data = {
        description: description.value.getData(),
        id: eventid.value.getData(),
        metaeventId: metaeventId.value.getData(),
        profileIndex: profileIndex.value.getData(),
        spaceIds: spaceIds.value.getData(),
        capacityMetaPersonId: capacityMetaPersonId.value.getData(),
        capacityRangeMin: capacityRangeMin.value.getData(),
        capacityRangeMax: capacityRangeMax.value.getData(),
        startDate: startDate.value.getData(),
        endDate: endDate.value.getData(),
        period: period.value.getData(),
        periodInterval: periodInterval.value.getData(),
        startTime: startTime.value.getData(),
        endTime: endTime.value.getData(),
        requiredAttendance: requiredAttendance.value.getData(),
        color: color.value.getData(),
    }
    return data;
}

console.log("eventid ");
console.log(eventid.value);
function updateGS(property: string, value: any) {
    console.log("updateGS");
    gs.updateSmartEvent(props.id, property, value);
}

defineExpose({
    getData
})

function toggleFolding() {
    // isFolded.value = !isFolded.value;
    console.log("isFolded: " + isFolded.value)
}


</script>

<template>
    <div>
        <SeparationLine></SeparationLine>
        <button @click="toggleFolding"> {{ isFolded == true ? "&rarr;" : "&darr;" }} </button>
        <!-- <div v-if="isFolded">{{ description }}</div> -->
        <div v-show="!isFolded">
            <LabeledInput ref="description" :label-text="'description'" :input-type="'text'" :default-value="description"
                @onInput="(val) => updateGS('description', val)"></LabeledInput>

            <LabeledInput ref="eventid" :label-text="'id'" :input-type="'number'" :default-value="id.toString()"
                :min-value="1" :max-value="10000" @onInput="(val) => updateGS('id', val)"></LabeledInput>

            <LabeledInput ref="metaeventId" :label-text="'metaevent-id'" :input-type="'number'"
                :default-value="metaeventId" :min-value="1" :max-value="10000" @onInput="(val) => updateGS(
                    'metaeventId', val)"></LabeledInput>

            <LabeledInput ref="profileIndex" :label-text="'profile-index'" :input-type="'number'"
                :default-value="profileIndex" :min-value="1" :max-value="10000"
                @onInput="(val) => updateGS('profileIndex', val)"></LabeledInput>

            <LabeledInput ref="spaceIds" :label-text="'space-ids (commaseperated)'" :input-type="'text'"
                :default-value="spaceIds" @onInput="(val) => updateGS('spaceIds', val)"></LabeledInput>

            <LabeledInput ref="capacityMetaPersonId" :label-text="'capacity Metaperson-id'" :input-type="'number'"
                :default-value="capacityMetaPersonId" @onInput="(val) => updateGS('capacityMetaPersonId', val)">
            </LabeledInput>

            <LabeledInput ref="capacityRangeMin" :label-text="'capacity range min'" :input-type="'number'"
                :default-value="capacityRangeMin" :min-value="0" @onInput="(val) => updateGS('capacityRangeMin', val)">
            </LabeledInput>

            <LabeledInput ref="capacityRangeMax" :label-text="'capacity range max'" :input-type="'number'"
                :default-value="capacityRangeMax" @onInput="(val) => updateGS('capacityRangeMax', val)"></LabeledInput>

            <LabeledInput ref="startDate" :label-text="'start-date'" :input-type="'date'" :default-value="startDate"
                @onInput="(val) => updateGS('startDate', val)">
            </LabeledInput>

            <LabeledInput ref="endDate" :label-text="'end-date'" :input-type="'date'" :default-value="endDate"
                @onInput="(val) => updateGS('endDate', val)">
            </LabeledInput>

            # <LabeledInput ref="period" :label-text="'period'" :input-type="'text'" :default-value="period"
                @onInput="(val) => updateGS('period', val)"></LabeledInput>

            <LabeledInput ref="periodInterval" :label-text="'period interval'" :input-type="'number'"
                :default-value="periodInterval" :min-value="1" @onInput="(val) => updateGS('periodInterval', val)">
            </LabeledInput>

            <LabeledInput ref="startTime" :label-text="'start time'" :input-type="'time'" :default-value="startTime"
                @onInput="(val) => updateGS('startTime', val)">
            </LabeledInput>

            <LabeledInput ref="endTime" :label-text="'end time'" :input-type="'time'" :default-value="endTime"
                @onInput="(val) => updateGS('endTime', val)">
            </LabeledInput>

            <LabeledInput ref="requiredAttendance" :label-text="'required attendance'" :input-type="'time'"
                :default-value="requiredAttendance" @onInput="(val) => updateGS('requiredAttendance', val)"></LabeledInput>

            <LabeledInput ref="color" :label-text="'color'" :input-type="'color'" :default-value="color"
                @onInput="(val) => updateGS('color', val)">
            </LabeledInput>
        </div>
    </div>
    <!-- <div>
        <SeparationLine></SeparationLine>
        <button @click="toggleFolding"> {{ isFolded == true ? "&rarr;" : "&darr;" }} </button>
         <div v-if="isFolded">{{ description }}</div>
        <div v-show="!isFolded">
            <LabeledInput ref="description" :label-text="'description'" :input-type="'text'"
                :default-value="description.toString()" @onInput="updateGS()"></LabeledInput>
            <LabeledInput ref="eventid" :label-text="'id'" :input-type="'number'" :default-value="id.toString()"
                :min-value="1" :max-value="10000" @onInput="updateGS()"></LabeledInput>
            <LabeledInput ref="test" :label-text="'test'" :input-type="'text'" :default-value="'writesomething'"
                @onInput="updateGS()"></LabeledInput> 

            <LabeledInput ref="metaeventId" :label-text="'metaevent-id'" :input-type="'number'" :default-value="'1'"
                :min-value="1" :max-value="10000"></LabeledInput>
            <LabeledInput ref="profileIndex" :label-text="'profile-index'" :input-type="'number'" :default-value="'1'"
                :min-value="1" :max-value="10000"></LabeledInput>
            <LabeledInput ref="spaceIds" :label-text="'space-ids (commaseperated)'" :input-type="'text'"></LabeledInput>
            <LabeledInput ref="capacityMetaPersonId" :label-text="'capacity Metaperson-id'" :input-type="'number'">
            </LabeledInput>
            <LabeledInput ref="capacityRangeMin" :label-text="'capacity range min'" :input-type="'number'"
                :default-value="'0'" :min-value="0">
            </LabeledInput>
            <LabeledInput ref="capacityRangeMax" :label-text="'capacity range max'" :input-type="'number'"
                :default-value="'1000'"></LabeledInput>
            <LabeledInput ref="startDate" :label-text="'start-date'" :input-type="'date'" :default-value="'2020-01-01'">
            </LabeledInput>
            <LabeledInput ref="endDate" :label-text="'end-date'" :input-type="'date'" :default-value="'2020-03-01'">
            </LabeledInput>
            <LabeledInput ref="period" :label-text="'period'" :input-type="'text'" :default-value="'day'"></LabeledInput>
            <LabeledInput ref="periodInterval" :label-text="'period interval'" :input-type="'number'" :default-value="'1'"
                :min-value="1">
            </LabeledInput>
            <LabeledInput ref="startTime" :label-text="'start time'" :input-type="'time'" :default-value="'00:00'">
            </LabeledInput>
            <LabeledInput ref="endTime" :label-text="'end time'" :input-type="'time'" :default-value="'23:59'">
            </LabeledInput>
            <LabeledInput ref="requiredAttendance" :label-text="'required attendance'" :input-type="'time'"
                :default-value="'02:00'"></LabeledInput>
            <LabeledInput ref="color" :label-text="'color'" :input-type="'color'" :default-value="'rgba(255,255,0,255)'">
            </LabeledInput>
        </div>
    </div> -->
</template>