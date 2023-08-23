let canvasWidth = 800;
let canvasHeight = 600;

let cowId = '1';
let recordIntervalInSeconds = 60;
let recordDurationInDays = 2;
let timeSpeedMultiplier = 600;
let sensorWidthInMeters = 100;


const coordinates = [
    { lat: 49.68101400333333, lon: 12.20009942 },
    { lat: 49.68115214666667, lon: 12.200764548333334 },
    { lat: 49.682404365, lon: 12.199464525 },
    { lat: 49.68266766333333, lon: 12.197345735 },
    { lat: 49.68249247666667, lon: 12.197450201666667 },
    // { lat: 49.68194168, lon: 12.198492973333334 },
    { lat: 49.681985108333336, lon: 12.198418175 },
    { lat: 49.68204832833333, lon: 12.199110575 },
    { lat: 49.68131979333333, lon: 12.199891363333334 },
    { lat: 49.68111546833333, lon: 12.200051731666667 }
];


// Calculate the scaled coordinates for use in the isInsidePolygon function
let minLat = Math.min(...coordinates.map(p => p.lat));
let maxLat = Math.max(...coordinates.map(p => p.lat));
let minLon = Math.min(...coordinates.map(p => p.lon));
let maxLon = Math.max(...coordinates.map(p => p.lon));

let scaleX = canvasWidth / (maxLon - minLon);
let scaleY = canvasHeight / (maxLat - minLat);

let scaledCoordinates = coordinates.map(point => {
    return {
        x: (point.lon - minLon) * scaleX,
        y: canvasHeight - (point.lat - minLat) * scaleY
    };
});