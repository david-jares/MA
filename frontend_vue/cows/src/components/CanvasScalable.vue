<script setup lang="ts">
import { degreeLongitudeToMeters, degreeLatitideToMeters, drawCoordinateSystemYInv, setFillColor, drawPath, getPointsScaledYInv, addToScale, moveOrigin, getYInv, origin, scale, canvasPointToGeoCoordinate } from '@/myfunctions/canvashelperfunctions';
import type { Point } from '@/myfunctions/tempfunctions';
import { useGlobalsStore } from '@/stores/globals';
import { onMounted, ref } from 'vue';

let canvas: HTMLCanvasElement | null;
let ctx: CanvasRenderingContext2D | null;
const gs = useGlobalsStore();
const labelText = ref("mousecoordinates");
// testfunction();
// console.log(coordinateOrigin);
let coordShiftFromOrigin = ref({ x: 0, y: 0 });
onMounted(() => {
    canvas = document.getElementById("mycanvas") as HTMLCanvasElement;
    ctx = canvas.getContext("2d");



    // console.log(geoCoords)
    // console.log(geoCoords_m)
    // console.log(geoCoordsShiftedBack_m)

    let interval = setInterval(() => {
        if (ctx == null || canvas == null) { return; }
        ctx?.clearRect(0, 0, canvas.width, canvas.height);


        let geoCoords = gs.coordinatesCombined;
        let geoCoords_m = geoCoords.map((coord) => {
            return { x: coord.lon * degreeLongitudeToMeters, y: coord.lat * degreeLatitideToMeters };
        });
        const minX_m = Math.min(...geoCoords_m.map(coord => coord.x));
        const maxX_m = Math.max(...geoCoords_m.map(coord => coord.x));
        const minY_m = Math.min(...geoCoords_m.map(coord => coord.y));
        const maxY_m = Math.max(...geoCoords_m.map(coord => coord.y));
        let coordHeight_m = maxY_m - minY_m;
        let coordWidth_m = maxX_m - minX_m;
        coordShiftFromOrigin.value = { x: minX_m, y: minY_m };
        // console.log("coordWidth_m: " + coordWidth_m);
        // console.log("coordHeight_m: " + coordHeight_m);

        let geoCoordsShiftedBack_m = geoCoords_m.map((coord) => {
            return { x: coord.x - coordShiftFromOrigin.value.x, y: coord.y - coordShiftFromOrigin.value.y };
        });



        drawCoordinateSystemYInv(ctx);
        setFillColor(ctx, "rgba(255,0,255,0.65)");
        drawPath(ctx, getPointsScaledYInv(ctx, geoCoordsShiftedBack_m));
    }, 50);


    document.addEventListener("keydown", (e) => {
        if (e.key == "ArrowUp" && e.shiftKey) {
            addToScale(0.1);
        }
        else if (e.key == "ArrowDown" && e.shiftKey) {
            addToScale(-0.1);
        }
        else if (e.key == "ArrowUp") {
            moveOrigin(0, 50);
        }
        else if (e.key == "ArrowDown") {
            moveOrigin(0, -50);
        }
        else if (e.key == "ArrowLeft") {
            moveOrigin(-50, 0);
        }
        else if (e.key == "ArrowRight") {
            moveOrigin(50, 0);
        }
    });
    canvas.addEventListener("mousemove", (e) => {
        if (ctx == null || canvas == null) { return; }
        let mousePosYInv = { x: e.offsetX, y: getYInv(ctx, e.offsetY) };
        let mousePosGeoCoordsYInv = canvasPointToGeoCoord( { x: mousePosYInv.x, y: mousePosYInv.y });
        // let mousePos_m = { x: mousePos.x / gs.scale, y: mousePos.y / gs.scale };
        labelText.value = "mousecoordinates: " + mousePosYInv.x + ", " + mousePosYInv.y + " | lon:" + mousePosGeoCoordsYInv.lon + ", lat:" + mousePosGeoCoordsYInv.lat;
    });
});

function canvasPointToGeoCoord(p: Point){
    let lon = (((p.x - origin.value.x) / scale.value) + coordShiftFromOrigin.value.x) / degreeLongitudeToMeters;
    let lat = (((p.y - origin.value.y) / scale.value) + coordShiftFromOrigin.value.y) / degreeLatitideToMeters;
    return {lon: lon, lat: lat};
}

</script>

<template>
    <div>
        <canvas id="mycanvas" ref=canvas width="800" height="800" style="border:1px solid #000000;">
        </canvas>
        <label style="display: block; font-family: monospace;">{{ labelText }}</label>
        <label style="display: block; font-family: monospace;">origin: {{ origin }} | scale: {{ scale.toFixed(1) }} (1 pixel
            = 1 Meter / scale)</label>
        <label style="display: block; font-family: monospace;">coordShiftFromOrigin: {{ coordShiftFromOrigin }}</label>
    </div>
</template>