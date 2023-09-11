<script setup lang="ts">
import { degreeLongitudeToMeters, degreeLatitideToMeters, drawCoordinateSystemYInv, setFillColor, drawPath, getPointsScaledYInv, addToScale, moveOrigin, getYInv, origin, scale, canvasPointToGeoCoordinate, drawRectangleDefault, getPointYInv, subtractOrigin, addOrigin, scalePointMultiply, setStrokeProperties, drawPoint, drawText, setFontProperties, drawRectangleYInv, drawRectangle, getRectYInv, getTriangleYInv, getPointScaledAndOrigin, getTriangleScaledAndOrigin, drawSpaceRectangle, drawRotatedImage, setScale, setOrigin, drawRectangleOnCanvas, barnRasterRectangle, getSubdividedRectangles, drawRotatedRectangle, getRasterPoints, generatePoints, generatePointsAndRectangles } from '@/myfunctions/canvashelperfunctions';
import { drawTriangle, isInsidePolygon, isPointInTriangle, triangulatePolygon } from '@/myfunctions/drawingfunctions';
import { Space, type GeoCoordinate, Sensor } from '@/myfunctions/model';
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

// const img2 = new Image();
// img2.src = almersbachBarn2;

let debugDrawBarnRects = true;

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
        drawPath(ctx, getPointsScaledYInv(ctx, geoCoordsAllShiftedBack_m)); // Draw polygons
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
        } else if (e.key == "q") {
            if (scale.value != 10) {
                scale.value = 10;
                origin.value = { x: -1000, y: 0 };
            } else {
                scale.value = 3;
                origin.value = { x: 0, y: 0 };
            }
        }
        else if (e.key == "w") {
            debugDrawBarnRects = !debugDrawBarnRects;
        }


    });
    canvas.addEventListener("mousemove", (e) => {
        if (ctx == null || canvas == null) { return; }
        let mousePosYInv = { x: e.offsetX, y: getYInv(ctx, e.offsetY) };
        let mousePosGeoCoordsYInv = canvasPointToGeoCoord({ x: mousePosYInv.x, y: mousePosYInv.y });
        labelText.value = "mousecoordinates: " + mousePosYInv.x + ", " + mousePosYInv.y + " | lon:" + mousePosGeoCoordsYInv.lon + ", lat:" + mousePosGeoCoordsYInv.lat;

        latestMousePosYInv.value = mousePosYInv;

    });
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

function createSpace(spaceId: number, sensorType: string, rectangle: Rectangle) {
    let centerX = rectangle.x + (rectangle.width / 2);
    let centerY = rectangle.y + (rectangle.height / 2);
    let geoCoords = canvasPointToGeoCoord({ x: centerX, y: centerY }); // we use the center of the rectangle as the geooords for the space and for its sensor
    let space = new Space(spaceId + 1, "myspace", sensorType, -1, geoCoords.lon, geoCoords.lat, [geoCoords.lat, geoCoords.lon, 1], [rectangle.x, rectangle.y, 1], [rectangle.x, rectangle.y], [])
    gs.spaces.push(space);
    // spaceId++;
}
function createOutsideSpace() {
    let outsideSpace = new Space(0, "outside", "Mioty", -1, gs.spaces[0].longitude, gs.spaces[0].latitude, gs.spaces[0].geoCoordinates, [-1, -1, 1], [-1, -1], [1]);
    gs.spaces.push(outsideSpace);
}
function createSensor(space: Space) {
    let sensor = new Sensor(space.id, 1, space.sensorType, [space.id], [space.coordinates[0], space.coordinates[1], 1], space.geoCoordinates);
    gs.sensors.push(sensor);
}

function isPastureRectOverlappingBarnRect(pastureRect: Rectangle, barnRectPath: Point[]) {
    let barnRectTriangles = triangulatePolygon(barnRectPath);
    for (let i = 0; i < barnRectTriangles.length; i++) {
        const triangle = barnRectTriangles[i];
        if (isRectOverlappingTriangle(pastureRect, triangle)) {
            return true;
        }
    }
    return false;
}

function drawBarnImage() {
    const img2 = new Image();
    img2.src = almersbachBarn2;
    let imageCorner = GeoCoordToCanvasPoint({ lon: 12.198746, lat: 49.681592 });
    let imageWidthHeightRatio = 2481 / 2298;
    let imageDrawWidth = 80 * scale.value;
    let imageDrawHeight = imageDrawWidth * imageWidthHeightRatio;
    drawRotatedImage(ctx!, img2, (imageCorner.x + 20 * scale.value), getYInv(ctx!, imageCorner.y - 25 * scale.value), 0, imageDrawWidth, imageDrawHeight, 1);

}


function UpdateDrawings() {

  
    drawBarnImage();



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
        // if (!drawRectIndicesToSkip.includes(i)) {
        drawSpaceRectangle(ctx!, rectangle);
        // }
    }


    trianglesAllTransformed.forEach((triangle) => {
        // drawTriangle(ctx!, getTriangleYInv(ctx!, triangle));
    });

    setStrokeProperties(ctx!, "red", 0.75);
    setFillColor(ctx!, "rgba(255,0,0,0.2)");



    // make Barn rectangles
    let p1 = GeoCoordToCanvasPoint({ lon: 12.198725503930264, lat: 49.6816003669697 });
    let p2 = GeoCoordToCanvasPoint({ lon: 12.199207591869754, lat: 49.68104582151515 });
    setStrokeProperties(ctx!, "blue", 0.75);
    setFillColor(ctx!, "rgba(0,255,0,0.82)");

    let pointsAndBarnRects = generatePointsAndRectangles(p1, p2, 10, 4, 7);

    for (let i = 0; i < pointsAndBarnRects.rectangles.length; i++) {
        const rectangle = pointsAndBarnRects.rectangles[i];
        let p1 = pointsAndBarnRects.points[rectangle.topLeft];
        let p2 = pointsAndBarnRects.points[rectangle.topRight];
        let p3 = pointsAndBarnRects.points[rectangle.bottomRight];
        let p4 = pointsAndBarnRects.points[rectangle.bottomLeft];
        let path = [p1, p2, p3, p4];
        setStrokeProperties(ctx!, "rgba(0,0,0,1)", 1);
        if (debugDrawBarnRects) {

            setFillColor(ctx!, "rgba(0,255,0,0.5)");
            let pathYInv = path.map(x => getPointYInv(ctx!, x));
            drawPath(ctx!, pathYInv, true, true);

            setFontProperties(ctx!, "black", 20, "Arial");
            for (let i = 0; i < pathYInv.length; i++) {
                const point = pathYInv[i];
                // drawText(ctx!, i.toString(), point.x, point.y);
            }
        }
    };

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