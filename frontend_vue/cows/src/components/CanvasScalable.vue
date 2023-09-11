<script setup lang="ts">
import { degreeLongitudeToMeters, degreeLatitideToMeters, drawCoordinateSystemYInv, setFillColor, drawPath, getPointsScaledYInv, addToScale, moveOrigin, getYInv, origin, scale, canvasPointToGeoCoordinate, drawRectangleDefault, getPointYInv, subtractOrigin, addOrigin, scalePointMultiply, setStrokeProperties, drawPoint, drawText, setFontProperties, drawRectangleYInv, drawRectangle, getRectYInv, getTriangleYInv, getPointScaledAndOrigin, getTriangleScaledAndOrigin, drawSpaceRectangle, drawRotatedImage, setScale, setOrigin, drawRectangleOnCanvas, barnRasterRectangle, getSubdividedRectangles, drawRotatedRectangle, getRasterPoints, generatePoints, generatePointsAndRectangles, storedCanvasProperties, saveCanvasProperties as storeCanvasProperties, restoreCanvasProperties, getPolygonCenterPoint, coordShiftFromOrigin, canvasPointToGeoCoord, GeoCoordToCanvasPoint } from '@/myfunctions/canvashelperfunctions';
import { drawPolygon, drawTriangle, isInsidePolygon, isPointInTriangle, triangulatePolygon } from '@/myfunctions/drawingfunctions';
import { Space, type GeoCoordinate, Sensor } from '@/myfunctions/model';
import { isPointInOrOnTriangle, isPointInsideRectangle as isPointInsideOrOnRectangle, isPointInsideTriangle, Triangle, type Point, isRectOverlappingTriangle, isRectOverlappingPolygon, isPointInsidePolygon } from '@/myfunctions/tempfunctions';
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
// let coordShiftFromOrigin = ref({ x: 0, y: 0 });

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


let debugDrawBarnRects = true;

let previousScale = 1;
let previousOrigin = { x: 0, y: 0 };

