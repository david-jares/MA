<script setup lang="ts">
import { degreeLongitudeToMeters, degreeLatitideToMeters, drawCoordinateSystemYInv, setFillColor, drawPath, getPointsScaledYInv, addToScale, moveOrigin, getYInv, origin, scale, canvasPointToGeoCoordinate, drawRectangleDefault, getPointYInv, subtractOrigin, addOrigin, scalePointMultiply, setStrokeProperties, drawPoint, drawText, setFontProperties, drawRectangleYInv, drawRectangle, getRectYInv, getTriangleYInv, getPointScaledAndOrigin, getTriangleScaledAndOrigin, drawSpaceRectangle, drawRotatedImage, setScale, setOrigin, drawRectangleOnCanvas, barnRasterRectangle, getSubdividedRectangles, drawRotatedRectangle, getRasterPoints, generatePoints } from '@/myfunctions/canvashelperfunctions';
import { drawTriangle, isInsidePolygon, isPointInTriangle, triangulatePolygon } from '@/myfunctions/drawingfunctions';
import type { GeoCoordinate } from '@/myfunctions/model';
import { isPointInOrOnTriangle, isPointInsideRectangle as isPointInsideOrOnRectangle, isPointInsideTriangle, Triangle, type Point, isRectOverlappingTriangle } from '@/myfunctions/tempfunctions';
import { subdivideCanvas, Rectangle } from '@/myfunctions/utilityfunctions';
import { useGlobalsStore } from '@/stores/globals';
import { useDebugsStore } from '@/stores/debugs';
import { onMounted, ref } from 'vue';
import almersbachBarn from '@/assets/Almersbach_Barn_01.png';
import almersbachBarn2 from '@/assets/Almesbach_Stallplan_1_rotated-01.png';

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

let latestMousePosYInv = ref({ x: 0, y: 0 });

let geoCoordsAllShiftedBack_m = shiftBackGeoCoords_to_m(geoCoords, coordShiftFromOrigin.value);

let geoCoordsBarn = gs.coordinatesBarn;
let geoCoordsBarn_shifteback_m = shiftBackGeoCoords_to_m(geoCoordsBarn, coordShiftFromOrigin.value);
console.log("geoCoordsBarn_shifteback_m: ");
console.log(geoCoordsBarn_shifteback_m);

const img = new Image();
const img2 = new Image();

img.src = almersbachBarn;
img2.src = almersbachBarn2;


function increaseZoom() {
    // if (zoomelevel == 1) {
    let zoomSpeed = 1;
    let deltOriginToScreenCenter = { x: origin.value.x - canvas!.width! / 2, y: origin.value.y - canvas!.height! / 2 };
    console.log("deltOriginToScreenCenter: ");
    console.log(deltOriginToScreenCenter);
    addToScale(zoomSpeed);
    setOrigin(origin.value.x + (deltOriginToScreenCenter.x) * zoomSpeed, origin.value.y + (deltOriginToScreenCenter.y) * zoomSpeed);


}

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

    // drawRectangleOnCanvas(canvas);

    let interval = setInterval(() => {
        if (ctx == null || canvas == null) { return; }
        ctx?.clearRect(0, 0, canvas.width, canvas.height);

        drawCoordinateSystemYInv(ctx);
        setFillColor(ctx, "rgba(255,0,255,0.65)");
        drawPath(ctx, getPointsScaledYInv(ctx, geoCoordsAllShiftedBack_m));
        UpdateDrawings();
    }, 50);


    document.addEventListener("keydown", (e) => {
        if (e.key == "ArrowUp" && e.shiftKey) {
            increaseZoom();
        }
        else if (e.key == "ArrowDown" && e.shiftKey) {
            // setOrigin(origin.value.x + 200, origin.value.y + 200);
            // setScale(scale.value / 2);
        }
        else if (e.key == "ArrowUp") {
            moveOrigin(0, -50);
        }
        else if (e.key == "ArrowDown") {
            moveOrigin(0, 50);
        }
        else if (e.key == "ArrowLeft") {
            moveOrigin(50, 0);
        }
        else if (e.key == "ArrowRight") {
            moveOrigin(-50, 0);
        }
        else if (e.key == "p") {
            console.log(getMouseGeoCoords());
            console.log(latestMousePosYInv.value);
        }


    });
    canvas.addEventListener("mousemove", (e) => {
        if (ctx == null || canvas == null) { return; }
        let mousePosYInv = { x: e.offsetX, y: getYInv(ctx, e.offsetY) };
        let mousePosGeoCoordsYInv = canvasPointToGeoCoord({ x: mousePosYInv.x, y: mousePosYInv.y });
        labelText.value = "mousecoordinates: " + mousePosYInv.x + ", " + mousePosYInv.y + " | lon:" + mousePosGeoCoordsYInv.lon + ", lat:" + mousePosGeoCoordsYInv.lat;

        latestMousePosYInv.value = mousePosYInv;

    });

    img.onload = function () {
        // ctx!.drawImage(img, 0, 0);
    };
});




// function getMouseGeoCoords(ctx: CanvasRenderingContext2D, mouseX: number, mouseY: number) {
function getMouseGeoCoords() {
    return canvasPointToGeoCoord(latestMousePosYInv.value);
}






function GeoCoordToMeters(coord: GeoCoordinate) {
    return { x: coord.lon * degreeLongitudeToMeters, y: coord.lat * degreeLatitideToMeters };
}

function ShiftGeoCoordPointInMetersBackToCanvasSpace(coordinate: Point) {
    return { x: coordinate.x - coordShiftFromOrigin.value.x, y: coordinate.y - coordShiftFromOrigin.value.y };
}

