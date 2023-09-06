<script setup lang="ts">
import { drawRectangle, drawPath, origin, drawCoordinateSystem, drawPathToCanvasScaled as drawPolygonScaled, drawRectangleScaled, moveOrigin, addToScale, degreeLongitudeToMeters, degreeLatitideToMeters, setOrigin, drawLine, drawLineYInv, drawCoordinateSystemYInv, getPointYInv, getPointsYInv, setFillColor, getPointsScaled, getPointsScaledYInv } from '@/myfunctions/canvashelperfunctions';
import { useGlobalsStore } from '@/stores/globals';
import { onMounted, ref } from 'vue';

let canvas: HTMLCanvasElement | null;
let ctx: CanvasRenderingContext2D | null;
const gs = useGlobalsStore();
// testfunction();
// console.log(coordinateOrigin);

onMounted(() => {
    canvas = document.getElementById("mycanvas") as HTMLCanvasElement;
    ctx = canvas.getContext("2d");

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
    let coordShiftFromOrigin = {x:minX_m, y:minY_m};
    console.log("coordWidth_m: " + coordWidth_m);
    console.log("coordHeight_m: " + coordHeight_m);
    // setOrigin(minX_m, minY_m);

    let geoCoordsShiftedBack_m = geoCoords_m.map((coord) => {
        return { x: coord.x - coordShiftFromOrigin.x, y: coord.y - coordShiftFromOrigin.y };
    });



    console.log(geoCoords)
    console.log(geoCoords_m)
    console.log(geoCoordsShiftedBack_m)

    let interval = setInterval(() => {
        if (ctx == null || canvas == null) { return; }
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
        let testPoints = [{ x: 100, y: 0 }, { x: 200, y: 100 }, { x: 200, y: 200 }, { x: 100, y: 200 }];

        drawCoordinateSystemYInv(ctx);

      
        // setFillColor(ctx, "rgba(0,255,255,0.65)");
        // drawPath(ctx, getPointsScaledYInv(ctx, testPoints));
        setFillColor(ctx, "rgba(255,0,255,0.65)");
        drawPath(ctx, getPointsScaledYInv(ctx, geoCoordsShiftedBack_m));

        // drawRectangleScaled(ctx, 100, 100, 200, 200, "rgba(0,0,0,0.25)");
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
});



</script>

<template>
    <div>
        <canvas id="mycanvas" ref=canvas width="800" height="800" style="border:1px solid #000000;">
        </canvas>
    </div>
</template>