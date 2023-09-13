<script setup lang="ts">
import { degreeLongitudeToMeters, degreeLatitideToMeters, drawCoordinateSystemYInv, setFillColor, drawPath, getPointsScaledYInv, addToScale, moveOrigin, getYInv, origin, scale, canvasPointToGeoCoordinate, drawRectangleDefault, getPointYInv, subtractOrigin, addOrigin, scalePointMultiply, setStrokeProperties, drawPoint, drawText, setFontProperties, drawRectangleYInv, getRectYInv, getTriangleYInv, getPointScaledAndOrigin, getTriangleScaledAndOrigin, drawSpaceRectangle, drawRotatedImage, setScale, setOrigin, barnRasterRectangle, getSubdividedRectangles, drawRotatedRectangle, generatePoints, generatePointsAndRectangles, storedCanvasProperties, saveCanvasProperties as storeCanvasProperties, restoreCanvasProperties, getPolygonCenterPoint, coordShiftFromOrigin, canvasPointToGeoCoord, GeoCoordToCanvasPoint, barnSensorRows, barnSensorColumnWidth, barnSensorColumns, barnTopLeftGeoCoord, barnBottomLeftGeoCoord, drawLine, barnUnitDirectionX, barnUnitDirectionY, barnUnitNormalX, barnUnitNormalY, barnSensorColumnHeight, setCanvasProperties, drawRotatedText } from '@/myfunctions/canvashelperfunctions';
import { drawPolygon, drawRectangle, drawTriangle, isInsidePolygon, isPointInTriangle, triangulatePolygon } from '@/myfunctions/drawingfunctions';
import { Space, type GeoCoordinate, Sensor, RecordEntry } from '@/myfunctions/model';
import { isPointInOrOnTriangle, isPointInsideRectangle as isPointInsideOrOnRectangle, isPointInsideTriangle, Triangle, type Point, isRectOverlappingTriangle, isRectOverlappingPolygon, isPointInsidePolygon } from '@/myfunctions/tempfunctions';
import { subdivideCanvas, Rectangle, colorToRgba, writeToConsoleOutput, clearConsoleOutput, getTimeInSeconds, getDateTimeString } from '@/myfunctions/utilityfunctions';
import { useGlobalsStore } from '@/stores/globals';
import { useDebugsStore } from '@/stores/debugs';
import { computed, onMounted, ref, toValue, watch } from 'vue';
import almersbachBarn from '@/assets/Almersbach_Barn_01.png';
import almersbachBarn2 from '@/assets/Almesbach_Stallplan_1_rotated-01.png';
import cowImage from '@/assets/CowAlpha.png';

let canvas: HTMLCanvasElement | null;
let ctx: CanvasRenderingContext2D | null;
const gs = useGlobalsStore();
const ds = useDebugsStore();
const labelText = ref("mousecoordinates");

// inital computation of shift from the coordinates to the canvas such that our barn and pasture coordinates can start close to 0,0 on the canavs
let geoCoords = gs.coordinatesCombined;
let geoCoords_m = geoCoords.map((coord) => { return GeoCoordToMeters(coord); });
const minX_m = Math.min(...geoCoords_m.map(coord => coord.x));
const maxX_m = Math.max(...geoCoords_m.map(coord => coord.x));
const minY_m = Math.min(...geoCoords_m.map(coord => coord.y));
const maxY_m = Math.max(...geoCoords_m.map(coord => coord.y));
// coordShiftFromOrigin.value = { x: minX_m , y: minY_m};
coordShiftFromOrigin.value = { x: minX_m, y: minY_m };
// coordShiftFromOrigin.value = { x: minX_m -10, y: minY_m -10};

let latestMousePosYInv = ref({ x: 0, y: 0 });
let geoCoordsAllShiftedBack_m = shiftBackGeoCoords_to_m(geoCoords, coordShiftFromOrigin.value);



let highlightedSpace = ref();
let lastRecordSpace = ref();
let distanceTravelled = ref(0);

let isDisplayingHotkeys = true;
let isRecording = false;
let isRecordingManually = true;
let previousScale = 1;
let previousOrigin = { x: 0, y: 0 };
let needToUpdateComputations = true;
let simulationTimeRunId = -1;
let simulationSpeed = 1;
const offsetRectTextX = 190;


gs.ResetTimePassed();

const stepId = ref(0);
let _stepTimerId = -1;


function setUpStepTimer() {
    if (_stepTimerId != -1) clearInterval(_stepTimerId);
    _stepTimerId = setInterval(() => {
        stepId.value++;
        // console.log("stepId: " + stepId.value);
    }, 1000 / gs.stepsPerSecond);
}
function stopStepTimer() {
    if (_stepTimerId != -1) clearInterval(_stepTimerId);
    _stepTimerId = -1;
}

