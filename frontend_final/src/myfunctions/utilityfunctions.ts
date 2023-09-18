import { useGlobalsStore } from "@/stores/globals";
import type { Point } from "./tempfunctions";
import { ExportableConfig, ExportableEvent, ExportableEventCapacityEntry, ExportableGenerationConfig, ExportableLearningConfig, ExportableMetasensor, ExportableSensor, ExportableSpace, MetaEvent, MetaEventAffinity, MetaEventCapacity, MetaEventSpace, MetaPeople as MetaPerson, MetaPerson as Person, Space, TimeProfile } from "./model";

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
    // let result = [];

    let sensors: ExportableSensor[] = [];
    gs.sensors.forEach((s) => {
        sensors.push(new ExportableSensor(s.id, s.sensorType + " Sensor", s.metasensorId, s.coverage, s.coordinates, s.geoCoordinates));
    });
    // add special Sensor ?

    let spaces: ExportableSpace[] = [];
    gs.spaces.forEach((s) => {
        spaces.push(new ExportableSpace(s.id, s.description, s.capacity, s.coordinates, s.geoCoordinates, s.latitude, s.longitude, s.neighbors));
    });
    // add special Space 
    spaces.push(new ExportableSpace(0, "outside", -1, [-1000, -1000, 0], [0, 0, 1], 0, 0, [0]));


    let metasensors: ExportableMetasensor[] = [];
    metasensors.push(new ExportableMetasensor(1, "Bluetooth Beacon Sensor"));
    metasensors.push(new ExportableMetasensor(2, "Mioty Sensor"));


    // Step 1
    let metaevents: MetaEvent[] = [];
    for (let i = 0; i < gs.smartEvents.length; i++) {
        const smartEvent = gs.smartEvents[i];
        let smartEventSpaceIds = smartEvent.spaceIds.split(",").map(Number);
        let metaevent = new MetaEvent(
            smartEvent.id,
            smartEvent.description,
            1,
            [new MetaEventSpace(smartEventSpaceIds, smartEventSpaceIds.length)],
            [new TimeProfile(smartEvent.startDate, smartEvent.endDate, smartEvent.startTime, smartEvent.endTime, smartEvent.requiredAttendance, 1)],
            [new MetaEventCapacity(1, 1, 0, 1000, 0)]);
        metaevents.push(metaevent);
    }


    let metapersonTimeProfile = new TimeProfile("2021-01-01", "2021-01-03", "00:00:00", "23:59:59", "23:59:00");
    let metaPersonEventAffinities: MetaEventAffinity[] = [];
    for (let i = 0; i < metaevents.length; i++) {
        const metaevent = metaevents[i];
        metaPersonEventAffinities.push(new MetaEventAffinity(metaevent.id, 1));
    }
    let metapeople: MetaPerson[] = [];
    metapeople.push(new MetaPerson(
        1, "cow default", 1, [metapersonTimeProfile], metaPersonEventAffinities
    ));


    // Step 2
    let people: Person[] = [];
    for (let i = 1; i <= 8; i++) {
        let person = new Person(i, 1, "Cow " + i, 0);
        people.push(person);
    }

    let expevents: ExportableEvent[] = [];
    for (let i = 0; i < metaevents.length; i++) {
        const metaevent = metaevents[i];
        let expevent = new ExportableEvent(
            metaevent.id,
            metaevent.id,
            metaevent.description,
            0,
            metaevent.spaces[0]["space-ids"],
            [new ExportableEventCapacityEntry(1, [0, 1000])]
        );
        expevents.push(expevent);
    }
    // add special Event:  A special event with id=0 denoting the "leisure" event should be defined.
    // The leisure event serves as a default event that a person will attend if they are unable to attend any other event.
    expevents.push(new ExportableEvent(0, 1, "leisure", 0, [0], [new ExportableEventCapacityEntry(1, [0, 1000])]))



    let scenarioLearningConfig = new ExportableLearningConfig(
        gs.scenarioLearning_startDate,
        gs.scenarioLearning_endDate,
        gs.scenarioLearning_unit,
        gs.scenarioLearning_validity,
        gs.scenarioLearning_smoothing,
        gs.scenarioLearning_window,
        gs.scenarioLearning_timeThreshold,
        gs.scenarioLearning_occThreshold
    ).ToString();

    let scenarioGenerationCongig = new ExportableGenerationConfig(
        gs.scenarioGeneration_numberOfCows,
        "all", // TODO //none, diff, all
        gs.scenarioGeneration_numberOfEvents,
        "all", // TODO
        gs.scenarioLearning_startDate,
        gs.scenarioLearning_endDate
    ).ToString();


    let config = new ExportableConfig(sensors, spaces, metasensors, metapeople, metaevents, expevents, people, scenarioLearningConfig, scenarioGenerationCongig);

    // return JSON.stringify(config, null, 2);
    let result = `
    '${JSON.stringify(config.sensors,null,2)}',
    '${JSON.stringify(config.spaces,null,2)}',
    '${JSON.stringify(config.metasensors,null,2)}',
    '${JSON.stringify(config.metapeople,null,2)}',
    '${JSON.stringify(config.metaevents,null,2)}',
    '${JSON.stringify(config.events,null,2)}',
    '${JSON.stringify(config.people,null,2)}',
    '${config.learn_conf}',
    '${config.gen_conf}'
    `
    return result;
}


