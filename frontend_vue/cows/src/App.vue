<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import CanvasMap from './components/CanvasMap.vue';
import LabeledInput from './components/LabeledInput.vue';
import LabeledInputWithSlider from './components/LabeledInputWithSlider.vue';
import SeparationLine from './components/SeparationLine.vue';
import MyButton from './components/MyButton.vue';
import SmartEvent from './components/SmartEvent.vue';
import Test from './components/Test.vue'
import './style.css'
import { useGlobalsStore } from './stores/globals';
import { onMounted, onBeforeUnmount, ref, getCurrentInstance } from 'vue';
import SmartEventList from './components/SmartEventList.vue';

const gs = useGlobalsStore();
const testevent = ref();

onMounted(() => {
  document.addEventListener('keydown', (ev) => {
    handleKeyDown(ev);
  })

  // console.log(testevent.value.getData());
});

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeyDown);
});

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'o') {
    // console.log(testevent.value.getData());
  }
}

</script>

<template>
  <header>
    <div class="wrapper">
      <h1>Hola DAVE</h1>
      <!-- <Test>  </Test> -->
      <!-- <Test>  </Test> -->
      <div style="display: flex;">

        <div class="leftside" style=" flex: 1; flex-direction: column;">
          <CanvasMap> </CanvasMap>
        </div>
        <div class="rightside" style=" flex: 1;  flex-direction: column;">

          <div class=" form-container" style="display: flex;flex-direction: column;">
            <LabeledInput :label-text='"cowId : "' :default-value="'1'" input-type="number" :min-value="1"
              @on-input="(n) => gs.cowId = n"></LabeledInput>
            <LabeledInput :label-text='"recordIntervalInSeconds : "' :default-value="'60'" input-type="number"
              :min-value="1" @on-input="(n) => gs.recordIntervalInSeconds = n"></LabeledInput>
            <LabeledInput :label-text='"recordDurationInDays : "' :default-value="'2'" input-type="number" :min-value="1"
              @on-input="(n) => gs.recordDurationInDays = n"></LabeledInput>
            <LabeledInput :label-text='"timeSpeedMultiplier : "' :default-value="'600'" input-type="number" :min-value="1"
              @on-input="(n) => gs.timeSpeedMultiplier = n"></LabeledInput>
            <SeparationLine></SeparationLine>
            <LabeledInputWithSlider :label-text="'Sensor Width in Meters'" :default-value="40" :min-value="30"
              :max-value="100"></LabeledInputWithSlider>
            <MyButton @click="console.log('fun')">Export Spaces and Sensors to JSON</MyButton>
            <SeparationLine></SeparationLine>
            <MyButton @click="console.log('TODO: Reset Timer')">Reset Timer</MyButton>
            <MyButton @click="console.log('TODO: Clear Records')">Export Spaces and Sensors to JSON</MyButton>
            <MyButton @click="console.log('TODO: Export as CSV')"> Clear Records</MyButton>
            <MyButton @click="console.log('TODO: Choose Files')">Choose Files</MyButton>
            <MyButton @click="console.log('TODO: Select and Combine CSV-Files')">Select and Combine CSV-Files</MyButton>
            <SeparationLine></SeparationLine>
            <h2>Configuration</h2>
            <!-- <MyButton @click="console.log('TODO: Add Event')">Add new Event</MyButton> -->
            <!-- <SmartEvent ref="testevent"></SmartEvent> -->
            <SmartEventList></SmartEventList>
          </div>
        </div>
      </div>
      <!-- <nav>
        <RouterLink to="/">Home</RouterLink>
      </nav> -->
    </div>
  </header>

  <!-- <RouterView /> -->
</template>