onMounted(() => {
    console.log("seconds " + getTimeInSeconds(gs.now.toDateString()));
    canvas = document.getElementById("mycanvas") as HTMLCanvasElement;
    ctx = canvas.getContext("2d");
    clearConsoleOutput();

    let interval = setInterval(() => {
        if (ctx == null || canvas == null) { return; }
        ctx?.clearRect(0, 0, canvas.width, canvas.height);

        UpdateDrawings();
    }, 50);


    document.addEventListener("keydown", (e) => {
        if (e.key == "+" && e.shiftKey) {
            increaseZoom();
        }
        else if (e.key == "-" && e.shiftKey) {
            decreaseZoom();
        }
        else if (e.key == "ArrowUp" && e.shiftKey) {
            moveCanvasUp()
        }
        else if (e.key == "ArrowDown" && e.shiftKey) {
            moveCanvasDown();
        }
        else if (e.key == "ArrowLeft" && e.shiftKey) {
            moveCanvasLeft();
        }
        else if (e.key == "ArrowRight" && e.shiftKey) {
            moveCanvasRight();
        }
        else if (e.key == "p") {
            console.log(getMouseGeoCoords());
            console.log("MousePos " + latestMousePosYInv.value.x + ", " + latestMousePosYInv.value.y);
            console.log(highlightedSpace.value);
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
            gs.drawBarnRects = !gs.drawBarnRects;
        } else if (e.key == "e") {
            gs.drawPastureRects = !gs.drawPastureRects;
        } else if (e.key == "n") {
            gs.drawNeighbourSpaces = !gs.drawNeighbourSpaces;
        } else if (e.key == "r") {
            toggleRecording();
        } else if (e.key == "t") {
            setIsRecordingManually(!isRecordingManually);
        } else if (e.key == "1") {
            if (isRecording && isRecordingManually) RecordStepBackward();
        } else if (e.key == "2" && isRecordingManually) {
            if (isRecording) RecordStepForward();
        } else if (e.key == "3") {
            gs.ResetTimePassed();
        } else if (e.key == "s") {
            toggleSimulation();
        }
        else if (e.key == "i") {
            toggleDisplayHotkeys();
        }

    });
    canvas.addEventListener("mousemove", (e) => {
        if (ctx == null || canvas == null) { return; }
        let mousePosYInv = { x: e.offsetX, y: getYInv(ctx, e.offsetY) };
        let mousePosGeoCoordsYInv = canvasPointToGeoCoord({ x: mousePosYInv.x, y: mousePosYInv.y });
        labelText.value = "mousecoordinates: " + mousePosYInv.x + ", " + mousePosYInv.y + " | lon:" + mousePosGeoCoordsYInv.lon + ", lat:" + mousePosGeoCoordsYInv.lat;

        latestMousePosYInv.value = mousePosYInv;
    });

    watch([
        () => gs.sensorWidthInMeters,
        () => origin,
        () => origin.value,
        () => scale,
        () => scale.value,
        () => gs.forbiddenSpaceIds,
        () => gs.bridgeSpaceIdPairs,

    ], (newValue, oldValue) => {
        needToUpdateComputations = true;
    }, { deep: true });

    watch(() => [stepId.value, stepId], (newValue, oldValue) => {
        RecordStepForward();
    }, { deep: true });
});

function toggleDisplayHotkeys() {
    isDisplayingHotkeys = !isDisplayingHotkeys;
}


function UpdateDrawings() {
    if (_stepTimerId != -1) {
        drawDebugGreenRectangle();
    }
    setFontProperties(ctx!, "rgba(0,0,255,1)", 25);

    drawCoordinateSystemYInv(ctx!);

    drawBarnAndPasturePolygons();
    drawBarnImage();
    // drawTriangles(); 

    createSpacesAndSensors();
    drawAllSpaces();
    highlightHoveredSpace();
    drawNeighbours();

    // handleAutomaticRecording();
    drawRecordingInfoBox();
    drawSimulationTime();
    drawSimulationInfoText();

    if (isSimulationRunning()) {
        simulateCow();
    }

    drawSMARTEventsToCanvas();

    drawHotekeysInfo();
}

