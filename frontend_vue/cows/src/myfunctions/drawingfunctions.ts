import { useGlobalsStore } from "@/stores/globals";
import { ConvertGeoCoordsToCanvasXY, ConvertCanvasXYToGeoCoords } from "./interactionfunctions";
import { colorToRgba, subdivideCanvas } from "./utilityfunctions";
import { isPointInsideTriangle, type Point, type Triangle } from "./tempfunctions";
import { Space, Sensor } from "./model";


const polygonOutside: { x: number; y: number }[] = [];
const polygonBarn: { x: number; y: number }[] = [];
let path: Point[] = [];
let isDrawing = false;


export function computePolygon(): void {
    const gs = useGlobalsStore();
    polygonOutside.length = 0;
    const minLat = Math.min(...gs.coordinatesPasture.map(p => p.lat));
    const maxLat = Math.max(...gs.coordinatesPasture.map(p => p.lat));
    const minLon = Math.min(...gs.coordinatesPasture.map(p => p.lon));
    const maxLon = Math.max(...gs.coordinatesPasture.map(p => p.lon));

    const scaleX = gs.canvasWidth / (maxLon - minLon);
    const scaleY = gs.canvasHeight / (maxLat - minLat);

    // Fill the polygonArrays
    gs.coordinatesPasture.forEach((point, index) => {
        const x = (point.lon - minLon) * scaleX;
        const y = gs.canvasHeight - (point.lat - minLat) * scaleY;  // Invert Y since canvas Y is top-down
        polygonOutside.push({ x: x, y: y });
    });

    gs.coordinatesBarn.forEach((point, index) => {
        const x = (point.lon - minLon) * scaleX;
        const y = gs.canvasHeight - (point.lat - minLat) * scaleY;  // Invert Y since canvas Y is top-down
        polygonBarn.push({ x: x, y: y });
    });
}


export function triangulatePolygon(polygon: { x: number, y: number }[]): { x: number, y: number }[][] {
    const triangles: { x: number, y: number }[][] = [];
    const n = polygon.length;

    if (n < 3) {
        return triangles;
    }

    const V = new Array(n);
    if (0 < getArea(polygon)) {
        for (let v = 0; v < n; v++) {
            V[v] = v;
        }
    } else {
        for (let v = 0; v < n; v++) {
            V[v] = (n - 1) - v;
        }
    }

    let nv = n;
    let count = 2 * nv;
    for (let m = 0, v = nv - 1; nv > 2;) {
        if (0 >= (count--)) {
            return triangles;
        }

        let u = v;
        if (nv <= u) {
            u = 0;
        }
        v = u + 1;
        if (nv <= v) {
            v = 0;
        }
        let w = v + 1;
        if (nv <= w) {
            w = 0;
        }

        if (snip(polygon, u, v, w, nv, V)) {
            let a, b, c, s, t;

            a = V[u];
            b = V[v];
            c = V[w];
            triangles.push([polygon[a], polygon[b], polygon[c]]);

            for (s = v, t = v + 1; t < nv; s++, t++) {
                V[s] = V[t];
            }
            nv--;
            count = 2 * nv;
        }
    }

    return triangles;
}

export function getArea(polygon: { x: number, y: number }[]): number {
    let area = 0;
    const n = polygon.length;
    for (let p = n - 1, q = 0; q < n; p = q++) {
        area += polygon[p].x * polygon[q].y - polygon[q].x * polygon[p].y;
    }
    return area / 2;
}

export function snip(polygon: { x: number, y: number }[], u: number, v: number, w: number, n: number, V: number[]): boolean {
    const Ax = polygon[V[u]].x;
    const Ay = polygon[V[u]].y;
    const Bx = polygon[V[v]].x;
    const By = polygon[V[v]].y;
    const Cx = polygon[V[w]].x;
    const Cy = polygon[V[w]].y;

    if (Number.EPSILON > (((Bx - Ax) * (Cy - Ay)) - ((By - Ay) * (Cx - Ax)))) {
        return false;
    }

    for (let p = 0; p < n; p++) {
        if ((p === u) || (p === v) || (p === w)) {
            continue;
        }

        const Px = polygon[V[p]].x;
        const Py = polygon[V[p]].y;

        if (insideTriangle(Ax, Ay, Bx, By, Cx, Cy, Px, Py)) {
            return false;
        }
    }

    return true;
}

