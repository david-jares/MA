const consoleOutput = document.getElementById('consoleOutput');
function writeToCOnsoleOutput(content){
    consoleOutput.value += content ;
    consoleOutput.scrollTop = consoleOutput.scrollHeight;

}
function clearConsoleOutput(){
    consoleOutput.value = 'cattle_id, timestamp, latitude, longitude\n';
    console.log('cleared console output');
    
}