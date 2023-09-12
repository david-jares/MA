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
import { onMounted, onBeforeUnmount, ref, getCurrentInstance, watch } from 'vue';
import SmartEventList from './components/SmartEventList.vue';
import Console from './components/Console.vue';
import { exportSensorsAndSpaces, saveAsCsv, selectFiles } from './myfunctions/filefunctions';
import { EventBus, OnCowIDChanged } from './main';
import { clearConsoleOutput } from './myfunctions/utilityfunctions';
import { drawScene } from './myfunctions/drawingfunctions';
import CanvasScalable from './components/CanvasScalable.vue';
const gs = useGlobalsStore();
const testevent = ref();

onMounted(() => {
  document.addEventListener('keydown', (ev) => {
    handleKeyDown(ev);
  })

  watch([gs.smartEvents, gs.sensorWidthInMeters], (newValue, oldValue) => {
    console.log("gs.smartEvents changed from " + oldValue + " to " + newValue);
    // updateScene();
    drawScene();
  });

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

const handleExportSpacesAndSensorsToJSON = (event: any) => {
  console.log("handleExportSpacesAndSensorsToJSON");
  exportSensorsAndSpaces();

}
const handleResetTimer = (event: any) => {
  console.log("handleRestTimer");
  gs.loops = 0
}
const handleClearRecords = (event: any) => {
  console.log("handleClearRecords");
  gs.recordedData.length = 0;
  clearConsoleOutput();
}
const handleExportRecordingAsCSV = (event: any) => {
  console.log("handleSave");
  saveAsCsv(gs.recordedData);
}

const handleCowIDChanged = (cowId: string) => {
  console.log("handleCowIDChanged");
  gs.cowId = cowId;
  // getCurrentInstance()?.emit(OnCowIDChanged, cowId);
  // saveAsCsv(gs.recordedData);
}
</script>

<template>
  <header>
    <div class="wrapper">
      <h1>Weideinsight Setup</h1>
      <div style="display: flex;">
        <div class="leftside" style=" flex: 1; flex-direction: column;">
          <CanvasScalable></CanvasScalable>
          <!-- <CanvasMap> </CanvasMap> -->
          <Console></Console>
        </div>
        <div class="rightside" style=" flex: 1;  flex-direction: column;">

          <div class=" form-container" style="display: flex;flex-direction: column;">

            <LabeledInput :label-text='"cowId : "' :default-value="'1'" input-type="number" :min-value="1"
              @on-input="(n) => handleCowIDChanged(n)"></LabeledInput>

            <LabeledInput :label-text='"recordIntervalInSeconds : "' :default-value="'60'" input-type="number"
              :min-value="1" @on-input="(n) => gs.recordIntervalInSeconds = n"></LabeledInput>

            <LabeledInput :label-text='"recordDurationInDays : "' :default-value="'2'" input-type="number" :min-value="1"
              @on-input="(n) => gs.recordDurationInDays = n"></LabeledInput>

            <LabeledInput :label-text='"timeSpeedMultiplier : "' :default-value="'600'" input-type="number" :min-value="1"
              @on-input="(n) => gs.timeSpeedMultiplier = n"></LabeledInput>

            <SeparationLine></SeparationLine>

            <LabeledInput :label-text="'Sensor Width in Meters'" :default-value="'40'" input-type="number" :min-value="30"
              :max-value="100" @on-input="(n) => gs.sensorWidthInMeters = n"></LabeledInput>

            <SeparationLine></SeparationLine>

            <div class="rowequal">
              <button @click="handleResetTimer" class="mybutton" style="height: 30px;">Reset Timer</button>
              <button @click="handleClearRecords" class="mybutton" style="height: 30px;"> Clear Records</button>
            </div>

            <div class="rowequal">
              <button @click="handleExportSpacesAndSensorsToJSON" class="mybutton">Export Spaces and Sensors to
                JSON</button>
              <button @click="handleExportRecordingAsCSV" class="mybutton">Export Recording to CSV</button>
              <button @click="selectFiles()" class="mybutton">Select and Combine CSV-Files</button>
            </div>

            <SeparationLine></SeparationLine>

            <h2>Configuration</h2>

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
