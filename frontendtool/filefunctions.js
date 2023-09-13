function helloDave() {
    console.log("Hello Dave");
    console.log(document)
}
function readFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = event => resolve(event.target.result);
        reader.onerror = error => reject(error);
        reader.readAsText(file);
    });
}

function downloadCombinedCSV(content) {
    const blob = new Blob([content], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'combined.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

async function combineFiles() {
    const fileInput = document.getElementById('csvFiles');
    const files = Array.from(fileInput.files).sort((a, b) => a.name.localeCompare(b.name));

    if (files.length === 0) return;

    let combinedContent = '';
    for (let i = 0; i < files.length; i++) {
        const fileContent = await readFile(files[i]);
        const contentWithoutHeader = i === 0 ? fileContent : fileContent.split('\n').slice(1).join('\n');
        combinedContent += contentWithoutHeader;
        if (i < files.length - 1) {
            combinedContent += '\n';
        }
    }

    downloadCombinedCSV(combinedContent);
}

function saveAsCsv(data) {
    const csv = convertToCsv(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'data.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function convertToCsv(data) {
    const header = Object.keys(data[0]).join(',');
    const rows = data.map(obj => Object.values(obj).join(','));
    return `${header}\n${rows.join('\n')}`;
}

function selectFiles() {
    document.getElementById("csvFiles").click();
}

function exportSensorsAndSpaces() {
    const data = {
        sensors,
        spaces
    };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'SensorsAndSpaces.json';
    link.href = url;
    link.click();
}