export function insideTriangle(Ax: number, Ay: number, Bx: number, By: number, Cx: number, Cy: number, Px: number, Py: number): boolean {
    const ax = Cx - Bx;
    const ay = Cy - By;
    const bx = Ax - Cx;
    const by = Ay - Cy;
    const cx = Bx - Ax;
    const cy = By - Ay;
    const apx = Px - Ax;
    const apy = Py - Ay;
    const bpx = Px - Bx;
    const bpy = Py - By;
    const cpx = Px - Cx;
    const cpy = Py - Cy;

    const aCROSSbp = ax * bpy - ay * bpx;
    const cCROSSap = cx * apy - cy * apx;
    const bCROSScp = bx * cpy - by * cpx;

    return ((aCROSSbp >= 0) && (bCROSScp >= 0) && (cCROSSap >= 0));
}

export function isPointInTriangle(point: [number, number], triangle: [[number, number], [number, number], [number, number]]): boolean {
    const [p1, p2, p3] = triangle;
    const [x, y] = point;

    const b1 = (x - p2[0]) * (p1[1] - p2[1]) - (y - p2[1]) * (p1[0] - p2[0]) < 0;
    const b2 = (x - p3[0]) * (p2[1] - p3[1]) - (y - p3[1]) * (p2[0] - p3[0]) < 0;
    const b3 = (x - p1[0]) * (p3[1] - p1[1]) - (y - p1[1]) * (p3[0] - p1[0]) < 0;

    return ((b1 === b2) && (b2 === b3));
}


export function drawPolygon(ctx: CanvasRenderingContext2D): void {
    const gs = useGlobalsStore();
    if (polygonOutside.length === 0 || polygonBarn.length === 0) computePolygon();
    // Clear the canvas
    ctx.clearRect(0, 0, gs.canvasWidth, gs.canvasHeight);

    // Draw the OutsidePolygon
    ctx.beginPath();

    polygonOutside.forEach((point, index) => {
        let translatedPoint = { x: point.x + gs.canvasPanOffsetX, y: point.y + gs.canvasPanOffsetY };
   
        if (index === 0) ctx.moveTo(translatedPoint.x, translatedPoint.y);
        else ctx.lineTo(translatedPoint.x, translatedPoint.y);

        ctx.fillText(index.toString(), translatedPoint.x + 5, translatedPoint.y - 5);
        // if (index === 0) ctx.moveTo(point.x, point.y);
        // else ctx.lineTo(point.x, point.y);

        // ctx.fillText(index.toString(), point.x + 5, point.y - 5);
    });
    ctx.closePath();
    ctx.fillStyle = gs.isCowInPasture ? 'rgba(0, 255, 0, 0.75)' : 'rgba(0, 255, 0, 0.45)';
    ctx.fill();


    // Draw the BarnPolygon
    ctx.beginPath();

    polygonBarn.forEach((point, index) => {
        point.x += gs.canvasPanOffsetX;
        point.y += gs.canvasPanOffsetY;
        if (index === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);

        ctx.fillText(index.toString(), point.x + 5, point.y - 5);
    });
    ctx.closePath();
    ctx.fillStyle = gs.isCowInBarn ? 'rgba(0,200 , 255, 0.75)' : 'rgba(0,200 , 255, 0.45)';
    ctx.fill();
}


export function drawTriangle(ctx: CanvasRenderingContext2D, triangle: { x: number, y: number }[]): void {
    ctx.beginPath();
    ctx.moveTo(triangle[0].x, triangle[0].y);
    ctx.lineTo(triangle[1].x, triangle[1].y);
    ctx.lineTo(triangle[2].x, triangle[2].y);
    ctx.closePath();
    ctx.strokeStyle = 'red';
    ctx.stroke();
    ctx.fillStyle = 'rgba(255, 0, 0, 0.0)';
    ctx.fill();
}



