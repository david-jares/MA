<script setup lang="ts">
import { useGlobalsStore } from '@/stores/globals';
import LabeledInput from './LabeledInput.vue';
import SeparationLine from './SeparationLine.vue';
const gs = useGlobalsStore();
</script>

<template>
    <div>
        <div style="padding-left: 5px;">Scenario Learning</div>

        <LabeledInput label-text="Start Date (yyyy-mm-dd)" :input-type="'text'"
            :default-value="gs.scenarioLearning_startDate" @on-input="(n) => gs.scenarioLearning_startDate = n">
        </LabeledInput>

        <LabeledInput label-text="End Date (yyyy-mm-dd)" :input-type="'text'" :default-value="gs.scenarioLearning_endDate"
            @on-input="(n) => gs.scenarioLearning_endDate = n"></LabeledInput>

        <LabeledInput label-text="Unit" :input-type="'number'" :min-value="1"
            :default-value="gs.scenarioLearning_unit.toString()" @on-input="(n) => gs.scenarioLearning_unit = n">
        </LabeledInput>

        <LabeledInput label-text="Validity" :input-type="'number'" :min-value="1"
            :default-value="gs.scenarioLearning_validity.toString()" @on-input="(n) => gs.scenarioLearning_validity = n">
        </LabeledInput>

        <LabeledInput label-text="Smoothing ( EMA/SMA )" :input-type="'text'" :default-value="gs.scenarioLearning_smoothing"
            @on-input="(n) => gs.scenarioLearning_smoothing = n"></LabeledInput>

        <LabeledInput label-text="Window" :input-type="'number'" :min-value="1"
            :default-value="gs.scenarioLearning_window.toString()" @on-input="(n) => gs.scenarioLearning_window = n">
        </LabeledInput>

        <LabeledInput label-text="time-thresh" :input-type="'number'" :min-value="1"
            :default-value="gs.scenarioLearning_timeThreshold.toString()"
            @on-input="(n) => gs.scenarioLearning_timeThreshold = n"></LabeledInput>

        <LabeledInput label-text="occ-thresh" :input-type="'number'" :min-value="1"
            :default-value="gs.scenarioLearning_occThreshold.toString()"
            @on-input="(n) => gs.scenarioLearning_occThreshold = n"></LabeledInput>


        <SeparationLine></SeparationLine>

        <div>Scenario Generation</div>
        <!-- number refers to the number of people to simulate -->

        <LabeledInput label-text="Number of Cows" :input-type="'number'" :min-value="1"
            :default-value="gs.scenarioGeneration_numberOfCows.toString()" @on-input="(n) => gs.scenarioGeneration_numberOfCows = n"></LabeledInput>

        <LabeledInput label-text="Number of Events" :input-type="'number'" :min-value="1"
            :default-value="gs.scenarioGeneration_numberOfEvents.toString()" @on-input="(n) => gs.scenarioGeneration_numberOfEvents = n">
        </LabeledInput>

        <LabeledInput label-text="Start Date (yyyy-mm-dd)" :input-type="'text'"
            :default-value="gs.scenarioGeneration_startDate" @on-input="(n) => gs.scenarioGeneration_startDate = n"></LabeledInput>

        <LabeledInput label-text="End Date (yyyy-mm-dd)" :input-type="'text'" :default-value="gs.scenarioGeneration_endDate"
            @on-input="(n) => gs.scenarioGeneration_endDate = n"></LabeledInput>
    </div>
</template>