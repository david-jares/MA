<script setup lang="ts">
import { drawRectangle, drawPolygonToCanvas, origin, drawCoordinateSystem, drawPolygonToCanvasScaled as drawPolygonScaled, drawRectangleScaled, moveOrigin, addToScale } from '@/myfunctions/canvashelperfunctions';
import { onMounted, ref } from 'vue';

let canvas: HTMLCanvasElement | null;
let ctx: CanvasRenderingContext2D | null;
// testfunction();
// console.log(coordinateOrigin);

onMounted(() => {
    canvas = document.getElementById("mycanvas") as HTMLCanvasElement;
    ctx = canvas.getContext("2d");
    let interval = setInterval(() => {
        if (ctx == null || canvas == null) { return; }
        ctx?.clearRect(0, 0, canvas.width, canvas.height);

        drawCoordinateSystem(ctx);
        // drawPolygonToCanvas(ctx, [{ x: 20, y: 0 }, { x: 100, y: 100 }, { x: 100, y: 200 }, { x: 20, y: 200 }], coordinateOrigin);
        // drawRectangle(ctx, coordinateOrigin.x  +50,coordinateOrigin.y + 50, 200, 200,"rgba(0,0,0,0.25)" );
        
        drawPolygonScaled(ctx, [{ x: 100, y: 0 }, { x: 200, y: 100 }, { x: 200, y: 200 }, { x: 100, y: 200 }]);
        drawRectangleScaled(ctx, 100, 100, 200, 200, "rgba(0,0,0,0.25)");
    }, 50);


    document.addEventListener("keydown", (e) => {
        if (e.key == "ArrowUp" && e.shiftKey) {
            addToScale(0.25);
        }
        else if (e.key == "ArrowDown" && e.shiftKey) {
            addToScale(-0.25);
        }
        else if (e.key == "ArrowUp") {
            moveOrigin(0, -50);
        }
        else if (e.key == "ArrowDown") {
            moveOrigin(0, 50);
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