function drawHotekeysInfo() {
    if (isDisplayingHotkeys) {
        const startOffsetX = 100;
        const startOffsetY = 100;
        setFillColor(ctx!, "rgba(0,255,255,0.8)");
        drawRectangleDefault(ctx!, new Rectangle(-1, startOffsetX, startOffsetY, 600, 400), true);
        setFontProperties(ctx!, "rgba(0,0,0,1)", 25,"Monospace");
        drawText(ctx!, "I = Toggle Display Hotkeys", startOffsetX + 10, startOffsetY + 30);
        drawText(ctx!, "Shift + ArrowKeys = Panning", startOffsetX + 10, startOffsetY + 60);
        drawText(ctx!, "Q = Toggle Zoom To Barn", startOffsetX + 10, startOffsetY + 90);
        drawText(ctx!, "W = Toggle Display Barn Spaces", startOffsetX + 10, startOffsetY + 120);
        drawText(ctx!, "E = Toggle Display Pasture Spaces", startOffsetX + 10, startOffsetY + 150);
        drawText(ctx!, "N = Toggle Display Neighbors", startOffsetX + 10, startOffsetY + 180);
        drawText(ctx!, "R = Toggle Recording", startOffsetX + 10, startOffsetY + 210);
        drawText(ctx!, "T = Toggle Recording Manually / Auto", startOffsetX + 10, startOffsetY + 240);
        drawText(ctx!, "1 = Manually Recording - Step Backward ", startOffsetX + 10, startOffsetY + 270);
        drawText(ctx!, "2 = Manually Recording - Step Forward ", startOffsetX + 10, startOffsetY + 300);
        drawText(ctx!, "3 = Reset Simulation Timer ", startOffsetX + 10, startOffsetY + 330);
        drawText(ctx!, "S = Toggle Simulation ", startOffsetX + 10, startOffsetY + 360);

    }
}

function toggleRecording() {
    if (!isSimulationRunning()) {
        isRecording = !isRecording;
        if (isRecording && !isRecordingManually) {
            setUpStepTimer();
        } else {
            stopStepTimer();
        }
    }
}

function toggleSimulation() {
    if (!isSimulationRunning() && !isRecording) {
        console.log("interval set")
        simulationTimeRunId = setInterval(() => {
            gs.timePassed += gs.recordIntervalInSeconds;
        }, 1000 / simulationSpeed);
    } else {
        clearInterval(simulationTimeRunId);
        simulationTimeRunId = -1;
    }
}

function setIsRecordingManually(value: boolean) {
    isRecordingManually = value;
    if (isRecordingManually) {
        stopStepTimer();
    } else if (isRecording) {
        setUpStepTimer();
    }
}

function drawBarnAndPasturePolygons() {
    // setFillColor(ctx!, "rgba(255,0,255,0.45)");
    setFillColor(ctx!, colorToRgba(gs.colorPolygon, gs.colorAlphaPolygon));
    drawPath(ctx!, getPointsScaledYInv(ctx!, geoCoordsAllShiftedBack_m)); // Draw polygons

}

function drawNeighbours() {
    if (gs.drawNeighbourSpaces) {
        let spaceUnderMouse = getSpaceUnderMouse();
        if (spaceUnderMouse) {

            let neighbourIds = spaceUnderMouse.neighbors;
            let neighborSpaces = gs.spaces.filter(x => neighbourIds.includes(x.id));

            neighborSpaces.forEach((neighbor) => {
                if (neighbor.sensorType == "Mioty") drawPastureSpace(neighbor.id);
                if (neighbor.sensorType == "Mioty") drawPastureSpace(neighbor.id);
                if (neighbor.sensorType == "Mioty") drawPastureSpace(neighbor.id);
                if (neighbor.sensorType == "Beacon") drawBarnSpace(neighbor.id);
                if (neighbor.sensorType == "Beacon") drawBarnSpace(neighbor.id);
                if (neighbor.sensorType == "Beacon") drawBarnSpace(neighbor.id);
            });
        }
    }
}

function drawInfoBoxBackground() {
    setFillColor(ctx!, "rgba(0,0,255,0.5)");
    drawRectangleDefault(ctx!, new Rectangle(-100, canvas!.width - offsetRectTextX - 10, 0, offsetRectTextX + 10, 150), true);

}

// function handleAutomaticRecording() {
//     if (isRecording) {
//         if (!isRecordingManually) {
//             Record();
//         }
//     }
// }
function drawRecordingInfoBox() {
    if (isRecording) {
        drawInfoBoxBackground();
        storeCanvasProperties(ctx!);
        setFontProperties(ctx!, "rgba(255,0,0,1)", 50);
        drawText(ctx!, "REC", canvas?.width! - offsetRectTextX, 50);

        restoreCanvasProperties(ctx!);
        if (lastRecordSpace.value) {
            setFontProperties(ctx!, "rgba(0,0,255,1)", 15);

            drawText(ctx!, "LastRec Space: " + lastRecordSpace.value?.id, canvas?.width! - offsetRectTextX, 100);
            drawText(ctx!, "Distance Total: " + distanceTravelled.value.toFixed(0) + " m", canvas?.width! - offsetRectTextX, 120);
        }

        if (isRecordingManually) {
            setFontProperties(ctx!, "rgba(255,255,0,1)", 15);
            drawText(ctx!, "Manual Steps", canvas?.width! - offsetRectTextX, 80);

        }
        if (lastRecordSpace.value) {
            drawSpace(lastRecordSpace.value);
            drawSpace(lastRecordSpace.value);
            drawCowImage(lastRecordSpace.value.id);
        }
    }
}