/**
 * 
 The isInsidePolygon function takes two arguments: a point object with x and y properties, and an array of scaledCoordinates objects, each with x and y properties. The function returns a boolean value indicating whether the point is inside the polygon defined by the scaledCoordinates.

The function uses the "ray casting" algorithm to determine whether the point is inside the polygon. The algorithm works by drawing a horizontal line from the point to the right, and counting the number of times the line intersects with the edges of the polygon. If the number of intersections is odd, the point is inside the polygon; if it's even, the point is outside.

The function loops through each pair of adjacent coordinates in the scaledCoordinates array, and checks whether the horizontal line intersects with the edge defined by those coordinates. If it does, the function toggles a boolean variable inside, which starts out as false. The inside variable is toggled each time the horizontal line crosses an edge of the polygon.

Finally, the function returns the value of the inside variable, which will be true if the point is inside the polygon, and false otherwise.

Step by Step Explanation:

The function initializes the x and y variables to the x and y properties of the point object.

The function initializes the inside variable to false.

The function loops through each pair of adjacent coordinates in the scaledCoordinates array, using the i and j variables to keep track of the current and previous coordinates.

The function extracts the x and y values of the current and previous coordinates into the xi, yi, xj, and yj variables.

The function calculates whether the horizontal line intersects with the edge defined by the current and previous coordinates, using the following formula:

This formula checks whether the y coordinate of the point is between the y coordinates of the current and previous coordinates, and whether the x coordinate of the point is to the left of the intersection point of the horizontal line with the edge. If both conditions are true, the horizontal line intersects with the edge.

If the horizontal line intersects with the edge, the function toggles the inside variable by setting it to the opposite of its current value.

After looping through all the edges of the polygon, the function returns the value of the inside variable, which indicates whether the point is inside the polygon.} point 
 */
