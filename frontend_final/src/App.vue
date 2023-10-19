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
    drawScene();
  });

});

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeyDown);
});

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'o') {
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
  let data = gs.recordings.map(x => { return { timeStamp: x.timeStamp, cattleId: x.cattleId, space: x.space.id } });
  saveAsCsv(data);
}

const handleCowIDChanged = (cowId: string) => {
  console.log("handleCowIDChanged");
  gs.cowId = cowId;
}


</script>

<template>
  <div class="app">
    <header style="background-color: white; padding: 20px;">
      <div class="wrapper">
        <h1>Weideinsight</h1>
        
        <nav>
          <RouterLink to="/">Home</RouterLink>
        
          <RouterLink to="/details">Details</RouterLink>
        </nav>
      </div>
    </header>

    <main class="main">
      <RouterView id="routerview"/>
    </main>

    <footer>Footer</footer>
  </div>
</template>

<style scoped>
.app {
  display: grid;
  grid-template-rows: auto 1fr auto;
  height: 100vh;
}

.main {
  display: grid;
  padding: 20px;
  /* place-items: center; */
}

.colorpicker {
  width: 100px;
  height: 100px;
  border: 1px solid black;
}
nav {
  display: flex;
  gap: 10px;
}
nav RouterLink {
  margin-right: 10px;
}
</style>
```