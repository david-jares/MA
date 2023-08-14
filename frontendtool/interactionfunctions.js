function GetGeoocordinatesUnderMouse(e){
    let rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

// Convert x and y back to latitude and longitude
    let yScale = (maxLat - minLat) / canvas.height;
    let xScale = (maxLon - minLon) / canvas.width;
    let latitude = maxLat - y * yScale;
    let longitude = minLon + x * xScale;

    return {latitude, longitude};
}

function MouseXYToGeoCoords(x, y){
// Convert x and y back to latitude and longitude
let yScale = (maxLat - minLat) / canvas.height;
let xScale = (maxLon - minLon) / canvas.width;
let latitude = maxLat - y * yScale;
let longitude = minLon + x * xScale;

return {latitude, longitude};
}