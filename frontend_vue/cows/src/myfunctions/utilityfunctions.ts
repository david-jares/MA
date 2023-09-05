const consoleOutput: HTMLTextAreaElement = document.getElementById('consoleOutput') as HTMLTextAreaElement;

function writeToConsoleOutput(content: string): void {
    consoleOutput.value += content;
    consoleOutput.scrollTop = consoleOutput.scrollHeight;
}

function clearConsoleOutput(): void {
    consoleOutput.value = 'cattle_id, timestamp, latitude, longitude\n';
    console.log('cleared console output');
}

interface Rectangle {
    id: number;
    x: number;
    y: number;
    width: number;
    height: number;
}

function subdivideCanvas(canvas: HTMLCanvasElement, width: number, height: number): Rectangle[] {
    const rectangles: Rectangle[] = [];
    const numCols: number = Math.floor(canvas.width / width);
    const numRows: number = Math.floor(canvas.height / height);
    let id: number = 1;
    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            const x: number = col * width;
            const y: number = row * height;
            rectangles.push({ id, x, y, width, height });
            id++;
        }
    }
    return rectangles;
}