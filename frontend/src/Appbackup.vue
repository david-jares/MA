<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import LabeledInput from './components/LabeledInput.vue';
import LabeledInputWithSlider from './components/LabeledInputWithSlider.vue';
import SeparationLine from './components/SeparationLine.vue';
import MyButton from './components/MyButton.vue';
import SmartEvent from './components/SmartEvent.vue';
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
import BridgeList from './components/BridgeList.vue';
import BridgeEntry from './components/BridgeEntry.vue';
import CowDisplayPicker from './components/CowDisplayPicker.vue';
import axios from 'axios';
import { getStatusLearningAPI } from './myfunctions/axiosRequests';
import ScenarioGenerationConfig from './components/ScenarioGenerationConfig.vue';
import {fixthatShit} from './myfunctions/debugfunctions';
// import { Exportable_TimeProfile } from './myfunctions/model';
const gs = useGlobalsStore();
const testevent = ref();
// const serverURL = process.env.VUE_APP_SERVER_URL;
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
  gs.ResetTimePassed();
}
const handleClearRecords = (event: any) => {
  console.log("handleClearRecords");
  gs.recordings.length = 0;
  clearConsoleOutput();
}
const handleExportRecordingAsCSV = (event: any) => {
  console.log("handleSave");
  // saveAsCsv(gs.recordings);
  let data = gs.recordings.map(x => { return { timeStamp: x.timeStamp, cattleId: x.cattleId, space: x.space.id } });
  saveAsCsv(data);
  // saveAsCsv(gs.recordings);
}

const handleCowIDChanged = (cowId: string) => {
  console.log("handleCowIDChanged");
  gs.cowId = cowId;
  // getCurrentInstance()?.emit(OnCowIDChanged, cowId);
  // saveAsCsv(gs.recordedData);
}


</script>

