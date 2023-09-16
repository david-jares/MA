import { useGlobalsStore } from "@/stores/globals";
import type { Point } from "./tempfunctions";
import { ExportableGeneratioConfig, ExportableLearningConfig, ExportableMetasensor, ExportableSensor, ExportableSpace } from "./model";

export function writeToConsoleOutput(content: string): void {
    let consoleOutput: HTMLTextAreaElement = document.getElementById('consoleOutput') as HTMLTextAreaElement;
    consoleOutput.value += content;
    consoleOutput.scrollTop = consoleOutput.scrollHeight;
}

export function clearConsoleOutput(): void {
    let consoleOutput: HTMLTextAreaElement = document.getElementById('consoleOutput') as HTMLTextAreaElement;
    consoleOutput.value = 'cattle_id, timestamp, longitude, latitude\n';
    console.log('cleared console output');
}

export class Rectangle {
    constructor(public id: number, public x: number, public y: number, public width: number, public height: number) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    get x1(): number {
        return this.x;
    }
    get y1(): number {
        return this.y;
    }
    get x2(): number {
        return this.x + this.width;
    }
    get y2(): number {
        return this.y + this.height;
    }
    get p1(): Point {
        return { x: this.x1, y: this.y1 };
    }
    get p2(): Point {
        return { x: this.x2, y: this.y1 };
    }
    get p3(): Point {
        return { x: this.x2, y: this.y2 };
    }
    get p4(): Point {
        return { x: this.x1, y: this.y2 };
    }

    get center(): Point {
        return { x: this.x + this.width / 2, y: this.y + this.height / 2 };
    }




    containsPoint(point: Point): boolean {
        return (point.x >= this.x1 && point.x <= this.x2 && point.y >= this.y1 && point.y <= this.y2);
    }
}

export function subdivideCanvas(canvas: HTMLCanvasElement, width: number, height: number): Rectangle[] {
    const rectangles: Rectangle[] = [];
    const numCols: number = Math.floor(canvas.width / width);
    const numRows: number = Math.floor(canvas.height / height);
    let id: number = 1;
    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            const x: number = col * width;
            const y: number = row * height;
            rectangles.push(new Rectangle(id, x, y, width, height));
            id++;
        }
    }
    return rectangles;
}


export function colorToRgba(color: string, alpha: number): string {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
export function formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')} : ${minutes.toString().padStart(2, '0')} : ${remainingSeconds.toString().padStart(2, '0')}`;
}

export function getTimeInSeconds(dateTimeString: string): number {
    const date = new Date(dateTimeString);
    return date.getTime() / 1000;
}
export function getDateTimeString(timeInSeconds: number): string {
    const date = new Date(timeInSeconds * 1000);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function getDateNow_YYYY_MM_DD() {
    const gs = useGlobalsStore();
    return gs.now.toLocaleDateString('en-CA');
}

function getDateInTwoDays_YYYY_MM_DD() {
    const gs = useGlobalsStore();
    return new Date(gs.now.getTime() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString('en-CA');
}


export function getConfigurationJSONString() {
    const gs = useGlobalsStore();
    let result = [];
    let sensors: string[] = [];
    gs.sensors.forEach((s) => {
        sensors.push(new ExportableSensor(s.id, s.metasensorId, s.coverage, s.coordinates, s.geoCoordinates).ToString());
    });
    // add special Sensor ?

    let spaces: string[] = [];
    gs.spaces.forEach((s) => {
        spaces.push(new ExportableSpace(s.id, s.description, s.capacity, s.coordinates, s.geoCoordinates, s.latitude, s.longitude, s.neighbors).ToString());
    });
    // add special Space 
    let metasensors = [];
    metasensors.push(new ExportableMetasensor(1, "Bluetooth Beacon").ToString());

    let scenarioLearningConfig = new ExportableLearningConfig(
        getDateNow_YYYY_MM_DD(),
        getDateInTwoDays_YYYY_MM_DD(),
        1,
        1,
        "EMA",
        10,
        5,
        1
    ).ToString();

    let scenarioGenerationCongig = new ExportableGeneratioConfig(
        10,
        "all",
        300,
        "all",
        getDateNow_YYYY_MM_DD(),
        getDateInTwoDays_YYYY_MM_DD()
    ).ToString();
    // add special Event
    result.push(sensors);
    result.push(spaces);
    result.push(metasensors);
    result.push(scenarioLearningConfig);
    result.push(scenarioGenerationCongig);
    console.log(result);

    return JSON.stringify(result, null, 2);
}