export function isInsidePolygon(point: { x: number, y: number }, scaledCoordinates: { x: number, y: number }[]): boolean {
    let x = point.x, y = point.y;

    let inside = false;
    for (let i = 0, j = scaledCoordinates.length - 1; i < scaledCoordinates.length; j = i++) {
        let xi = scaledCoordinates[i].x, yi = scaledCoordinates[i].y;
        let xj = scaledCoordinates[j].x, yj = scaledCoordinates[j].y;

        let intersect = ((yi > y) !== (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
}



export function isInsidePasturePolygon(point: { lat: number, lon: number }): boolean {
    const gs = useGlobalsStore();

    let pastureCoords = gs.coordinatesPasture.map(p => {
        return ConvertGeoCoordsToCanvasXY(p.lat, p.lon)
    })
    let inside = isInsidePolygon({ x: point.lon, y: point.lat }, pastureCoords)
    return inside;
}

export function isInsideBarnPolygon(point: { lat: number, lon: number }): boolean {
    const gs = useGlobalsStore();
    let barnCoords = gs.coordinatesBarn.map(p => {
        return ConvertGeoCoordsToCanvasXY(p.lat, p.lon)
    })
    let inside = isInsidePolygon({ x: point.lon, y: point.lat }, barnCoords)
    return inside;
}

export function closestPointOnSegment(point: { x: number, y: number }, segmentStart: { x: number, y: number }, segmentEnd: { x: number, y: number }): { x: number, y: number } {
    const dx = segmentEnd.x - segmentStart.x;
    const dy = segmentEnd.y - segmentStart.y;
    const t = ((point.x - segmentStart.x) * dx + (point.y - segmentStart.y) * dy) / (dx * dx + dy * dy);

    if (t < 0) return segmentStart;
    if (t > 1) return segmentEnd;

    return {
        x: segmentStart.x + t * dx,
        y: segmentStart.y + t * dy
    };
}

export function closestPointOnPolygon(point: { x: number, y: number }, scaledCoordinates: { x: number, y: number }[]): { x: number, y: number } | null {
    let closestPoint = null;
    let smallestDistance = Infinity;

    for (let i = 0; i < scaledCoordinates.length; i++) {
        const start = scaledCoordinates[i];
        const end = scaledCoordinates[(i + 1) % scaledCoordinates.length];  // Wrap around for last vertex
        const currentClosestPoint = closestPointOnSegment(point, start, end);

        const dx = point.x - currentClosestPoint.x;
        const dy = point.y - currentClosestPoint.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < smallestDistance) {
            smallestDistance = distance;
            closestPoint = currentClosestPoint;
        }
    }

    return closestPoint;
}



export function drawRectangle(canvas: HTMLCanvasElement, id: number = -1, x: number, y: number, width: number, height: number, fillColor: string = 'rgba(255, 0, 0, 0.25)'): void {
    const ctx = canvas.getContext('2d');
    if (ctx === null) return;
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);
    ctx.fillStyle = fillColor;
    ctx.fillRect(x + 2, y + 2, width - 4, height - 4);
    if (id >= 0) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.font = '14px Arial';
        ctx.fillText(id.toString(), x + 3, y + 14);
    }
}
export function calculateSpaces(canvas: HTMLCanvasElement, width: number, height: number): void {
    const gs = useGlobalsStore();

    gs.spaces.length = 0;

    const rectangles = subdivideCanvas(canvas, width, height);
    const trianglesOutside = triangulatePolygon(polygonOutside);
    const trianglesBarn = triangulatePolygon(polygonBarn);
    const triangles = trianglesOutside.concat(trianglesBarn);


    console.log("rect spaces");
    for (let i = 0, spaceId = 0; i < rectangles.length; i++) {
        const rectangle = rectangles[i];
        let x1 = rectangle.x;
        let x2 = rectangle.x + rectangle.width;
        let y1 = rectangle.y;
        let y2 = rectangle.y + height;

        let p1 = { x: x1, y: y1 }
        let p2 = { x: x1, y: y2 }
        let p3 = { x: x2, y: y1 }
        let p4 = { x: x2, y: y2 }

        let foundRectangle = false
        let sensorType = "";
        for (let j = 0; j < triangles.length; j++) {
            // const triangle: Triangle = triangles[j];
            const triangle: Triangle = [triangles[j][0], triangles[j][1], triangles[j][2]];
            // if (gs.ctx) drawTriangle(gs.ctx, triangle);
            if (isPointInsideTriangle(p1, triangle) || isPointInsideTriangle(p2, triangle) || isPointInsideTriangle(p3, triangle) || isPointInsideTriangle(p4, triangle)) {
                foundRectangle = true;
                sensorType = j >= trianglesOutside.length ? "Beacon" : "Mioty";
                break;
            }
        }
        if (foundRectangle) {
            // create spaces
            let centerX = rectangle.x + (rectangle.width / 2);
            let centerY = rectangle.y + (rectangle.height / 2);
            let geoCoords = ConvertCanvasXYToGeoCoords(centerX, centerY); // we use the center of the rectangle as the geooords for the space and for its sensor
            let space = new Space(spaceId + 1, "myspace", sensorType, -1, geoCoords.longitude, geoCoords.latitude, [geoCoords.latitude, geoCoords.longitude, 1], [rectangle.x, rectangle.y, 1], [rectangle.x, rectangle.y], [])
            gs.spaces.push(space);
            spaceId++;
            drawRectangle(canvas, spaceId, rectangle.x, rectangle.y, rectangle.width, rectangle.height, sensorType === "Mioty" ? 'rgba(255, 0, 0, 0.20)' : 'rgba(0, 0, 255, 0.20)');
            // console.log(space.id);
        }
    }

    // sort spaces by x first and reassign coords[0] to be in simple ascending 
    gs.spaces.sort((a, b) => a.coordinates[0] - b.coordinates[0]);
    let newSpaceX = 0;
    let prevSpaceCoord0 = 0;
    for (let i = 0; i < gs.spaces.length; i++) {
        const space = gs.spaces[i];
        if (i == 0) prevSpaceCoord0 = space.coordinates[0];

        if (prevSpaceCoord0 < space.coordinates[0]) {
            newSpaceX++;
            prevSpaceCoord0 = space.coordinates[0];
        }
        space.coordinates[0] = newSpaceX;
    }

    // sort spaces by y first and reassign coords[1] to be in simple ascending 
    gs.spaces.sort((a, b) => a.coordinates[1] - b.coordinates[1]);
    let newSpaceY = 0;
    let prevSpaceCoord1 = 0;
    for (let i = 0; i < gs.spaces.length; i++) {
        const space = gs.spaces[i];
        if (i == 0) prevSpaceCoord1 = space.coordinates[1];

        if (prevSpaceCoord1 < space.coordinates[1]) {
            newSpaceY++;
            prevSpaceCoord1 = space.coordinates[1];
        }
        space.coordinates[1] = newSpaceY;
    }

    findAndAssignLogicalNeighbors(gs.spaces);

    // sort by y primary and by x secondary
    gs.spaces.sort((a, b) => {
        if (a.coordinates[1] === b.coordinates[1]) {
            return a.coordinates[0] - b.coordinates[0];
        }
        return a.coordinates[1] - b.coordinates[1];
    });

    // create Sensors
    gs.sensors.length = 0;
    for (let i = 0; i < gs.spaces.length; i++) {
        const space = gs.spaces[i];
        let sensor = new Sensor(space.id, 1, space.sensorType, [space.id], [space.coordinates[0], space.coordinates[1], 1], space.geoCoordinates);
        gs.sensors.push(sensor);
    }


    let outsideSpace = new Space(0, "outside", "Mioty", -1, gs.spaces[0].longitude, gs.spaces[0].latitude, gs.spaces[0].geoCoordinates, [-1, -1, 1], [-1, -1], [1]);
    gs.spaces.push(outsideSpace);

}
export function findAndAssignLogicalNeighbors(spaceCollection: Space[]): void {
    // Sort the spaces by x-geocoordinate
    spaceCollection.sort((a, b) => a.coordinates[0] - b.coordinates[0]);

    // Find neighbors for each space
    for (let i = 0; i < spaceCollection.length; i++) {
        const space = spaceCollection[i];

        if (space.neighbors.length === 8) {
            continue;
        }

        for (let j = i + 1; j < spaceCollection.length; j++) {
            const otherSpace = spaceCollection[j];

            if (
                Math.abs(space.coordinates[0] - otherSpace.coordinates[0]) <= 1 &&
                Math.abs(space.coordinates[1] - otherSpace.coordinates[1]) <= 1
            ) {
                space.neighbors.push(otherSpace.id);
                if (!otherSpace.neighbors.includes(space.id)) {
                    otherSpace.neighbors.push(space.id);
                }
            }
        }

        // if for some circumstance we didnt find any neighbours, increase the radius
        let radius = 2;
        while (space.neighbors.length === 0 && radius < 10) {
            for (let j = 0; j < spaceCollection.length; j++) {
                const otherSpace = spaceCollection[j];
                if (otherSpace.id === space.id) {
                    continue;
                }

                if (
                    Math.abs(space.coordinates[0] - otherSpace.coordinates[0]) <= radius &&
                    Math.abs(space.coordinates[1] - otherSpace.coordinates[1]) <= radius
                ) {
                    space.neighbors.push(otherSpace.id);
                    if (!otherSpace.neighbors.includes(space.id)) {
                        otherSpace.neighbors.push(space.id);
                    }
                }
            }
            radius++;
        }
        space.neighbors.sort((a, b) => a - b);
    }
}

