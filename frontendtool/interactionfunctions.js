function GetGeoocordinatesUnderMouse(e) {
    let rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    return ConvertCanvasXYToGeoCoords(x,y);
}

function ConvertCanvasXYToGeoCoords(x, y) {
    // Convert x and y back to latitude and longitude
    let yScale = (maxLat - minLat) / canvas.height;
    let xScale = (maxLon - minLon) / canvas.width;
    let latitude = maxLat - y * yScale;
    let longitude = minLon + x * xScale;

    return { latitude, longitude };
}

function ConvertGeoCoordsToCanvasXY(lat, long) {
    let yScale = (maxLat - minLat) / canvas.height;
    let xScale = (maxLon - minLon) / canvas.width;


    let y = Math.round((maxLat - lat) / yScale);
    let x = Math.round((long - minLon) / xScale);

    return { x, y };
  }