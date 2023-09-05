<script setup lang="ts">
import { ref } from 'vue';
import LabeledInput from './LabeledInput.vue';
import { useGlobalsStore } from '@/stores/globals';
const gs = useGlobalsStore();

const description = ref();
const cowId = ref();
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




function getData() {
    let data = {
        description: description.value.getData(),
        cowId: cowId.value.getData(),
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

const methods = {
    test() {
        console.log('Button clicked!');
    }
}

defineExpose({
    getData
})



</script>

<template>
    <div>
        <LabeledInput ref="description" :label-text="'description'" :input-type="'text'"></LabeledInput>
        <LabeledInput ref="cowId" :label-text="'id'" :input-type="'number'" :default-value="gs.getNextEventID().toString()"
            :min-value="1" :max-value="10000"></LabeledInput>
        <LabeledInput ref="metaeventId" :label-text="'metaevent-id'" :input-type="'number'" :default-value="'1'"
            :min-value="1" :max-value="10000"></LabeledInput>
        <LabeledInput ref="profileIndex" :label-text="'profile-index'" :input-type="'number'" :default-value="'1'"
            :min-value="1" :max-value="10000"></LabeledInput>
        <LabeledInput ref="spaceIds" :label-text="'space-ids (commaseperated)'" :input-type="'text'"></LabeledInput>
        <LabeledInput ref="capacityMetaPersonId" :label-text="'capacity Metaperson-id'" :input-type="'number'">
        </LabeledInput>
        <LabeledInput ref="capacityRangeMin" :label-text="'capacity range min'" :input-type="'number'" :default-value="'0'"
            :min-value="0">
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
    <LabeledInput ref="endTime" :label-text="'end time'" :input-type="'time'" :default-value="'23:59'"></LabeledInput>
    <LabeledInput ref="requiredAttendance" :label-text="'required attendance'" :input-type="'time'"
        :default-value="'02:00'"></LabeledInput>
    <LabeledInput ref="color" :label-text="'color'" :input-type="'color'" :default-value="'rgba(255,255,0,255)'">
    </LabeledInput>
</div></template>