export function drawSpaces() {

}

export function drawScene(): void {
    console.log('drawScene');
    // Redraw the entire scene
    const gs = useGlobalsStore();
    // const ctx = gs.ctx;
    if (gs.ctx == null) return;
    drawPolygon(gs.ctx);
    gs.ctx.beginPath();
    path.forEach((point, index) => {
        if (index === 0) gs.ctx?.moveTo(point.x, point.y);
        else gs.ctx?.lineTo(point.x, point.y);
    });
    gs.ctx.strokeStyle = 'black';
    gs.ctx.lineWidth = 1;
    gs.ctx.stroke();

    calculateSpaces(gs.canvasRef, gs.sensorWidthInMeters, gs.sensorWidthInMeters);
    drawSpaces();
    drawSMARTEvents();
}

export function toggleDrawing(event: MouseEvent): void {
    console.log('toggleDrawing');
    const gs = useGlobalsStore();
    isDrawing = !isDrawing;

    if (isDrawing) {

        let rect = gs.canvasRef.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;
        if (isInsidePolygon({ x, y }, gs.scaledCoordinatesCombined)) {
            path = [{ x, y }];
            console.log('Mouse in polygon');
            if (isInsideBarnPolygon({ lon: x, lat: y })) { console.log("inside BARN"); gs.isCowInBarn = true; } else { gs.isCowInBarn = false; }
            if (isInsidePasturePolygon({ lon: x, lat: y })) { console.log("inside PASTURE"); gs.isCowInPasture = true; } else { gs.isCowInPasture = false; }


        } else {
            isDrawing = false;
            console.log('Mouse is outside of polygon');
        }

    } else {
        // Draw the final path
        gs.ctx?.beginPath();
        path.forEach((point, index) => {
            if (index === 0) gs.ctx?.moveTo(point.x, point.y);
            else gs.ctx?.lineTo(point.x, point.y);
        });
        if (gs.ctx != null) {
            gs.ctx.strokeStyle = 'black';
            gs.ctx.lineWidth = 1;
            gs.ctx.stroke();
        }

    }
}