function drawSimulationTime() {
    if (gs.isSimulationEndTimeReached) {
        setFontProperties(ctx!, "rgba(255,0,0,1)", 15);
        drawText(ctx!, "Time: " + getDateTimeString(gs.timePassed), canvas?.width! - offsetRectTextX, 140);
        setFontProperties(ctx!, "rgba(255,0,0,1)", 25);
        drawText(ctx!, "Simulation End Time Reached", canvas?.width! - offsetRectTextX - 150, 190);

    } else {
        setFontProperties(ctx!, "rgba(0,0,255,1)", 15);
        drawText(ctx!, "Time: " + getDateTimeString(gs.timePassed), canvas?.width! - offsetRectTextX, 140);
    }
    // drawText(ctx!, "Time: " + getDateTimeString(gs.timePassed == 0 ? 0 : gs.timePassed - gs.recordIntervalInSeconds), canvas?.width! - offsetRectTextX, 140);
}

function drawSimulationInfoText() {
    if (isSimulationRunning()) {
        drawInfoBoxBackground();
        setFontProperties(ctx!, "rgba(0,255,0,1)", 30);
        drawText(ctx!, "Simulation", canvas?.width! - offsetRectTextX, 50);
        drawText(ctx!, "Running", canvas?.width! - offsetRectTextX, 80);
    }
}

function getBridgePartners(spaceId: number) {
    let result: number[] = [];
    gs.bridgeSpaceIdPairs.forEach((pair) => {
        if (pair.space1Id == spaceId || pair.space2Id == spaceId) {
            if (spaceId == pair.space1Id) {
                result.push(pair.space2Id)
            }
            else {
                result.push(pair.space2Id);
            }
        }
    });
    return result;
}



