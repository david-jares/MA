const coordinates = [
    {lat: 49.68101400333333, lon: 12.20009942},
    {lat: 49.68115214666667, lon: 12.200764548333334},
    {lat: 49.682404365, lon: 12.199464525},
    {lat: 49.68266766333333, lon: 12.197345735},
    {lat: 49.68249247666667, lon: 12.197450201666667},
    {lat: 49.681985108333336, lon: 12.198418175},
    {lat: 49.68194168, lon: 12.198492973333334},
    {lat: 49.68204832833333, lon: 12.199110575},
    {lat: 49.68131979333333, lon: 12.199891363333334},
    {lat: 49.68111546833333, lon: 12.200051731666667}
];


function drawPolygon(ctx) {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Find bounding box of coordinates to determine scale
    let minLat = Math.min(...coordinates.map(p => p.lat));
    let maxLat = Math.max(...coordinates.map(p => p.lat));
    let minLon = Math.min(...coordinates.map(p => p.lon));
    let maxLon = Math.max(...coordinates.map(p => p.lon));

    let scaleX = canvas.width / (maxLon - minLon);
    let scaleY = canvas.height / (maxLat - minLat);

    // Draw the polygon
    ctx.beginPath();
    coordinates.forEach((point, index) => {
        let x = (point.lon - minLon) * scaleX;
        let y = canvas.height - (point.lat - minLat) * scaleY;  // Invert Y since canvas Y is top-down

        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);

        ctx.fillText(index, x + 5, y - 5);
    });
    ctx.closePath();
    ctx.fillStyle = 'rgba(0, 255, 0, 0.5)';
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