let hoverablePastureRects: Rectangle[] = [];
let isRecording = false;
let hoveredPastureRectId = -1;
let hoveredBarnPathId = -1;
let forbiddenRectIds = [2, 3, 8, 9, 16, 17, 23, 24, 25];
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
                previousScale = scale.value;
                previousOrigin = origin.value;
                scale.value = 10;
                origin.value = { x: -990, y: 0 };
            } else {
                scale.value = previousScale;
                origin.value = previousOrigin;
            }
        }
        else if (e.key == "w") {
            debugDrawBarnRects = !debugDrawBarnRects;
        } else if (e.key == "r") {
            isRecording = !isRecording;
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

function highlightHoveredSpace() {
    let space = getSpaceUnderMouse();

    setFontProperties(ctx!, "rgba(255,0,0,1)", 20 * scale.value);
    if (space) drawText(ctx!, space.id.toString(), 100, 100);
    

    let closestSpaceToMousePosition: Space | null = null;
    let allowedSpaces = gs.spaces.filter(space => !forbiddenRectIds.includes(space.id));
    let spaceUnderMouse = getSpaceUnderMouse();
    if (spaceUnderMouse && spaceUnderMouse.sensorType == "Beacon") {
        closestSpaceToMousePosition = spaceUnderMouse;

    } else if (spaceUnderMouse && spaceUnderMouse.sensorType == "Mioty" && !forbiddenRectIds.includes(spaceUnderMouse.id)) {

        closestSpaceToMousePosition = spaceUnderMouse;
    }

    else {
        let spacesSortedByDistanceToMouse = allowedSpaces.map((space) => {
            return { space: space, distance: Math.sqrt(Math.pow(space.canvasCoordinates[0] - latestMousePosYInv.value.x, 2) + Math.pow(space.canvasCoordinates[1] - latestMousePosYInv.value.y, 2)) };
        }).sort((a, b) => a.distance - b.distance);
        closestSpaceToMousePosition = spacesSortedByDistanceToMouse[0].space;
    }
    if (closestSpaceToMousePosition == null) return;



    if (closestSpaceToMousePosition.sensorType == "Mioty") {
        drawPastureSpace(closestSpaceToMousePosition.id);
        drawPastureSpace(closestSpaceToMousePosition.id);
    } else if (closestSpaceToMousePosition.sensorType == "Beacon") {
        drawBarnSpace(closestSpaceToMousePosition.id);
        drawBarnSpace(closestSpaceToMousePosition.id);
    }
    setFontProperties(ctx!, "rgba(0,255,0,1)", 20 * scale.value);
    drawText(ctx!, closestSpaceToMousePosition.id.toString(), 500, 100);
    // console.log("closestSpaceToMousePosition: " + closestSpaceToMousePosition.id);

}

function isMouseInBarn(): boolean {
    let barnCorners = getBarnCorners(getBarnRectPaths())
    let isMouseInBarn = isPointInsidePolygon(latestMousePosYInv.value, barnCorners);
    console.log("isMouseInBarn: " + isMouseInBarn);
    return isMouseInBarn;
}

function getSpaceUnderMouse(): Space | null {
    let resultSpace: Space | null = null;
    for (let i = 0; i < gs.spacesBarn.length; i++) {
        const space = gs.spacesBarn[i];
        if (space.sensorType == "Beacon") {
            let spacePath = space.pathGeoCoords.map(x => GeoCoordToCanvasPoint(x));
            spacePath = spacePath.map(x => getPointYInv(ctx!, x));
            if (isInsidePolygon(getPointYInv(ctx!, latestMousePosYInv.value), spacePath)) {
                drawDebugGreenRectangle();
                resultSpace = space;
                break;
            }
        }
    }
    if (!resultSpace) {
        for (let i = 0; i < gs.spacesPasture.length; i++) {
            const space = gs.spacesPasture[i];
            if (space.sensorType == "Mioty") {
                let spaceRect = space.getCanvasRectangle();
                if (isPointInsideOrOnRectangle(latestMousePosYInv.value, spaceRect)) {
                    drawDebugGreenRectangle();
                    resultSpace = space;
                    break;
                }
            }
        }
    }

    return resultSpace;
}
function drawDebugGreenRectangle() {
    storeCanvasProperties(ctx!);
    setFillColor(ctx!, "rgba(0,255,0,0.75)");
    drawRectangleDefault(ctx!, new Rectangle(-100, 0, 0, 100, 100), true);
    restoreCanvasProperties(ctx!);
}

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



function createSpace(spaceId: number, sensorType: string, centerPointOnCanvas: Point, priority: number, pathGeoCoords: GeoCoordinate[] = [], isRectOverlappinBarn: boolean = false): Space {
    // let centerX = rectangle.x + (rectangle.width / 2);
    // let centerY = rectangle.y + (rectangle.height / 2);
    let geoCoords = canvasPointToGeoCoord(centerPointOnCanvas); // we use the center of the rectangle as the geooords for the space and for its sensor
    let space = new Space(spaceId, "myspace", sensorType, -1, geoCoords.lon, geoCoords.lat, [geoCoords.lat, geoCoords.lon, 1], [centerPointOnCanvas.x, centerPointOnCanvas.y, 1], [centerPointOnCanvas.x, centerPointOnCanvas.y], [], priority, pathGeoCoords, isRectOverlappinBarn)
    gs.spaces.push(space);
    if (sensorType == "Beacon") {
        gs.spacesBarn.push(space);
    } else if (sensorType == "Mioty") {
        gs.spacesPasture.push(space);
    }
    return space;
    // spaceId++;
}
function createOutsideSpace() {
    let outsideSpace = new Space(0, "outside", "Mioty", -1, gs.spaces[0].longitude, gs.spaces[0].latitude, gs.spaces[0].geoCoordinates, [-1, -1, 1], [-1, -1], [1], 0);
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
function getMainRects() {
    let rectangles: Rectangle[] = [];
    let padding = 20 * scale.value;
    // let rasterSize = 20 * scale.value;
    let rasterSize = gs.sensorWidthInMeters * scale.value;
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
    return rectangles;
}
function getMainRectsFiltered(): Rectangle[] {
    let results: Rectangle[] = [];
    let mainRects = getMainRects();
    let mainTriangles = getMainTriangles();

    // mainTriangles.forEach((triangle) => {
    //     drawTriangle(ctx!, getTriangleYInv(ctx!, triangle));
    // });

    for (let i = 0; i < mainRects.length; i++) {
        const rect = mainRects[i];
        for (let j = 0; j < mainTriangles.length; j++) {
            const triangle = mainTriangles[j];
            if (isRectOverlappingTriangle(rect, triangle)) {
                results.push(rect);
                break;
            }
        }
    }
    return results;
}

function getBarnRectPaths(): Point[][] {
    let result = [];
    let p1 = GeoCoordToCanvasPoint({ lon: 12.198725503930264, lat: 49.6816003669697 });
    let p2 = GeoCoordToCanvasPoint({ lon: 12.199207591869754, lat: 49.68104582151515 });

    let pointsAndBarnRects = generatePointsAndRectangles(p1, p2, 10, 4, 7);

    for (let i = 0; i < pointsAndBarnRects.rectangles.length; i++) {
        const rectangle = pointsAndBarnRects.rectangles[i];
        let p1 = pointsAndBarnRects.points[rectangle.topLeft];
        let p2 = pointsAndBarnRects.points[rectangle.topRight];
        let p3 = pointsAndBarnRects.points[rectangle.bottomRight];
        let p4 = pointsAndBarnRects.points[rectangle.bottomLeft];
        let path = [p1, p2, p3, p4];
        result.push(path);
    }
    return result;
}

function getMainTriangles() {
    let trianglesAll = triangulatePolygon(geoCoordsAllShiftedBack_m)
    let trianglesAllTransformed = trianglesAll.map((triangle) => {
        return getTriangleScaledAndOrigin(ctx!, triangle);
    });
    return trianglesAllTransformed;
}
function getBarnCorners(barnRectPaths: Point[][]) {
    let barnCorners: Point[] = [];

    let AllPoints: Point[] = [];
    barnRectPaths.forEach((path) => {
        AllPoints.push(...path);
    });
    let xMin = Math.min(...AllPoints.map(p => p.x));
    let xMax = Math.max(...AllPoints.map(p => p.x));
    let yMin = Math.min(...AllPoints.map(p => p.y));
    let yMax = Math.max(...AllPoints.map(p => p.y));
    let xMinPoints = AllPoints.filter(p => p.x == xMin);
    let xMaxPoints = AllPoints.filter(p => p.x == xMax);
    let yMinPoints = AllPoints.filter(p => p.y == yMin);
    let yMaxPoints = AllPoints.filter(p => p.y == yMax);
    if (xMinPoints.length > 1 || xMaxPoints.length > 1 || yMinPoints.length > 1 || yMaxPoints.length > 1) {
        // the barn is exactly perpendicular
        barnCorners.push({ x: xMin, y: yMax });
        barnCorners.push({ x: xMax, y: yMax });
        barnCorners.push({ x: xMax, y: yMin });
        barnCorners.push({ x: xMin, y: yMin });
    } else {
        // the barn is rotated
        barnCorners.push(...xMinPoints);
        barnCorners.push(...yMaxPoints);
        barnCorners.push(...xMaxPoints);
        barnCorners.push(...yMinPoints);
    }

    return barnCorners;
}

function UpdateDrawings() {


    drawBarnImage();

    let mainRectsFiltered = getMainRectsFiltered();
    let mainTriangles = getMainTriangles();
    let barnRectPaths = getBarnRectPaths();
    let barnCorners = getBarnCorners(barnRectPaths);

    barnCorners.forEach((corner) => {
        drawPoint(ctx!, getPointYInv(ctx!, { x: corner.x, y: corner.y }), 5, true);
    });

    mainTriangles.forEach((triangle) => {
        // drawTriangle(ctx!, getTriangleYInv(ctx!, triangle));
    });

    gs.spaces.length = 0;
    gs.spacesBarn.length = 0;
    gs.spacesPasture.length = 0;
    let spaceID = 1;
    mainRectsFiltered.forEach((rectangle) => {
        let isRectOverlappinBarn = isRectOverlappingPolygon(rectangle, barnCorners);
        rectangle.id = spaceID;

        let space = createSpace(spaceID++, "Mioty", rectangle.center, 1, [], isRectOverlappinBarn);
        drawPastureSpace(space.id);
    });

    barnRectPaths.forEach((path) => {
        let center = getPolygonCenterPoint(path);
        let space = createSpace(spaceID++, "Beacon", center, 2, path.map(x => canvasPointToGeoCoord(x)));
        if (debugDrawBarnRects) drawBarnSpace(space.id);
    });


    hoverablePastureRects = mainRectsFiltered;
    highlightHoveredSpace();

}


function drawPastureSpace(id: number) {
    let space = gs.spaces.filter(x => x.id == id)[0];
    let center = GeoCoordToCanvasPoint({ lon: space.geoCoordinates[1], lat: space.geoCoordinates[0] });
    let rectangle = new Rectangle(id, center.x - (gs.sensorWidthInMeters * scale.value / 2), center.y - (gs.sensorWidthInMeters * scale.value / 2), gs.sensorWidthInMeters * scale.value, gs.sensorWidthInMeters * scale.value);

    // let transformedRect = getRectYInv(ctx!, rectangle);
    setFillColor(ctx!, "rgba(255,0,0,0.2)");

    if (space.isRectOverlappinBarn) {
        setFillColor(ctx!, "rgba(255,0,0,0.05)");
        drawSpaceRectangle(ctx!, rectangle);
    } else {

        setFillColor(ctx!, "rgba(255,0,0,0.25)");
        drawSpaceRectangle(ctx!, rectangle);
    }
    drawPoint(ctx!, getPointYInv(ctx!, center), 0.3 * scale.value, true);

}

function drawBarnSpace(id: number) {
    storeCanvasProperties(ctx!);
    let space = gs.spaces.filter(x => x.id == id)[0];
    let path = space.pathGeoCoords.map(x => GeoCoordToCanvasPoint(x));
    let center = { x: space.coordinates[0], y: space.coordinates[1] };

    setFillColor(ctx!, "rgba(0,255,0,0.55)");
    let pathYInv = path.map(x => getPointYInv(ctx!, x));
    drawPath(ctx!, pathYInv, true, true);

    drawPoint(ctx!, getPointYInv(ctx!, center), 0.3 * scale.value, true);


    let leftPoint = path.filter(x => x.x == Math.min(...path.map(p => p.x)))[0];
    setFontProperties(ctx!, "rgba(255,0,0,0.5)", 2 * scale.value);
    drawText(ctx!, id.toString(), leftPoint.x + 1.5 * scale.value, getYInv(ctx!, leftPoint.y - 1.5 * scale.value));
    restoreCanvasProperties(ctx!);
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