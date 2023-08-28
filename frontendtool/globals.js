let canvasWidth = 800;
let canvasHeight = 600;

let cowId = '1';
let recordIntervalInSeconds = 60;
let recordDurationInDays = 2;
let timeSpeedMultiplier = 600;
let sensorWidthInMeters = 40;

let sensors = [];
let spaces = [];

const coordinatesOutside = [
    { lat: 49.68101400333333, lon: 12.20009942 },
    { lat: 49.68115214666667, lon: 12.200764548333334 },
    { lat: 49.682404365, lon: 12.199464525 },
    { lat: 49.68266766333333, lon: 12.197345735 },
    { lat: 49.68249247666667, lon: 12.197450201666667 },
    // { lat: 49.68194168, lon: 12.198492973333334 },
    { lat: 49.681985108333336, lon: 12.198418175 },
    { lat: 49.68204832833333, lon: 12.199110575 },
    
    { lat: 49.681460, lon: 12.199756 },
    { lat: 49.681411, lon: 12.199547 },
    { lat: 49.681353, lon: 12.199602 },
    { lat: 49.681414, lon: 12.199807 },


    { lat: 49.68131979333333, lon: 12.199891363333334 },
    { lat: 49.68111546833333, lon: 12.200051731666667 }
];

const coordinatesBarn = [
    { lat: 49.681714, lon: 12.199252 },
    { lat: 49.681642, lon: 12.198957 },
    { lat: 49.681133, lon: 12.199435 },
    { lat: 49.681212, lon: 12.199739 },
];

const coordinatesCombined = [
    { lat: 49.68101400333333, lon: 12.20009942 },
    { lat: 49.68115214666667, lon: 12.200764548333334 },
    { lat: 49.682404365, lon: 12.199464525 },
    { lat: 49.68266766333333, lon: 12.197345735 },
    { lat: 49.68249247666667, lon: 12.197450201666667 },
    // { lat: 49.68194168, lon: 12.198492973333334 },
    { lat: 49.681985108333336, lon: 12.198418175 },
    { lat: 49.68204832833333, lon: 12.199110575 },
    { lat: 49.681460, lon: 12.199756 },
    { lat: 49.681411, lon: 12.199547 },


    { lat: 49.681714, lon: 12.199252 },
    { lat: 49.681642, lon: 12.198957 },
    { lat: 49.681133, lon: 12.199435 },
    { lat: 49.681212, lon: 12.199739 },


    { lat: 49.681353, lon: 12.199602 },
    { lat: 49.681414, lon: 12.199807 },
    { lat: 49.68131979333333, lon: 12.199891363333334 },
    { lat: 49.68111546833333, lon: 12.200051731666667 }
];



const allCoordinates = coordinatesOutside.concat(coordinatesBarn);

// Calculate the scaled coordinates for use in the isInsidePolygon function
// let minLat = Math.min(...coordinatesOutside.map(p => p.lat));
// let maxLat = Math.max(...coordinatesOutside.map(p => p.lat));
// let minLon = Math.min(...coordinatesOutside.map(p => p.lon));
// let maxLon = Math.max(...coordinatesOutside.map(p => p.lon));
let minLat = Math.min(...coordinatesCombined.map(p => p.lat));
let maxLat = Math.max(...coordinatesCombined.map(p => p.lat));
let minLon = Math.min(...coordinatesCombined.map(p => p.lon));
let maxLon = Math.max(...coordinatesCombined.map(p => p.lon));

let scaleX = canvasWidth / (maxLon - minLon);
let scaleY = canvasHeight / (maxLat - minLat);

// let scaledCoordinates = coordinatesOutside.map(point => {
//     return {
//         x: (point.lon - minLon) * scaleX,
//         y: canvasHeight - (point.lat - minLat) * scaleY
//     };
// });
let scaledCoordinates = coordinatesCombined.map(point => {
    return {
        x: (point.lon - minLon) * scaleX,
        y: canvasHeight - (point.lat - minLat) * scaleY
    };
});
console.log("scaled coords")
console.log(scaledCoordinates)