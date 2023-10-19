<script setup lang="ts">
import { onMounted, ref } from 'vue';
import LabeledInput from './LabeledInput.vue';
import SeparationLine from './SeparationLine.vue';
import { useGlobalsStore } from '@/stores/globals';
import TooltipButton from './TooltipButton.vue';

const gs = useGlobalsStore();
let isFolded = ref(true);

const props = defineProps<{
    // event: SMARTEvent;
    id: number;
    description: string;
    drawTextVertically: boolean;
    fontScale: number;
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
    colorRGB: string;
    colorAlpha: number;
}>();

const description = ref();
const drawTextVertically = ref();
const fontScale = ref();
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
const colorRGB = ref();
const colorAlpha = ref();


description.value = props.description;
drawTextVertically.value = props.drawTextVertically;
fontScale.value = props.fontScale;
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
colorRGB.value = props.colorRGB;
colorAlpha.value = props.colorAlpha;

function updateGS(property: string, value: any) {
    console.log("updateGS");
    // debugger;
    gs.updateSmartEvent(props.id, property, value);
}



function toggleFolding() {
    isFolded.value = !isFolded.value;
    console.log("isFolded: " + isFolded.value)
}

function removeEvent() {
    console.log("removeEvent");

    gs.removeSmartEvent(props.id);
}



</script>

<template>
    <div>
        <SeparationLine></SeparationLine>
        <button @click="toggleFolding" style="width: 40px;" class="mybutton"> {{ isFolded == true ? "&rarr;" : "&darr;" }}
        </button>
        <button @click="removeEvent" class="mybutton"> Delete </button>
        <!-- <div v-if="isFolded">{{ description }}</div> -->
        <div v-show="!isFolded">
            <LabeledInput ref="description" :label-text="'description'" :input-type="'text'" :default-value="description"
                @onInput="(val) => updateGS('description', val)" :tooltip="gs.tipEventDescription">
            </LabeledInput>
            <LabeledInput ref="screenDescription" :label-text="'screen description'" :input-type="'text'"
                :default-value="description" @onInput="(val) => updateGS('screenDescription', val)"
                :tooltip="gs.tipEventDescription">
            </LabeledInput>
            <div style="display: flex;flex-direction: row; padding: 3px 0 3px 0; border: 1px solid #00000033;">
              <label style="flex: 0 1 250px; padding: 0 0 0 5px;"> Draw Text Vertically</label>
              <input type="checkbox" style="flex: 0 1 70px; width: 70px;" checked value="drawids"
                @input="(ev) => {drawTextVertically.value = !drawTextVertically.value;updateGS('drawTextVertically', drawTextVertically.value);}" />
            </div>
            <LabeledInput ref="fontScale" :label-text="'font scale'" :input-type="'number'"
                :default-value="fontScale" :min-value="0.1" :max-value="10"
                @onInput="(val) => updateGS('fontScale', val)" :tooltip="gs.tipEventId">
            </LabeledInput>
            <LabeledInput ref="eventid" :label-text="'id'" :input-type="'number'" :default-value="id.toString()"
                :min-value="1" :max-value="10000" @onInput="(val) => updateGS('id', val)" :tooltip="gs.tipEventId">
            </LabeledInput>

            <LabeledInput ref="metaeventId" :label-text="'metaevent-id'" :input-type="'number'" :default-value="metaeventId"
                :min-value="1" :max-value="10000" @onInput="(val) => updateGS(
                    'metaeventId', val)" :tooltip="gs.tipEventMetaeventId"></LabeledInput>

            <LabeledInput ref="profileIndex" :label-text="'profile-index'" :input-type="'number'"
                :default-value="profileIndex" :min-value="1" :max-value="10000"
                @onInput="(val) => updateGS('profileIndex', val)" :tooltip="gs.tipEventProfileIndex"></LabeledInput>

            <LabeledInput ref="spaceIds" :label-text="'space-ids (commaseperated)'" :input-type="'text'"
                :default-value="spaceIds" @onInput="(val) => updateGS('spaceIds', val)" :tooltip="gs.tipEventSpaceIds">
            </LabeledInput>

            <LabeledInput ref="capacityMetaPersonId" :label-text="'capacity Metaperson-id'" :input-type="'number'"
                :default-value="capacityMetaPersonId" @onInput="(val) => updateGS('capacityMetaPersonId', val)"
                :tooltip="gs.tipEventCapacity">
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

            <!-- <LabeledInput ref="period" :label-text="'period'" :input-type="'text'" :default-value="period"
                @onInput="(val) => updateGS('period', val)"></LabeledInput>

            <LabeledInput ref="periodInterval" :label-text="'period interval'" :input-type="'number'"
                :default-value="periodInterval" :min-value="1" @onInput="(val) => updateGS('periodInterval', val)">
            </LabeledInput> -->

            <LabeledInput ref="startTime" :label-text="'start time'" :input-type="'time'" :default-value="startTime"
                @onInput="(val) => updateGS('startTime', val)">
            </LabeledInput>

            <LabeledInput ref="endTime" :label-text="'end time'" :input-type="'time'" :default-value="endTime"
                @onInput="(val) => updateGS('endTime', val)">
            </LabeledInput>

            <LabeledInput ref="requiredAttendance" :label-text="'required attendance'" :input-type="'time'"
                :default-value="requiredAttendance" @onInput="(val) => updateGS('requiredAttendance', val)"></LabeledInput>

            <div style="display: flex;">
                <LabeledInput ref="colorRGB" :label-text="'color'" :input-type="'color'" :default-value="colorRGB"
                    @onInput="(val) => updateGS('colorRGB', val)">
                </LabeledInput>
                <input type="number" ref="colorAlpha" style="flex:1; width: 70px;" min="0" max="1" step="0.1" value="0.5"
                    @input="(ev: Event) => updateGS('colorAlpha', parseFloat((ev.target as HTMLInputElement).value))" />
            </div>
        </div>
    </div>
</template>
    <!-- min="0" max="1" step="0.1" value="0.5" @input="(ev)=>{if(ev.target && ev.target.value) {updateGS('colorAlpha',ev.target.value)}}"/> -->