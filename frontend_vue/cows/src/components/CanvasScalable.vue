<script setup lang="ts">
import { degreeLongitudeToMeters, degreeLatitideToMeters, drawCoordinateSystemYInv, setFillColor, drawPath, getPointsScaledYInv, addToScale, moveOrigin, getYInv, origin, scale, canvasPointToGeoCoordinate, drawRectangleDefault, getPointYInv, subtractOrigin, addOrigin, scalePointMultiply, setStrokeProperties, drawPoint, drawText, setFontProperties, drawRectangleYInv, drawRectangle, getRectYInv, getTriangleYInv, getPointScaledAndOrigin, getTriangleScaledAndOrigin } from '@/myfunctions/canvashelperfunctions';
import { drawTriangle, isInsidePolygon, isPointInTriangle, triangulatePolygon } from '@/myfunctions/drawingfunctions';
import type { GeoCoordinate } from '@/myfunctions/model';
import { isPointInOrOnTriangle, isPointInsideRectangle as isPointInsideOrOnRectangle, isPointInsideTriangle, Triangle, type Point, isRectOverlappingTriangle } from '@/myfunctions/tempfunctions';
import { subdivideCanvas, Rectangle } from '@/myfunctions/utilityfunctions';
import { useGlobalsStore } from '@/stores/globals';
import { useDebugsStore } from '@/stores/debugs';
import { onMounted, ref } from 'vue';

let canvas: HTMLCanvasElement | null;
let ctx: CanvasRenderingContext2D | null;
const gs = useGlobalsStore();
const ds = useDebugsStore();
const labelText = ref("mousecoordinates");
// testfunction();
// console.log(coordinateOrigin);
let coordShiftFromOrigin = ref({ x: 0, y: 0 });

let geoCoords = gs.coordinatesCombined;
let geoCoords_m = geoCoords.map((coord) => {
    return GeoCoordToMeters(coord);
});

const minX_m = Math.min(...geoCoords_m.map(coord => coord.x));
const maxX_m = Math.max(...geoCoords_m.map(coord => coord.x));
const minY_m = Math.min(...geoCoords_m.map(coord => coord.y));
const maxY_m = Math.max(...geoCoords_m.map(coord => coord.y));
let coordHeight_m = maxY_m - minY_m;
let coordWidth_m = maxX_m - minX_m;
coordShiftFromOrigin.value = { x: minX_m, y: minY_m };


let geoCoordsAllShiftedBack_m = shiftBackGeoCoords_to_m(geoCoords, coordShiftFromOrigin.value);

let geoCoordsBarn = gs.coordinatesBarn;
let geoCoordsBarn_shifteback_m = shiftBackGeoCoords_to_m(geoCoordsBarn, coordShiftFromOrigin.value);
console.log("geoCoordsBarn_shifteback_m: ");
console.log(geoCoordsBarn_shifteback_m);



function shiftBackGeoCoords_to_m(geoCoords: GeoCoordinate[], coordShiftFromOrigin: Point) {
    let geoCoords_m = geoCoords.map((coord) => {
        return GeoCoordToMeters(coord);
    });

    let geoCoordsShiftedBackToCanvasSpace_m = geoCoords_m.map((coord) => {
        return { x: coord.x - coordShiftFromOrigin.x, y: coord.y - coordShiftFromOrigin.y };
    });
    return geoCoordsShiftedBackToCanvasSpace_m;
}


onMounted(() => {
    canvas = document.getElementById("mycanvas") as HTMLCanvasElement;
    ctx = canvas.getContext("2d");

    let interval = setInterval(() => {
        if (ctx == null || canvas == null) { return; }
        ctx?.clearRect(0, 0, canvas.width, canvas.height);

        drawCoordinateSystemYInv(ctx);
        setFillColor(ctx, "rgba(255,0,255,0.65)");
        drawPath(ctx, getPointsScaledYInv(ctx, geoCoordsAllShiftedBack_m));
        testRaster();
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
        let mousePosGeoCoordsYInv = canvasPointToGeoCoord({ x: mousePosYInv.x, y: mousePosYInv.y });
        labelText.value = "mousecoordinates: " + mousePosYInv.x + ", " + mousePosYInv.y + " | lon:" + mousePosGeoCoordsYInv.lon + ", lat:" + mousePosGeoCoordsYInv.lat;



    });
});

function GeoCoordToMeters(coord: GeoCoordinate) {
    return { x: coord.lon * degreeLongitudeToMeters, y: coord.lat * degreeLatitideToMeters };
}

function ShiftGeoCoordPointInMetersBackToCanvasSpace(coordinate: Point) {
    return { x: coordinate.x - coordShiftFromOrigin.value.x, y: coordinate.y - coordShiftFromOrigin.value.y };
}

function canvasPointToGeoCoord(p: Point) {
    let lon = (((p.x - origin.value.x) / scale.value) + coordShiftFromOrigin.value.x) / degreeLongitudeToMeters;
    let lat = (((p.y - origin.value.y) / scale.value) + coordShiftFromOrigin.value.y) / degreeLatitideToMeters;
    return { lon: lon, lat: lat };
}

