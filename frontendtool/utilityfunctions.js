const consoleOutput = document.getElementById('consoleOutput');
function writeToCOnsoleOutput(content){
    consoleOutput.value += content ;
    consoleOutput.scrollTop = consoleOutput.scrollHeight;

}
function clearConsoleOutput(){
    consoleOutput.value = 'cattle_id, timestamp, latitude, longitude\n';
    console.log('cleared console output');
    
}

function subdivideCanvas(canvas, width, height) {
    const rectangles = [];
    const numCols = Math.floor(canvas.width / width);
    const numRows = Math.floor(canvas.height / height);
    let id = 1;
    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            const x = col * width;
            const y = row * height;
            rectangles.push({ id, x, y, width, height });
            id++;
        }
    }
    return rectangles;
}