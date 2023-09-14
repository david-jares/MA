import { useGlobalsStore } from '@/stores/globals';


export function testSomething() {
    let globalsStore = useGlobalsStore();
    console.log(globalsStore.canvasRef);
}

export function GetGeoocordinatesUnderMouse(e: MouseEvent) {
    let globalsStore = useGlobalsStore();

    let rect = globalsStore.canvasRef.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    return ConvertCanvasXYToGeoCoords(x, y);
}

export function ConvertCanvasXYToGeoCoords(x: number, y: number) : { latitude: number, longitude: number }  {
    let gs = useGlobalsStore();
    // Convert x and y back to latitude and longitude
    let yScale = (gs.maxLat - gs.minLat) / gs.canvasRef.height;
    let xScale = (gs.maxLon - gs.minLon) / gs.canvasRef.width;
    let latitude = gs.maxLat - y * yScale;
    let longitude = gs.minLon + x * xScale;

    return { latitude, longitude };
}

export function ConvertGeoCoordsToCanvasXY(lat: number, long: number): { x: number, y: number }  {
    let gs = useGlobalsStore();
    let yScale = (gs.maxLat - gs.minLat) / gs.canvasHeight;
    let xScale = (gs.maxLon - gs.minLon) / gs.canvasWidth;


    let y = Math.round((gs.maxLat - lat) / yScale);
    let x = Math.round((long - gs.minLon) / xScale);

    return { x, y };
}