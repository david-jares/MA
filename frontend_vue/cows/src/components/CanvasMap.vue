<script setup lang="ts">
import { ConvertGeoCoordsToCanvasXY, GetGeoocordinatesUnderMouse } from '@/myfunctions/interactionfunctions';
import { useGlobalsStore } from '@/stores/globals';
import { getCurrentInstance, onMounted } from 'vue';
import { ref } from 'vue';

const globalsStore = useGlobalsStore();
const canvas = ref();
const coordinatesLabel = ref();

onMounted(() => {
    globalsStore.canvasRef = canvas;
    canvas.value.width = globalsStore.canvasWidth;
    canvas.value.height = globalsStore.canvasHeight;
})

function log(): void {
    console.log("log");
}

function HandleMouseMove(event: MouseEvent) {
    const geoCoords = GetGeoocordinatesUnderMouse(event);
    const mouseCoords = ConvertGeoCoordsToCanvasXY(geoCoords.latitude, geoCoords.longitude)
    coordinatesLabel.value.innerText = `MouseCoordinates: lat: ${geoCoords.latitude.toFixed(6)}, long: ${geoCoords.longitude.toFixed(6)} , ( x: ${mouseCoords.x} , y:  ${mouseCoords.y})`;
}

</script>


<template>
    <div class="important">
        <h2>Hi Dave ;)</h2>
        <canvas ref="canvas" id="myCanvas" style="border:1px solid;" @mousemove="HandleMouseMove($event)"></canvas>
        <div ref="coordinatesLabel" style="font-family: monospace;">Mouse Coordinates: </div>
    </div>
</template>