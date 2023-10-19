import { useGlobalsStore } from "@/stores/globals";
import { getConfigurationJSONString } from "./utilityfunctions";

export function helloDave(): void {
  console.log("Hello Dave");
  console.log(document);
}

export function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = event => {
      if (event.target) {
        resolve(event.target.result as string);
      } else {
        reject(new Error('Event target is null'));
      }
    };
    reader.onerror = error => reject(error);
    reader.readAsText(file);
  });
}

export function downloadCombinedCSV(content: string): void {
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

export async function combineFiles(): Promise<void> {
  const fileInput = document.getElementById('csvFiles') as HTMLInputElement;
  const files = Array.from(fileInput.files!).sort((a, b) => a.name.localeCompare(b.name));

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
}
export function saveAsCsv(data: object[]): void {
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

export function convertToCsv(data: object[]): string {
  const header = Object.keys(data[0]).join(',');
  const rows = data.map(obj => Object.values(obj).join(','));
  return `${header}\n${rows.join('\n')}`;
}

export function selectFiles(): void {
  (document.getElementById("csvFiles") as HTMLInputElement).click();
}

export function exportSensorsAndSpaces(): void {
  // const gs = useGlobalsStore();

  // const data = {
  //   sensors: gs.sensors,
  //   spaces: gs.spaces
  // };

  const dataJson = getConfigurationJSONString();

  // const json = JSON.stringify(data, null, 2);
  // const blob = new Blob([json], { type: 'application/json' });
  const blob = new Blob([dataJson], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = 'SensorsAndSpaces.json';
  link.href = url;
  link.click();
}