export function updateDrawings(event: MouseEvent): void {
    console.log('updateDrawings');
    const gs = useGlobalsStore();

    let rect = gs.canvasRef.getBoundingClientRect();
    if (isDrawing) {
        // debugger;
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;

        if (!isInsidePolygon({ x, y }, gs.scaledCoordinatesCombined)) {

            // Find the closest point on the polygon to the current mouse position
            const clampedPoint = closestPointOnPolygon({ x, y }, gs.scaledCoordinatesCombined);
            if (clampedPoint) {
                x = clampedPoint.x;
                y = clampedPoint.y;
            }


        }
        if (isInsideBarnPolygon({ lon: x, lat: y })) { console.log("inside BARN"); gs.isCowInBarn = true; } else { gs.isCowInBarn = false; }
        if (isInsidePasturePolygon({ lon: x, lat: y })) { console.log("inside PASTURE"); gs.isCowInPasture = true; } else { gs.isCowInPasture = false; }
        gs.mousePosition.x = x;
        gs.mousePosition.y = y;
        path.push({ x, y });

        drawScene();
    }
}



export function drawSMARTEvents(): void {
    const gs = useGlobalsStore();

    gs.smartEvents.forEach(smartEvent => {
        // console.log(smartEvent.spaceIds);
        let spaceIds = smartEvent.spaceIds.split(',').map(Number);
        for (let i = 0; i < spaceIds.length; i++) {
            const spaceId = spaceIds[i];

            let space = gs.spaces.find(s => s.id === spaceId);
            if (space === undefined) continue;
            let x = space.canvasCoordinates[0];
            let y = space.canvasCoordinates[1];

            let padding = 0;
            let color = colorToRgba(smartEvent.colorRGB, smartEvent.colorAlpha);
            drawRectangle(gs.canvasRef, -1, x + padding, y + padding, gs.sensorWidthInMeters - 2 * padding, gs.sensorWidthInMeters - 2 * padding, color)
            // ctx.fillStyle = 'rgba(255, 0, 0, 1)';
            if (gs.ctx === null) continue;
            gs.ctx.fillStyle = 'rgba(255, 0, 0, 1)';
            gs.ctx.font = '14px Arial';
            gs.ctx.fillText(smartEvent.id.toString(), x + 0.5 * gs.sensorWidthInMeters, y + 0.5 * gs.sensorWidthInMeters);
        }
    });
}
