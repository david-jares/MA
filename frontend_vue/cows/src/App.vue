<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import CanvasMap from './components/CanvasMap.vue';
import LabeledInput from './components/LabeledInput.vue';
import LabeledInputWithSlider from './components/LabeledInputWithSlider.vue';
import SeparationLine from './components/SeparationLine.vue';
import Test from './components/Test.vue'
import './style.css'
import { useGlobalsStore } from './stores/globals';

const gs = useGlobalsStore();

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
            <LabeledInput :label-text='"cowId : "' :default-value="1" input-type="number" :min-value="1" @on-input="(n)=>gs.cowId = n"></LabeledInput>
            <LabeledInput :label-text='"recordIntervalInSeconds : "' :default-value="60" input-type="number" :min-value="1" @on-input="(n)=>gs.recordIntervalInSeconds = n"></LabeledInput>
            <LabeledInput :label-text='"recordDurationInDays : "' :default-value="2" input-type="number" :min-value="1" @on-input="(n)=>gs.recordDurationInDays = n"></LabeledInput>
            <LabeledInput :label-text='"timeSpeedMultiplier : "' :default-value="600" input-type="number" :min-value="1" @on-input="(n)=>gs.timeSpeedMultiplier = n"></LabeledInput>
            <SeparationLine></SeparationLine>
            <LabeledInputWithSlider :label-text="'Sensor Width in Meters'" :default-value="40" :min-value="30" :max-value="100"></LabeledInputWithSlider>
          </div>
        </div>
      </div>
      <!-- <Test></Test> -->

      <!-- <nav>
        <RouterLink to="/">Home</RouterLink>
      </nav> -->
    </div>
  </header>

  <!-- <RouterView /> -->
</template>