<template>
  <header style="background-color: white; padding: 50px;">
    <div class="wrapper">
      <h1>Weideinsight</h1>
      <!-- <div style="display: flex;">
        <div class="leftside" style=" flex: 1; flex-direction: column;">
          <CanvasScalable></CanvasScalable>
          <Console></Console>
        </div>
        <div class="rightside" style=" flex: 1;  flex-direction: column;">
          <div class=" form-container" style="display: flex;flex-direction: column;">
            <SeparationLine></SeparationLine>
            <p style="padding-left: 5px;"> Press I = Display HotKeys </p>
            <SeparationLine></SeparationLine>
            <div class="rowequal">
              <button @click="handleResetTimer" class="mybutton" style="height: 30px;">Reset Timer</button>
              <button @click="handleClearRecords" class="mybutton" style="height: 30px;"> Clear Records</button>
            </div>

            <div class="rowequal">
              <button @click="handleExportSpacesAndSensorsToJSON" style="height: 30px;" class="mybutton">Export Config to
                JSON</button>
              <button @click="handleExportRecordingAsCSV" style="height: 30px;" class="mybutton">Export Recording to
                CSV</button>
            </div>
            <div class="rowequal">
              <button style="height: 30px;" class="mybutton">Export Config to Server</button>
              <button style="height: 30px;" class="mybutton">Import Config From Server</button>
            </div>
            <SeparationLine></SeparationLine>
            <div style="display: flex;">
              <LabeledInput label-text="Color Area" :input-type="'color'" :default-value="gs.colorPolygon"
                @onInput="(val) => gs.colorPolygon = val">
              </LabeledInput>
              <input type="number" style="flex:1; " min="0" max="1" step="0.05" :value="gs.colorAlphaPolygon" @input="(ev: Event) => {
                gs.colorAlphaPolygon = parseFloat((ev.target as HTMLInputElement).value);
              }" />
            </div>
            <div style="display: flex;">
              <LabeledInput label-text="Color Spaces Pasture" :input-type="'color'" :default-value="gs.colorSpacesPasture"
                @onInput="(val) => gs.colorSpacesPasture = val">
              </LabeledInput>
              <input type="number" style="flex: 1;" min="0" max="1" step="0.05" :value="gs.colorAlphaSpacesPasture"
                @input="(ev: Event) => { gs.colorAlphaSpacesPasture = parseFloat((ev.target as HTMLInputElement).value) }" />
            </div>
            <div style="display: flex;">
              <LabeledInput label-text="Color Spaces Barn" :input-type="'color'" :default-value="gs.colorSpacesBarn"
                @onInput="(val) => gs.colorSpacesBarn = val">
              </LabeledInput>
              <input type="number" style="flex: 1; " min="0" max="1" step="0.05" :value="gs.colorAlphaSpacesBarn"
                @input="(ev: Event) => { gs.colorAlphaSpacesBarn = parseFloat((ev.target as HTMLInputElement).value) }" />
            </div>
            <div style="display: flex;flex-direction: row; padding: 3px 0 3px 0; border: 1px solid #00000033;">
              <label style="flex: 0 1 250px; padding: 0 0 0 5px;"> Display Space IDs </label>
              <input type="checkbox" style="flex: 0 1 70px; width: 70px;" checked value="drawids"
                @input="(ev) => gs.drawSpaceIds = !gs.drawSpaceIds" />
            </div>
            <SeparationLine></SeparationLine>
            <CowDisplayPicker></CowDisplayPicker>
            <LabeledInput label-text="Cow ID : " :default-value="gs.cowId" input-type="number" :min-value="1"
              @on-input="(n) => handleCowIDChanged(n)"></LabeledInput>

            <LabeledInput label-text="Record Interval in Minutes : "
              :default-value="(Math.round(gs.recordIntervalInSeconds / 60)).toString()" input-type="number" :min-value="1"
              @on-input="(n) => gs.recordIntervalInSeconds = n * 60"></LabeledInput>

            <LabeledInput label-text="Record Duration In Days : " :default-value="gs.recordDurationInDays.toString()"
              input-type="number" :min-value="1" @on-input="(n) => gs.recordDurationInDays = n"></LabeledInput>

            <LabeledInput label-text='Steps per Second : ' :default-value="gs.stepsPerSecond.toString()"
              input-type="number" :min-value="1" @on-input="(n) => gs.stepsPerSecond = n"></LabeledInput>

            <SeparationLine></SeparationLine>

            <LabeledInput label-text="Sensor Width in Meters" :default-value="gs.sensorWidthInMeters.toString()"
              input-type="number" :min-value="5" :max-value="100" @on-input="(n) => gs.sensorWidthInMeters = n">
            </LabeledInput>

            <SeparationLine></SeparationLine>


            <BridgeList></BridgeList>
            <LabeledInput ref="forbiddenRectangles" label-text="Forbidden Spaces" :input-type="'text'"
              :default-value="gs.forbiddenSpaceIds.toString()" @onInput="(val) => gs.forbiddenSpaceIds = val"
              :tooltip="gs.tipEventSpaceIds">
            </LabeledInput>
            <div style="display: flex;flex-direction: row; padding: 3px 0 3px 0; border: 1px solid #00000033;">
              <label style="flex: 0 1 250px; padding: 0 0 0 5px;"> Display Forbidden Spaces</label>
              <input type="checkbox" style="flex: 0 1 70px; width: 70px;" checked value="drawids"
                @input="(ev) => gs.drawForbiddenSpaces = !gs.drawForbiddenSpaces" />
            </div>
            <SeparationLine></SeparationLine>
            <ScenarioGenerationConfig></ScenarioGenerationConfig>

            <SeparationLine></SeparationLine>

            <h2>Events Configuration</h2>
            <SmartEventList></SmartEventList>
          </div>
        </div>
      </div> -->
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <br>
        <RouterLink to="/details">Details</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView id="routerview"/>
</template>

<style scoped>
.colorpicker {
  width: 100px;
  height: 100px;
  border: 1px solid black;
}

/* .routerview{
  width: 200px;
  background-color: red;
} */
</style>
```