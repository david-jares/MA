import type { Point } from "./tempfunctions";

export function writeToConsoleOutput(content: string): void {
    let consoleOutput: HTMLTextAreaElement = document.getElementById('consoleOutput') as HTMLTextAreaElement;
    consoleOutput.value += content;
    consoleOutput.scrollTop = consoleOutput.scrollHeight;
}

export function clearConsoleOutput(): void {
    let consoleOutput: HTMLTextAreaElement = document.getElementById('consoleOutput') as HTMLTextAreaElement;
    consoleOutput.value = 'cattle_id, timestamp, latitude, longitude\n';
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