<script setup lang="ts">
import { drawRectangle,drawPolygonToCanvas, coordinateOrigin, drawCoordinateSystem, drawPolygonToCanvasScaled as drawPolygonScaled, drawRectangleScaled } from '@/myfunctions/canvashelperfunctions';
import { onMounted, ref } from 'vue';

let canvas: HTMLCanvasElement | null;
let ctx: CanvasRenderingContext2D | null;
// testfunction();
// console.log(coordinateOrigin);

onMounted(() => {
    canvas = document.getElementById("mycanvas") as HTMLCanvasElement;
    ctx = canvas.getContext("2d");
    let interval = setInterval(() => {
        if (ctx == null|| canvas == null) { return; }
        ctx?.clearRect(0, 0, canvas.width, canvas.height);

        drawCoordinateSystem(ctx, coordinateOrigin);
        // drawPolygonToCanvas(ctx, [{ x: 20, y: 0 }, { x: 100, y: 100 }, { x: 100, y: 200 }, { x: 20, y: 200 }], coordinateOrigin);
        drawPolygonScaled(ctx, [{ x: 100, y: 0 }, { x: 200, y: 100 }, { x: 200, y: 200 }, { x: 100, y: 200 }]);
        // drawRectangle(ctx, coordinateOrigin.x  +50,coordinateOrigin.y + 50, 200, 200,"rgba(0,0,0,0.25)" );
        drawRectangleScaled(ctx, 100, 100, 200, 200,"rgba(0,0,0,0.25)" );
    }, 50);
});



</script>

<template>
    <div>
        <canvas id="mycanvas" ref=canvas width="800" height="800" style="border:1px solid #000000;">
        </canvas>
    </div>
</template>