function increaseZoom() {
    let currentOriginGeoCoord = canvasPointToGeoCoord({ x: origin.value.x, y: origin.value.y });
    let bottomLeftGeoCoord = canvasPointToGeoCoord({ x: 0, y: canvas!.height });

    let delta = { lon: currentOriginGeoCoord.lon - bottomLeftGeoCoord.lon, lat: currentOriginGeoCoord.lat - bottomLeftGeoCoord.lat };
    let newOrigin = GeoCoordToCanvasPoint({ lon: currentOriginGeoCoord.lon + delta.lon, lat: currentOriginGeoCoord.lat + delta.lat });
    setScale(scale.value * 2);
    setOrigin(newOrigin.x, newOrigin.y);
}
function decreaseZoom() {
    let currentOriginGeoCoord = canvasPointToGeoCoord({ x: origin.value.x, y: origin.value.y });
    let bottomLeftGeoCoord = canvasPointToGeoCoord({ x: 0, y: canvas!.height });

    let delta = { lon: currentOriginGeoCoord.lon - bottomLeftGeoCoord.lon, lat: currentOriginGeoCoord.lat - bottomLeftGeoCoord.lat };
    let newOrigin = GeoCoordToCanvasPoint({ lon: currentOriginGeoCoord.lon - delta.lon, lat: currentOriginGeoCoord.lat - delta.lat });
    setScale(scale.value / 2);
    setOrigin(newOrigin.x, newOrigin.y);
}
function moveCanvasRight() {
    moveOrigin(-50, 0);
}
function moveCanvasLeft() {
    moveOrigin(50, 0);
}
function moveCanvasUp() {
    moveOrigin(0, -50);
}
function moveCanvasDown() {
    moveOrigin(0, 50);
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



function isSimulationRunning(): boolean {
    return simulationTimeRunId != -1;
}
function highlightHoveredSpace() {
    if (isRecording) return;

    let closestSpaceToMousePosition: Space | null = null;
    let allowedSpaces = gs.spaces.filter(space => !gs.forbiddenSpaceIds.includes(space.id));
    let spaceUnderMouse = getSpaceUnderMouse();
    if (spaceUnderMouse && spaceUnderMouse.sensorType == "Beacon") {
        closestSpaceToMousePosition = spaceUnderMouse;

    } else if (spaceUnderMouse && spaceUnderMouse.sensorType == "Mioty" && !gs.forbiddenSpaceIds.includes(spaceUnderMouse.id)) {

        closestSpaceToMousePosition = spaceUnderMouse;
    }

    else {
        let spacesSortedByDistanceToMouse = allowedSpaces.map((space) => {
            return { space: space, distance: Math.sqrt(Math.pow(space.canvasCoordinates[0] - latestMousePosYInv.value.x, 2) + Math.pow(space.canvasCoordinates[1] - latestMousePosYInv.value.y, 2)) };
        }).sort((a, b) => a.distance - b.distance);
        closestSpaceToMousePosition = spacesSortedByDistanceToMouse[0].space;
    }
    if (closestSpaceToMousePosition == null) return;

    highlightedSpace.value = closestSpaceToMousePosition;

    if (closestSpaceToMousePosition.sensorType == "Mioty") {
        drawPastureSpace(closestSpaceToMousePosition.id);
        drawPastureSpace(closestSpaceToMousePosition.id);
    } else if (closestSpaceToMousePosition.sensorType == "Beacon") {
        drawBarnSpace(closestSpaceToMousePosition.id);
        drawBarnSpace(closestSpaceToMousePosition.id);
    }
    setFontProperties(ctx!, "rgba(0,255,0,1)", 20 * scale.value);
}


function isMouseInBarn(): boolean {
    let barnCorners = getBarnCorners(getBarnRectPaths())
    let isMouseInBarn = isPointInsidePolygon(latestMousePosYInv.value, barnCorners);
    console.log("isMouseInBarn: " + isMouseInBarn);
    return isMouseInBarn;
}

function assignAllNeighbors() {
    gs.spaces.forEach((space) => {
        // debugger;
        if (gs.spaceNeighborCache.has(space.id) && !needToUpdateComputations) {
            space.neighbors = gs.spaceNeighborCache.get(space.id)!;
        } else {
            space.neighbors = getCloseNeighbourSpacesOfCanvasPoint({ x: space.canvasCoordinates[0], y: space.canvasCoordinates[1] });
            gs.spaceNeighborCache.set(space.id, space.neighbors);
        }
        // space.neighbors = getCloseNeighbourSpacesOfCanvasPoint({ x: space.canvasCoordinates[0], y: space.canvasCoordinates[1] });
    });
    needToUpdateComputations = false;
}

function getCloseNeighbourSpacesOfCanvasPoint(point: Point): number[] {
    let result: number[] = [];
    let space = GetSpaceUnderCanvasPoint(point);
    // first lets add the bridgePairs
    if (space) {
        let bridgePartners = getBridgePartners(space.id);
        bridgePartners.forEach((bridgePartnerId) => {
            if (bridgePartnerId >= 0 && !result.includes(bridgePartnerId)) result.push(bridgePartnerId);
        });
    }


    if (space && space.sensorType == "Beacon") {
        let offsetRow = { x: (barnSensorColumnHeight()) * barnUnitDirectionX.value, y: (barnSensorColumnHeight()) * barnUnitDirectionY.value };
        let offsetCol = { x: (barnSensorColumnWidth * scale.value) * barnUnitNormalX.value, y: (barnSensorColumnWidth * scale.value) * barnUnitNormalY.value };
        let pR = { x: point.x + offsetCol.x, y: point.y + offsetCol.y };
        let pL = { x: point.x - offsetCol.x, y: point.y - offsetCol.y };
        let pT = { x: point.x - offsetRow.x, y: point.y - offsetRow.y };
        let pB = { x: point.x + offsetRow.x, y: point.y + offsetRow.y };
        let pTR = { x: point.x + offsetCol.x - offsetRow.x, y: point.y + offsetCol.y - offsetRow.y };
        let pTL = { x: point.x - offsetCol.x - offsetRow.x, y: point.y - offsetCol.y - offsetRow.y };
        let pBR = { x: point.x + offsetCol.x + offsetRow.x, y: point.y + offsetCol.y + offsetRow.y };
        let pBL = { x: point.x - offsetCol.x + offsetRow.x, y: point.y - offsetCol.y + offsetRow.y };
        let nR = GetSpaceUnderCanvasPoint(pR);
        let nL = GetSpaceUnderCanvasPoint(pL);
        let nT = GetSpaceUnderCanvasPoint(pT);
        let nB = GetSpaceUnderCanvasPoint(pB);
        let nTR = GetSpaceUnderCanvasPoint(pTR);
        let nTL = GetSpaceUnderCanvasPoint(pTL);
        let nBR = GetSpaceUnderCanvasPoint(pBR);
        let nBL = GetSpaceUnderCanvasPoint(pBL);
        let potentialNeighbours = [nR, nL, nT, nB, nTR, nTL, nBR, nBL];
        potentialNeighbours.forEach((neighbour) => {
            if (neighbour &&
                !gs.forbiddenSpaceIds.includes(neighbour.id) &&
                neighbour.sensorType == "Beacon") {
                // (neighbour.sensorType == "Mioty" && bridgeSpaceIds.includes(neighbour.id) && bridgeSpaceIds.includes(space!.id)))) {
                // (neighbour.sensorType == "Mioty" && bridgeSpaceIds.includes(neighbour.id) && bridgeSpaceIds.includes(space!.id)))) {

                if (!result.includes(neighbour.id)) result.push(neighbour.id);
            }
        });

    }
    //TODO - übergang nur in Neighbourspaces möglich

    // add Neighbours for BarnSpaces
    if (space && !gs.forbiddenSpaceIds.includes(space.id) && space.sensorType == "Mioty") {
        let offset = gs.sensorWidthInMeters * scale.value;
        let nL = GetSpaceUnderCanvasPoint({ x: point.x - offset, y: point.y });
        let nR = GetSpaceUnderCanvasPoint({ x: point.x + offset, y: point.y });
        let nT = GetSpaceUnderCanvasPoint({ x: point.x, y: point.y + offset });
        let nB = GetSpaceUnderCanvasPoint({ x: point.x, y: point.y - offset });
        let nTL = GetSpaceUnderCanvasPoint({ x: point.x - offset, y: point.y + offset });
        let nBL = GetSpaceUnderCanvasPoint({ x: point.x - offset, y: point.y - offset });
        let nTR = GetSpaceUnderCanvasPoint({ x: point.x + offset, y: point.y + offset });
        let nBR = GetSpaceUnderCanvasPoint({ x: point.x + offset, y: point.y - offset });
        let potentialNeighbours = [nL, nR, nT, nB, nTL, nBL, nTR, nBR];
        potentialNeighbours.forEach((neighbour) => {
            if (neighbour && !gs.forbiddenSpaceIds.includes(neighbour.id) && neighbour.sensorType == "Mioty") {
                // (neighbour.sensorType == "Beacon" && bridgeSpaceIds.includes(neighbour.id) && bridgeSpaceIds.includes(space!.id)))) {
                if (!result.includes(neighbour.id)) result.push(neighbour.id);
            }
        });
    }

    result.sort((a, b) => a - b);
    return result;
}

function GetSpaceUnderCanvasPoint(point: Point): Space | null {
    let resultSpace: Space | null = null;
    for (let i = 0; i < gs.spacesBarn.length; i++) {
        const space = gs.spacesBarn[i];
        if (space.sensorType == "Beacon") {
            let spacePath = space.pathGeoCoords.map(x => GeoCoordToCanvasPoint(x));
            spacePath = spacePath.map(x => getPointYInv(ctx!, x));
            if (isInsidePolygon(getPointYInv(ctx!, point), spacePath)) {
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
                if (isPointInsideOrOnRectangle(point, spaceRect)) {
                    resultSpace = space;
                    break;
                }
            }
        }
    }
    return resultSpace;
}

function getSpaceUnderMouse(): Space | null {
    let resultSpace: Space | null = null;
    for (let i = 0; i < gs.spacesBarn.length; i++) {
        const space = gs.spacesBarn[i];
        if (space.sensorType == "Beacon") {
            let spacePath = space.pathGeoCoords.map(x => GeoCoordToCanvasPoint(x));
            spacePath = spacePath.map(x => getPointYInv(ctx!, x));
            if (isInsidePolygon(getPointYInv(ctx!, latestMousePosYInv.value), spacePath)) {
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
    let geoCoords = canvasPointToGeoCoord(centerPointOnCanvas); // we use the center of the rectangle as the geooords for the space and for its sensor
    let space = new Space(spaceId, "myspace", sensorType, -1, geoCoords.lon, geoCoords.lat, [geoCoords.lat, geoCoords.lon, 1], [centerPointOnCanvas.x, centerPointOnCanvas.y, 1], [centerPointOnCanvas.x, centerPointOnCanvas.y], [], priority, pathGeoCoords, isRectOverlappinBarn)
    gs.spaces.push(space);
    return space;
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


function drawCowImage(spaceId: number, amount: number = 1) {
    let space = gs.spaces.find(x => x.id == spaceId);
    const img = new Image();
    img.src = cowImage;
    let imageCorner = { x: space!.canvasCoordinates[0], y: space!.canvasCoordinates[1] };
    let size = (space?.sensorType == "Mioty" ? 15 : 4) * scale.value;
    drawRotatedImage(ctx!, img, imageCorner.x, getYInv(ctx!, imageCorner.y), 0, size, size, 0.7);

}

function drawBarnImage() {
    const img = new Image();
    img.src = almersbachBarn2;
    let imageCorner = GeoCoordToCanvasPoint({ lon: 12.198746, lat: 49.681592 });
    let imageWidthHeightRatio = 2481 / 2298;
    let imageDrawWidth = 80 * scale.value;
    let imageDrawHeight = imageDrawWidth * imageWidthHeightRatio;
    drawRotatedImage(ctx!, img, (imageCorner.x + 20 * scale.value), getYInv(ctx!, imageCorner.y - 25 * scale.value), 0, imageDrawWidth, imageDrawHeight, 1);

}
function getMainRects() {
    let rectangles: Rectangle[] = [];
    let padding = 20 * scale.value;
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
    let p1 = GeoCoordToCanvasPoint(barnTopLeftGeoCoord);
    let p2 = GeoCoordToCanvasPoint(barnBottomLeftGeoCoord);

    let pointsAndBarnRects = generatePointsAndRectangles(p1, p2, barnSensorRows, barnSensorColumns, barnSensorColumnWidth);

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


function Record() {
    if (gs.isSimulationEndTimeReached) {
        setIsRecordingManually(true);
        console.log("recordTimeUpperBound reached");
        return;
    }

    let spaceUnderMouse = getSpaceUnderMouse();

    // initiate starting space
    if (lastRecordSpace.value == null) {
        if (spaceUnderMouse && !gs.forbiddenSpaceIds.includes(spaceUnderMouse.id)) {
            lastRecordSpace.value = spaceUnderMouse;
        } else {
            console.log("no space under mouse");
            return;
        }
    }
    if (spaceUnderMouse && !gs.forbiddenSpaceIds.includes(spaceUnderMouse.id)) {
        if (lastRecordSpace.value) {
            if (lastRecordSpace.value.neighbors.includes(spaceUnderMouse.id)) {
                distanceTravelled.value += Math.sqrt(Math.pow(spaceUnderMouse.canvasCoordinates[0] - lastRecordSpace.value.canvasCoordinates[0], 2) + Math.pow(spaceUnderMouse.canvasCoordinates[1] - lastRecordSpace.value.canvasCoordinates[1], 2)) / scale.value;
                lastRecordSpace.value = spaceUnderMouse;
            }
        }
    }

    if (lastRecordSpace.value) {

        let newDate = getDateTimeString(gs.timePassed);
        const latitude = lastRecordSpace.value.latitude;
        const longitude = lastRecordSpace.value.longitude;

        gs.recordings.push(new RecordEntry(newDate, gs.cowId, lastRecordSpace.value));
        // console.log(`${gs.cowId}, ${newDate}, ${longitude},${latitude}\n`);
        writeToConsoleOutput(`${gs.cowId}, ${newDate}, ${longitude},${latitude}\n`);
        gs.timePassed += gs.recordIntervalInSeconds;
    }
}

function RecordStepForward() {
    Record();
}
function RecordStepBackward() {
    if (gs.recordings.length > 0) gs.recordings.pop();
    if (gs.recordings.length > 0) lastRecordSpace.value = gs.recordings[gs.recordings.length - 1].space;
    gs.timePassed -= gs.recordIntervalInSeconds;
    clearConsoleOutput();
    gs.recordings.forEach((recording) => {
        const latitude = recording.space.latitude;
        const longitude = recording.space.longitude;
        writeToConsoleOutput(`${gs.cowId}, ${recording.timeStamp}, ${longitude},${latitude}\n`);
    });
}


function simulateCow() {
    // TODO this is only temporary for testing
    let index = gs.recordings.findIndex(x => getTimeInSeconds(x.timeStamp) >= gs.timePassed);
    if (index != -1) {
        let space = gs.recordings[index].space;
        drawCowImage(space.id);
    }
}





function drawTriangles() {
    let mainTriangles = getMainTriangles();

    mainTriangles.forEach((triangle) => {
        drawTriangle(ctx!, getTriangleYInv(ctx!, triangle));
    });
}

function createSpacesAndSensors() {
    if (!needToUpdateComputations) return;
    console.log("recomputing spaces and sensors")
    let mainRectsFiltered = getMainRectsFiltered();
    let barnRectPaths = getBarnRectPaths();
    let barnCorners = getBarnCorners(barnRectPaths);

    // barnCorners.forEach((corner) => {
    //     drawPoint(ctx!, getPointYInv(ctx!, { x: corner.x, y: corner.y }), 5, true);
    // });

    gs.spaces.length = 0;
    let spaceID = 1;
    mainRectsFiltered.forEach((rectangle) => {
        let isRectOverlappinBarn = isRectOverlappingPolygon(rectangle, barnCorners);
        rectangle.id = spaceID;

        let space = createSpace(spaceID++, "Mioty", rectangle.center, 1, [], isRectOverlappinBarn);
        createSensor(space);
    });

    barnRectPaths.forEach((path) => {
        let center = getPolygonCenterPoint(path);
        let space = createSpace(spaceID++, "Beacon", center, 2, path.map(x => canvasPointToGeoCoord(x)));
        createSensor(space);
    });
    assignAllNeighbors();
    createOutsideSpace();
}

function drawSpace(space: Space) {
    if (space.sensorType == "Mioty") {
        drawPastureSpace(space.id);
    } else if (space.sensorType == "Beacon") {
        drawBarnSpace(space.id);
    }
}

function drawAllSpaces() {
    gs.spaces.forEach((space) => {
        if (space.sensorType == "Mioty" && gs.drawPastureRects) {
            drawSpace(space)
        } else if (space.sensorType == "Beacon" && gs.drawBarnRects) {
            drawSpace(space)
        }
    });
}

function drawPastureSpace(id: number) {
    let space = gs.spaces.filter(x => x.id == id)[0];
    let center = GeoCoordToCanvasPoint({ lon: space.geoCoordinates[1], lat: space.geoCoordinates[0] });
    let rectangle = new Rectangle(id, center.x - (gs.sensorWidthInMeters * scale.value / 2), center.y - (gs.sensorWidthInMeters * scale.value / 2), gs.sensorWidthInMeters * scale.value, gs.sensorWidthInMeters * scale.value);


    if (space.isRectOverlappinBarn) {
        storeCanvasProperties(ctx!);
        setStrokeProperties(ctx!, colorToRgba("ff00000", gs.colorAlphaSpacesPasture - 0.1), 1);

        setFillColor(ctx!, colorToRgba(gs.colorSpacesPasture, gs.colorAlphaSpacesPasture - 0.2));

        drawSpaceRectangle(ctx!, rectangle, gs.drawSpaceIds);
        restoreCanvasProperties(ctx!);
    } else {

        setStrokeProperties(ctx!, colorToRgba("#000000", gs.colorAlphaSpacesPasture), 1);
        setFillColor(ctx!, colorToRgba(gs.colorSpacesPasture, gs.colorAlphaSpacesPasture));
        drawSpaceRectangle(ctx!, rectangle, gs.drawSpaceIds);
    }
    drawPoint(ctx!, getPointYInv(ctx!, center), 0.3 * scale.value, true);

}

function drawBarnSpace(id: number) {
    storeCanvasProperties(ctx!);
    let space = gs.spaces.filter(x => x.id == id)[0];
    let path = space.pathGeoCoords.map(x => GeoCoordToCanvasPoint(x));
    let center = { x: space.coordinates[0], y: space.coordinates[1] };

    // setFillColor(ctx!, "rgba(0,255,0,0.55)");
    setFillColor(ctx!, colorToRgba(gs.colorSpacesBarn, gs.colorAlphaSpacesBarn));
    let pathYInv = path.map(x => getPointYInv(ctx!, x));
    drawPath(ctx!, pathYInv, true, true);

    drawPoint(ctx!, getPointYInv(ctx!, center), 0.3 * scale.value, true);

    if (gs.drawSpaceIds) {
        let leftPoint = path.filter(x => x.x == Math.min(...path.map(p => p.x)))[0];
        setFontProperties(ctx!, "rgba(255,0,0,0.5)", 2 * scale.value);
        drawText(ctx!, id.toString(), leftPoint.x + 1.5 * scale.value, getYInv(ctx!, leftPoint.y - 1.5 * scale.value));
    }
    restoreCanvasProperties(ctx!);
}

function drawSMARTEventsToCanvas() {
    const gs = useGlobalsStore();

    gs.smartEvents.forEach(smartEvent => {
        let spaceIds = smartEvent.spaceIds.split(',').map(Number);
        spaceIds.reverse(); //reversed, so that when we draw the text it will be on top of the other spaces
        for (let i = 0; i < spaceIds.length; i++) {
            const spaceId = spaceIds[i];

            let space = gs.spaces.find(s => s.id === spaceId);
            if (space === undefined) continue;
            let x = space.canvasCoordinates[0];
            let y = space.canvasCoordinates[1];

            let eventColor = colorToRgba(smartEvent.colorRGB, smartEvent.colorAlpha);
            if (space.sensorType == "Mioty") {
                setCanvasProperties(ctx!, {
                    borderColor: "black",
                    borderThickness: 1,
                    fillColor: eventColor,
                });
                drawRectangleDefault(ctx!, getRectYInv(ctx!, new Rectangle(-1, x - 0.5 * gs.sensorWidthInMeters * scale.value, y - 0.5 * gs.sensorWidthInMeters * scale.value, gs.sensorWidthInMeters * scale.value, gs.sensorWidthInMeters * scale.value)), true);
                setFontProperties(ctx!, "white", 10 * scale.value)
                if (i == spaceIds.length - 1) drawText(ctx!, smartEvent.screenDescription, x - 8 * scale.value, getYInv(ctx!, y - 3 * scale.value));
            } else if (space.sensorType == "Beacon") {
                setCanvasProperties(ctx!, {
                    borderColor: "black",
                    borderThickness: 1,
                    fillColor: eventColor,
                });
                setStrokeProperties(ctx!, eventColor, 1);
                setFillColor(ctx!, eventColor);
                drawPath(ctx!, space.pathGeoCoords.map(x => GeoCoordToCanvasPoint(x)).map(x => getPointYInv(ctx!, x)), true, true);
                setFontProperties(ctx!, "white", 4 * scale.value)
                if (i == spaceIds.length - 1) drawRotatedText(ctx!, smartEvent.screenDescription, x, getYInv(ctx!, y), -28);
            }
        }
    });
}


</script>

<template>
    <div>
        <canvas id="mycanvas" ref=canvas width="800" height="800" style="border:4px solid #000000;">
        </canvas>
        <label style="display: block; font-family: monospace;">{{ labelText }}</label>
        <label style="display: block; font-family: monospace;">origin: {{ origin }} | scale: {{ scale.toFixed(3) }} (1 pixel
            = {{ (1 / scale).toFixed(2) }} Meter )</label>
    </div>
</template>