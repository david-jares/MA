<script setup lang="ts">
import { EventBus, OnCowIDChanged } from '@/main';
import { drawScene, toggleDrawing, updateDrawings } from '@/myfunctions/drawingfunctions';
import { ConvertCanvasXYToGeoCoords, ConvertGeoCoordsToCanvasXY, GetGeoocordinatesUnderMouse } from '@/myfunctions/interactionfunctions';
import { writeToConsoleOutput } from '@/myfunctions/utilityfunctions';
import { useGlobalsStore } from '@/stores/globals';
import { getCurrentInstance, onMounted, watch } from 'vue';
import { ref } from 'vue';

const globalsStore = useGlobalsStore();
const canvas = ref();
const coordinatesLabel = ref();
const gs = useGlobalsStore();
let isrecording = false;
const now = new Date('2021-01-01T01:00:00');
let recordingID: any;

onMounted(() => {
    globalsStore.canvasRef = canvas;
    globalsStore.ctx = canvas.value.getContext("2d");
    canvas.value.width = globalsStore.canvasWidth;
    canvas.value.height = globalsStore.canvasHeight;

canvas.value.addEventListener('mousedown', (e: MouseEvent) => {
        toggleDrawing(e);
        // console.log("mouse down");
    });

    canvas.value.addEventListener('mousemove', (e: MouseEvent) => {
        HandleMouseMove(e);
    });

    document.addEventListener('keydown', (event) => {
        if (event.code === 'KeyR') {
            toggleRecording();
        }
        if (event.code == 'KeyP') {
            printUserData();
        }
    });

    watch(
        () => [gs.cowId, gs.recordIntervalInSeconds, gs.recordDurationInDays, gs.timeSpeedMultiplier, gs.sensorWidthInMeters],
        (newValue, oldValue) => {
            console.log("gs value changed from " + oldValue + " to " + newValue);
            updateScene();
        });

    drawScene();

})


function HandleMouseMove(event: MouseEvent) {
    const geoCoords = GetGeoocordinatesUnderMouse(event);
    const mouseCoords = ConvertGeoCoordsToCanvasXY(geoCoords.latitude, geoCoords.longitude)
    coordinatesLabel.value.innerText = `MouseCoordinates: lat: ${geoCoords.latitude.toFixed(6)}, long: ${geoCoords.longitude.toFixed(6)} , ( x: ${mouseCoords.x} , y:  ${mouseCoords.y})`;
    updateDrawings(event);
}

function toggleRecording() {
    isrecording = !isrecording;
    console.log(isrecording ? 'Recording started!' : 'Recording stopped!');
}

function printUserData() {
    console.log(`cowId: ${gs.cowId} recordIntervalInSeconds: ${gs.recordIntervalInSeconds} recordDurationInDays: ${gs.recordDurationInDays} timeSpeedMultiplier: ${gs.timeSpeedMultiplier}`);
    console.log("SMARTEvents:");
    console.log(gs.smartEvents);
    console.log("sensors:")
    console.log(gs.sensors)
    console.log("spaces:")
    console.log(gs.spaces)
}

function updateScene() {
    console.log("updateScene");
    setUpRecording();
    drawScene();
}

function setUpRecording() {
    gs.loops = 0;
    let totalDurationInSeconds = 60 * 60 * 24 * gs.recordDurationInDays;
    let SecondsPerLoop = gs.recordIntervalInSeconds;
    let loopIntevalMilliSeconds = (1 / gs.timeSpeedMultiplier) * 1000;

    console.log(`Resetting Interval: ${loopIntevalMilliSeconds}`);

    clearInterval(recordingID);

    recordingID = setInterval(() => {

        if (isrecording) {
            let offsetSeconds = SecondsPerLoop * gs.loops++;
            let newDate = new Date(now.getTime() + offsetSeconds * 1000);
            let lastDate = new Date(now.getTime() + totalDurationInSeconds * 1000);
            if (newDate.getTime() <= lastDate.getTime()) {

                const formattedTime = newDate.toISOString().replace('T', ' ').replace(/\.\d+Z$/, '');
                const latitude = ConvertCanvasXYToGeoCoords(gs.mousePosition.x, gs.mousePosition.y).latitude;
                const longitude = ConvertCanvasXYToGeoCoords(gs.mousePosition.x, gs.mousePosition.y).longitude;
                // console.log(`${cowId}  ${formattedTime} - mouseposition: ${mousePosition.x}, ${mousePosition.y} lon: ${MouseXYToGeoCoords(mousePosition.x, mousePosition.y).longitude} lat: ${MouseXYToGeoCoords(mousePosition.x, mousePosition.y).latitude} `);
                gs.recordedData.push({ cowid: gs.cowId, time: formattedTime, longitude: longitude, latitude: latitude });
                writeToConsoleOutput(`${gs.cowId}, ${formattedTime}, ${longitude},${latitude}\n`)

            } else {
                toggleRecording();
            }
        }
    }, loopIntevalMilliSeconds);
}
setUpRecording();

</script>


<template>
    <div class="important" style="margin: 0px 5px 5px 5px;">
        <!-- <h2>Hi Dave ;)</h2> -->
        <canvas ref="canvas" id="myCanvas" style="border:1px solid;"></canvas>
        <div ref="coordinatesLabel" style="font-family: monospace;">Mouse Coordinates: </div>
    </div>
</template>