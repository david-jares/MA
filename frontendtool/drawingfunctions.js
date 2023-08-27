const polygonOutside = [];
const polygonBarn = [];

function computePolygon() {
    polygonOutside.length = 0;
    let minLat = Math.min(...coordinatesOutside.map(p => p.lat));
    let maxLat = Math.max(...coordinatesOutside.map(p => p.lat));
    let minLon = Math.min(...coordinatesOutside.map(p => p.lon));
    let maxLon = Math.max(...coordinatesOutside.map(p => p.lon));

    let scaleX = canvas.width / (maxLon - minLon);
    let scaleY = canvas.height / (maxLat - minLat);

    // Fill the polygonArrays
    coordinatesOutside.forEach((point, index) => {
        let x = (point.lon - minLon) * scaleX;
        let y = canvas.height - (point.lat - minLat) * scaleY;  // Invert Y since canvas Y is top-down
        polygonOutside.push({ x: x, y: y });
    });

    coordinatesBarn.forEach((point, index) => {
        let x = (point.lon - minLon) * scaleX;
        let y = canvas.height - (point.lat - minLat) * scaleY;  // Invert Y since canvas Y is top-down
        polygonBarn.push({ x: x, y: y });
    });

}


function triangulatePolygon(polygon) {
    const triangles = [];
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

function getArea(polygon) {
    let area = 0;
    const n = polygon.length;
    for (let p = n - 1, q = 0; q < n; p = q++) {
        area += polygon[p].x * polygon[q].y - polygon[q].x * polygon[p].y;
    }
    return area / 2;
}

function snip(polygon, u, v, w, n, V) {
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

function insideTriangle(Ax, Ay, Bx, By, Cx, Cy, Px, Py) {
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

function isPointInTriangle(point, triangle) {
    const [p1, p2, p3] = triangle;
    const [x, y] = point;

    const b1 = (x - p2[0]) * (p1[1] - p2[1]) - (y - p2[1]) * (p1[0] - p2[0]) < 0;
    const b2 = (x - p3[0]) * (p2[1] - p3[1]) - (y - p3[1]) * (p2[0] - p3[0]) < 0;
    const b3 = (x - p1[0]) * (p3[1] - p1[1]) - (y - p1[1]) * (p3[0] - p1[0]) < 0;

    return ((b1 === b2) && (b2 === b3));
}


function drawPolygon(ctx) {
    if (polygonOutside.length === 0 || polygonBarn.length === 0) computePolygon();
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the OutsidePolygon
    ctx.beginPath();

    polygonOutside.forEach((point, index) => {

        if (index === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);

        ctx.fillText(index, point.x + 5, point.y - 5);
    });
    ctx.closePath();
    ctx.fillStyle = 'rgba(0, 255, 0, 0.5)';
    ctx.fill();


    // Draw the BarnPolygon
    ctx.beginPath();

    polygonBarn.forEach((point, index) => {

        if (index === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);

        ctx.fillText(index, point.x + 5, point.y - 5);
    });
    ctx.closePath();
    ctx.fillStyle = 'rgba(0,200 , 255, 0.5)';
    ctx.fill();
}
function drawTriangle(ctx, triangle) {
    ctx.beginPath();
    ctx.moveTo(triangle[0].x, triangle[0].y);
    ctx.lineTo(triangle[1].x, triangle[1].y);
    ctx.lineTo(triangle[2].x, triangle[2].y);
    ctx.closePath();
    ctx.strokeStyle = 'red';
    ctx.stroke();
    ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
    ctx.fill();
}

function isInsidePolygon(point, scaledCoordinates) {
    let x = point.x, y = point.y;

    let inside = false;
    for (let i = 0, j = scaledCoordinates.length - 1; i < scaledCoordinates.length; j = i++) {
        let xi = scaledCoordinates[i].x, yi = scaledCoordinates[i].y;
        let xj = scaledCoordinates[j].x, yj = scaledCoordinates[j].y;

        let intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
}

function closestPointOnSegment(point, segmentStart, segmentEnd) {
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
function closestPointOnPolygon(point, scaledCoordinates) {
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



function drawRectangle(canvas, id, x, y, width, height, fillColor = 'rgba(255, 0, 0, 0.25)') {
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);
    ctx.fillStyle = fillColor;
    ctx.fillRect(x + 2, y + 2, width - 4, height - 4);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.font = '14px Arial';
    ctx.fillText(id, x + 3, y + 14);
}

function calculateSpaces(canvas, width, height) {
    spaces.length = 0;

    const rectangles = subdivideCanvas(canvas, width, height);
    const trianglesOutside = triangulatePolygon(polygonOutside);
    const trianglesBarn = triangulatePolygon(polygonBarn);
    const triangles = trianglesOutside.concat(trianglesBarn);
    // for (let i = 0; i < triangles.length; i++) {
    //     const triangle = triangles[i];
    //     // drawTriangle(ctx, triangle);
    // }

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
            const triangle = triangles[j];
            if (isPointInsideTriangle(p1, triangle) || isPointInsideTriangle(p2, triangle) || isPointInsideTriangle(p3, triangle) || isPointInsideTriangle(p4, triangle)) {
                // console.log(`Rectangle ${rectangle.id} overlaps with outside polygon`);
                foundRectangle = true;
                sensorType = j >= trianglesOutside.length ? "Beacon" : "Mioty";
                break;
            }
        }
        if (foundRectangle) {

            // create spaces
            let centerX = rectangle.x + (rectangle.width / 2);
            let centerY = rectangle.y + (rectangle.height / 2);
            let geoCoords = ConvertCanvasXYToGeoCoords(centerX, centerY); // we use the center of the rectangel as the geooords for the space and for its sensor
            let space = new Space(spaceId + 1, "myspace",sensorType, "-1", geoCoords.longitude, geoCoords.latitude, [geoCoords.latitude, geoCoords.longitude, 1], [rectangle.x, rectangle.y, 1],[rectangle.x, rectangle.y], [])
            spaces.push(space);
            spaceId++;

            drawRectangle(canvas, spaceId, rectangle.x, rectangle.y, rectangle.width, rectangle.height, sensorType === "Mioty" ? 'rgba(255, 0, 0, 0.20)' : 'rgba(0, 0, 255, 0.20)');
        }
    }

    // sort spaces by x first and reassign coords[0] to be in simple ascending 
    spaces.sort((a, b) => a.coordinates[0] - b.coordinates[0]);
    // console.log(spaces);
    let newSpaceX = 0;
    let prevSpaceCoord0 = 0;
    for (let i = 0; i < spaces.length; i++) {
        const space = spaces[i];
        if (i == 0) prevSpaceCoord0 = space.coordinates[0];

        if (prevSpaceCoord0 < space.coordinates[0]) {
            newSpaceX++;
            prevSpaceCoord0 = space.coordinates[0];
        }
        space.coordinates[0] = newSpaceX;
    }

    // sort spaces by y first and reassign coords[1] to be in simple ascending 
    spaces.sort((a, b) => a.coordinates[1] - b.coordinates[1]);
    let newSpaceY = 0;
    let prevSpaceCoord1 = 0;
    for (let i = 0; i < spaces.length; i++) {
        const space = spaces[i];
        if (i == 0) prevSpaceCoord1 = space.coordinates[1];

        if (prevSpaceCoord1 < space.coordinates[1]) {
            newSpaceY++;
            prevSpaceCoord1 = space.coordinates[1];
        }
        space.coordinates[1] = newSpaceY;
    }

    findAndAssignLogicalNeighbors(spaces);

    // sort by y primary and by x secondary
    spaces.sort((a, b) => {
        if (a.coordinates[1] === b.coordinates[1]) {
            return a.coordinates[0] - b.coordinates[0];
        }
        return a.coordinates[1] - b.coordinates[1];
    });

    // spaces.forEach(a => {
    //     console.log(`id: ${a.id} , x:${a.coordinates[0]}, y:${a.coordinates[1]} , nbs: ${a.neighbors}`)
    // })


    // create Sensors
    sensors.length = 0;
    for (let i = 0; i < spaces.length; i++) {  
        const space = spaces[i];
        let sensor = new Sensor(space.id,1,space.sensorType, [space.id], [space.coordinates[0], space.coordinates[1], 1], space.geoCoordinates);
        sensors.push(sensor);
    }
    // console.log(sensors);

    // TODO 
    // add outside space
    // spaceCollection = append(spaceCollection, &Space{
    // 	ID:             0,
    // 	Description:    "outside",
    // 	Capacity:       -1,
    // 	Longitude:      spaceCollection[0].Longitude,
    // 	Latitude:       spaceCollection[0].Latitude,
    // 	GeoCoordinates: []float64{spaceCollection[0].Latitude, spaceCollection[0].Longitude, 1},
    // 	Coordinates:    []int{0, 0, 0},
    // 	Neighbors:      []int{1, put them all in here},
    // })

    let outsideSpace = new Space(0,"outside","Mioty",-1,spaces[0].geoCoordinates.longitude, spaces[0].geoCoordinates.latitude, spaces[0].geoCoordinates,[-1,-1,1],[-1,-1],[1]);
    spaces.push(outsideSpace);
    // {
    //     "id": 0,
    //     "description": "outside",
    //     "capacity": -1,
    //     "neighbors": [
    //         8
    //     ],
    //     "coordinates": [6,1,1],
    //     "geoCoordinates": [49.68181426283488,12.198898781537865,1]
    // },

}

function findAndAssignLogicalNeighbors(spaceCollection) {
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

function drawSpaces() {

}


function drawScene() {
    // Redraw the entire scene
    drawPolygon(ctx);
    ctx.beginPath();
    path.forEach((point, index) => {
        if (index === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
    });
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.stroke();

    calculateSpaces(canvas, sensorWidthInMeters, sensorWidthInMeters);
    drawSpaces();
    // drawTriangle(ctx,[{x:10,y:10},{x:400,y:40},{x:200,y:300}])
}

function toggleDrawing(evevnt) {
    isDrawing = !isDrawing;

    if (isDrawing) {

        let rect = canvas.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;
        if (isInsidePolygon({ x, y }, scaledCoordinates)) {
            path = [{ x, y }];

        } else {
            isDrawing = false;
            console.log('Mouse is outside of polygon');
        }

    } else {
        // Draw the final path
        ctx.beginPath();
        path.forEach((point, index) => {
            if (index === 0) ctx.moveTo(point.x, point.y);
            else ctx.lineTo(point.x, point.y);
        });
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.stroke();

    }
}
function updateDrawings(event) {
    let rect = canvas.getBoundingClientRect();
    if (isDrawing) {
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;

        if (!isInsidePolygon({ x, y }, scaledCoordinates)) {
            // Find the closest point on the polygon to the current mouse position
            const clampedPoint = closestPointOnPolygon({ x, y }, scaledCoordinates);
            x = clampedPoint.x;
            y = clampedPoint.y;
        }
        mousePosition.x = x;
        mousePosition.y = y;
        path.push({ x, y });

        drawScene();
    }
}
