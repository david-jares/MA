<script setup lang="ts">
import { degreeLongitudeToMeters, degreeLatitideToMeters, drawCoordinateSystemYInv, setFillColor, drawPath, getPointsScaledYInv, addToScale, moveOrigin, getYInv, origin, scale, canvasPointToGeoCoordinate, drawRectangleDefault, getPointYInv, subtractOrigin, addOrigin, scalePointMultiply, setStrokeProperties, drawPoint, drawText, setFontProperties, drawRectangleYInv, drawRectangle, getRectYInv } from '@/myfunctions/canvashelperfunctions';
import { drawTriangle, isInsidePolygon, isPointInTriangle, triangulatePolygon } from '@/myfunctions/drawingfunctions';
import type { GeoCoordinate } from '@/myfunctions/model';
import { isPointInOrOnTriangle, isPointInsideRectangle as isPointInsideOrOnRectangle, isPointInsideTriangle, Triangle, type Point } from '@/myfunctions/tempfunctions';
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

let geoCoordsBarn = gs.coordinatesBarn;
let geoCoordsBarn_shifteback_m = shiftBackGeoCoords_to_m(geoCoordsBarn);

const minX_m = Math.min(...geoCoords_m.map(coord => coord.x));
const maxX_m = Math.max(...geoCoords_m.map(coord => coord.x));
const minY_m = Math.min(...geoCoords_m.map(coord => coord.y));
const maxY_m = Math.max(...geoCoords_m.map(coord => coord.y));
console.log("minX_m: " + minX_m);
console.log("maxX_m: " + maxX_m);
console.log("minY_m: " + minY_m);
console.log("maxY_m: " + maxY_m);






let coordHeight_m = maxY_m - minY_m;
let coordWidth_m = maxX_m - minX_m;
coordShiftFromOrigin.value = { x: minX_m, y: minY_m };

function shiftBackGeoCoords_to_m(geoCoords: GeoCoordinate[]) {
    let geoCoords_m = geoCoords.map((coord) => {
        return GeoCoordToMeters(coord);
    });

    const minX_m = Math.min(...geoCoords_m.map(coord => coord.x));
    const maxX_m = Math.max(...geoCoords_m.map(coord => coord.x));
    const minY_m = Math.min(...geoCoords_m.map(coord => coord.y));
    const maxY_m = Math.max(...geoCoords_m.map(coord => coord.y));
    let coordOffsetFromOriginMin = { x: minX_m, y: minY_m };

    let geoCoordsShiftedBackToCanvasSpace_m = geoCoords_m.map((coord) => {
        return { x: coord.x - coordOffsetFromOriginMin.x, y: coord.y - coordOffsetFromOriginMin.y };
    });
    return geoCoordsShiftedBackToCanvasSpace_m;
}

// let geoCoordsShiftedBack_m = geoCoords_m.map((coord) => {
//     return { x: coord.x - coordShiftFromOrigin.value.x, y: coord.y - coordShiftFromOrigin.value.y };
// });
let geoCoordsShiftedBack_m = shiftBackGeoCoords_to_m(geoCoords);
console.log("geoCoordsShiftedBack_m: ");
console.log(geoCoordsShiftedBack_m)
onMounted(() => {
    canvas = document.getElementById("mycanvas") as HTMLCanvasElement;
    ctx = canvas.getContext("2d");

    let interval = setInterval(() => {
        if (ctx == null || canvas == null) { return; }
        ctx?.clearRect(0, 0, canvas.width, canvas.height);

        drawCoordinateSystemYInv(ctx);
        setFillColor(ctx, "rgba(255,0,255,0.65)");
        drawPath(ctx, getPointsScaledYInv(ctx, geoCoordsShiftedBack_m));
        testRaster();
    }, 50);
    // testRaster();


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
    let padding = 20;
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
    let triangles = triangulatePolygon(geoCoordsShiftedBack_m)

    setStrokeProperties(ctx!, "black", 1);
    let trianglesTransformed = triangles.map((triangle) => {
        let p1 = getPointYInv(ctx!, addOrigin(scalePointMultiply(triangle.p1)));
        let p2 = getPointYInv(ctx!, addOrigin(scalePointMultiply(triangle.p2)));
        let p3 = getPointYInv(ctx!, addOrigin(scalePointMultiply(triangle.p3)));
        return new Triangle(p1, p2, p3);
    });

    // let trianglesTransformedYInv = trianglesTransformed.map((triangle) => {
    //     return new Triangle(getPointYInv(ctx!, triangle.p1), getPointYInv(ctx!, triangle.p2), getPointYInv(ctx!, triangle.p3));
    // });



    setStrokeProperties(ctx!, "black", 0.75);
    setFillColor(ctx!, "black");

    ds.drawnPoints.length = 0;
    geoCoordsBarn_shifteback_m.forEach((coord) => {
        drawPoint(ctx!, getPointYInv(ctx!, coord), 3);
        ds.drawnPoints.push(coord);
    });

    setStrokeProperties(ctx!, "red", 0.75);
    ds.drawnRects.length = 0;
    for (let i = 0; i < rectangles.length; i++) {
        const rectangle = rectangles[i];

        let doDraw = false;
        for (let i = 0; i < geoCoordsBarn_shifteback_m.length; i++) {
            const coord = geoCoordsBarn_shifteback_m[i];
            if (isPointInsideOrOnRectangle(coord, rectangle)) {
                doDraw = true;
                break;
            }
        }

        setFillColor(ctx!, "rgba(255,0,0,0.2)");
        if (doDraw) {
            ds.drawnRects.push(rectangle);
            setFillColor(ctx!, "rgba(0,0,255,0.2)");
        }
        drawRectangle(ctx!, getRectYInv(ctx!, rectangle), true);
        // drawRectangleYInv(ctx!, rectangle.x, rectangle.y, rectangle.width, rectangle.height, true);
        setFontProperties(ctx!, "green", 12, "Arial");
        drawText(ctx!, rectangle.id.toString(), rectangle.x + 3, getYInv(ctx!, rectangle.y - 12));
        // drawRectangle(ctx!, rectangle.x, getYInv(ctx!, rectangle.y), rectangle.width, rectangle.height, true);
    };

    trianglesTransformed.forEach((triangle) => {
        drawTriangle(ctx!, triangle);
    });




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