function GeoCoordToCanvasPoint(geoCoord: GeoCoordinate) {
    let canvasPointX = (((degreeLongitudeToMeters * geoCoord.lon) - coordShiftFromOrigin.value.x) * scale.value) + origin.value.x;
    let canvasPointY = (((degreeLatitideToMeters * geoCoord.lat) - coordShiftFromOrigin.value.y) * scale.value) + origin.value.y;
    return { x: canvasPointX, y: canvasPointY };
}

function canvasPointToGeoCoord(canvasPoint: Point) {
    let lon = (((canvasPoint.x - origin.value.x) / scale.value) + coordShiftFromOrigin.value.x) / degreeLongitudeToMeters;
    let lat = (((canvasPoint.y - origin.value.y) / scale.value) + coordShiftFromOrigin.value.y) / degreeLatitideToMeters;
    return { lon: lon, lat: lat };
}



function UpdateDrawings() {

    let imageCorner = GeoCoordToCanvasPoint({ lon: 12.198746, lat: 49.681592 });
    // drawRotatedImage(ctx!, img, (imageCorner.x +25*scale.value ) , getYInv(ctx!, imageCorner.y - 22*scale.value), -29, 40 * scale.value, 80 * scale.value,0.75);
    drawRotatedImage(ctx!, img2, (imageCorner.x + 20 * scale.value), getYInv(ctx!, imageCorner.y - 25 * scale.value), 0, 80 * scale.value, 80 * scale.value, 1);



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
    // you mentioned that you do some meditation technique to redirect or transform your sexual energy into something. Is this something complicated or how does that work?
    let trianglesAll = triangulatePolygon(geoCoordsAllShiftedBack_m)

    let trianglesAllTransformed = trianglesAll.map((triangle) => {
        return getTriangleScaledAndOrigin(ctx!, triangle);
    });


    let trianglesBarn = triangulatePolygon(geoCoordsBarn_shifteback_m)
    let trianglesBarnTransformed = trianglesBarn.map((triangle) => {
        return getTriangleScaledAndOrigin(ctx!, triangle);
    });



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
            if (isRectOverlappingTriangle(rectangle, triangle)) {
                drawRectIndicesToSkip.push(i);
                break;
            }
        }
    }
    for (let i = 0; i < ds.drawnRects.length; i++) {
        const rectangle = ds.drawnRects[i];
        if (!drawRectIndicesToSkip.includes(i)) {
            drawSpaceRectangle(ctx!, rectangle);
        }
    }
    trianglesAllTransformed.forEach((triangle) => {
        // drawTriangle(ctx!, getTriangleYInv(ctx!, triangle));
    });

    setStrokeProperties(ctx!, "red", 0.75);
    setFillColor(ctx!, "rgba(255,0,0,0.2)");

    // make Barn rectangles


    let p1 = GeoCoordToCanvasPoint(barnRasterRectangle.topLeftCornerGeoCoord);
    let p2 = GeoCoordToCanvasPoint({ lon: 12.199247765864712, lat: 49.68108400333333 });
    setStrokeProperties(ctx!, "blue", 0.75);
    setFillColor(ctx!, "rgba(0,255,0,0.82)");
    let points = generatePoints(p1, p2, 10, 4, 50);

    // drawPoint(ctx!, getPointYInv(ctx!, p1), 15,true);
    // drawPoint(ctx!, getPointYInv(ctx!, p2), 15,true);
    points.forEach((point) => {
        drawPoint(ctx!, getPointYInv(ctx!, point), 7, true);
        let rect = new Rectangle(0, point.x, point.y, 50, 50);
        // drawRectangleDefault(ctx!, getRectYInv(ctx!, rect),true);
        drawRotatedRectangle(ctx!, getRectYInv(ctx!, rect), true, 0);
        // drawRectangleDefault(ctx!, rect, true);
    });


    // let angle = 0;
    // // let barnRectangles = getSubdividedRectangles(new Rectangle(10000, barnTopLeftCanvasPoint.x, barnTopLeftCanvasPoint.y, barnRasterRectangle.width, barnRasterRectangle.height), barnRasterRectangle.columns, barnRasterRectangle.rows, angle);
    // let barnRectangles = getSubdividedRectangles(getRectYInv(ctx!, new Rectangle(10000, barnTopLeftCanvasPoint.x, barnTopLeftCanvasPoint.y, barnRasterRectangle.width, barnRasterRectangle.height)), barnRasterRectangle.columns, barnRasterRectangle.rows, angle);
    // barnRectangles.forEach((rectangle) => {
    //     // drawSpaceRectangle(ctx!, getRectYInv(ctx!,rectangle));
    //     // drawSpaceRectangle(ctx!, rectangle);
    //     drawRotatedRectangle(ctx!, rectangle, true, -angle);
    //     // drawRotatedRectangle(ctx!, getRectYInv(ctx!,rectangle), true, -angle);
    //     // drawRectangleDefault(ctx!, rectangle, true);
    //     // drawRectangleDefault(ctx!, getRectYInv(ctx!,rectangle), true);
    // });


}





</script>

<template>
    <div>
        <canvas id="mycanvas" ref=canvas width="800" height="800" style="border:1px solid #000000;">
        </canvas>
        <label style="display: block; font-family: monospace;">{{ labelText }}</label>
        <label style="display: block; font-family: monospace;">origin: {{ origin }} | scale: {{ scale.toFixed(3) }} (1 pixel
            = {{ (1 / scale).toFixed(2) }} Meter )</label>
    </div>
</template>