function testRaster() {

    let rectangles: Rectangle[] = [];
    let padding = 20 * scale.value;
    let rasterSize = 20 * scale.value;
    let topLeft = ShiftGeoCoordPointInMetersBackToCanvasSpace({ x: minX_m - padding, y: maxY_m + padding });
    let bottomRight = ShiftGeoCoordPointInMetersBackToCanvasSpace({ x: maxX_m + padding, y: minY_m - padding });
    let rasterWidth = (bottomRight.x - topLeft.x) * scale.value;
    let rasterHeight = (topLeft.y - bottomRight.y) * scale.value;
    const numCols: number = Math.ceil(rasterWidth / rasterSize);
    const numRows: number = Math.ceil(rasterHeight / rasterSize);

    let id: number = 1;
    for (let row = 0; row <= numRows; row++) {
        for (let col = -1; col < numCols; col++) {
            const x: number = col * rasterSize + origin.value.x - padding;
            const y: number = row * rasterSize + origin.value.y - padding;
            rectangles.push(new Rectangle(id, x, y, rasterSize, rasterSize));
            id++;
        }
    }

    let trianglesAll = triangulatePolygon(geoCoordsAllShiftedBack_m)

    let trianglesAllTransformed = trianglesAll.map((triangle) => {
        return getTriangleScaledAndOrigin(ctx!, triangle);
    });


    let trianglesBarn = triangulatePolygon(geoCoordsBarn_shifteback_m)
    let trianglesBarnTransformed = trianglesBarn.map((triangle) => {
        return getTriangleScaledAndOrigin(ctx!, triangle);
    });
    // let trianglesBarnTransformedYInv = trianglesBarnTransformed.map((triangle) => {
    //     return getTriangleYInv(ctx!, triangle);
    // });



    setStrokeProperties(ctx!, "black", 0.75);
    setFillColor(ctx!, "black");
    setStrokeProperties(ctx!, "red", 0.75);

    ds.drawnRects.length = 0;
    for (let i = 0; i < rectangles.length; i++) {
        const rectangle = rectangles[i];
        for (let j = 0; j < trianglesAllTransformed.length; j++) {
            const triangle = trianglesAllTransformed[j];
            if (isRectOverlappingTriangle(rectangle, triangle)) {
                ds.drawnRects.push(rectangle);
                // drawSpaceRectangle(rectangle);
                break;
            }
        }
    };

    let drawRectIndicesToSkip: number[] = [];
    ds.drawnTriangles = trianglesBarnTransformed;
    for (let i = 0; i < ds.drawnRects.length; i++) {
        const rectangle = ds.drawnRects[i];
        for (let j = 0; j < trianglesBarnTransformed.length; j++) {
            const triangle = trianglesBarnTransformed[j];
            setStrokeProperties(ctx!, "black", 0.75);
            // drawTriangle(ctx!, getTriangleYInv(ctx!, triangle));
            // drawTriangle(ctx!,  triangle);
            if (isRectOverlappingTriangle(rectangle, triangle)) {
                // drawSpaceRectangle(rectangle);
                drawRectIndicesToSkip.push(i);
                // ds.drawnRects.splice(i, 1);
                break;
            }
        }
    }
    for (let i = 0; i < ds.drawnRects.length; i++) {
        const rectangle = ds.drawnRects[i];
        if (!drawRectIndicesToSkip.includes(i)) {
            drawSpaceRectangle(rectangle);
        }
    }
    trianglesAllTransformed.forEach((triangle) => {
        drawTriangle(ctx!, getTriangleYInv(ctx!, triangle));
    });
    // ds.drawnRects.forEach((rectangle) => {
    //     drawSpaceRectangle(rectangle);
    // });

    setStrokeProperties(ctx!, "red", 0.75);
    setFillColor(ctx!, "rgba(255,0,0,0.2)");
    // trianglesAllTransformedYInv.forEach((triangle) => {
    //     drawTriangle(ctx!, triangle);
    // });




}
function drawSpaceRectangle(rectangle: Rectangle) {
    let transformedRect = getRectYInv(ctx!, rectangle);
    setFillColor(ctx!, "rgba(255,0,0,0.2)");
    drawRectangleDefault(ctx!, transformedRect, true);
    setFontProperties(ctx!, "rgba(0,0,255,0.4)", 5 * scale.value, "Arial");
    drawText(ctx!, rectangle.id.toString(), transformedRect.x + 2 * scale.value, transformedRect.y + 6 * scale.value);

}


</script>

<template>
    <div>
        <canvas id="mycanvas" ref=canvas width="800" height="800" style="border:1px solid #000000;">
        </canvas>
        <label style="display: block; font-family: monospace;">{{ labelText }}</label>
        <label style="display: block; font-family: monospace;">origin: {{ origin }} | scale: {{ scale.toFixed(1) }} (1 pixel
            = {{ (1 / scale).toFixed(2) }} Meter )</label>
    </div>
</template>