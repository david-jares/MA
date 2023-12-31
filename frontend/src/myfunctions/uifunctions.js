// function createSlider(inputId, sliderId, min, max, step, onChange) {
//   var slider = document.getElementById(sliderId);
//   var input = document.getElementById(inputId);
//   input.value = slider.value;
//   slider.oninput = function () {
//     input.value = this.value;
//     onChange();
//   };
//   input.oninput = function () {
//     if (this.value < min) {
//       this.value = min;
//     } else if (this.value > max) {
//       this.value = max;
//     }
//     slider.value = this.value;
//     onChange();
//   };
// }

// function toggleHideElement(elementId) {
//   const event = document.getElementById(elementId);
//   event.classList.toggle('hidden');
// }

// function removeElement(elementId) {
//   const element = document.getElementById(elementId);
//   element.remove();
// }


// function removeEventElement(elementId) {
//   const element = document.getElementById(elementId);
//   const SMARTEventId = document.getElementById().value;
//   element.remove();
// }


// function updateEventModel(eventElemIDText) {
//   const event = document.getElementById(eventElemIDText);
//   const description = document.getElementById(eventElemIDText + 'description').value;
//   const id = document.getElementById(eventElemIDText + 'id').value;
//   const metaeventId = document.getElementById(eventElemIDText + 'metaeventId').value;
//   const profileIndex = document.getElementById(eventElemIDText + 'profileIndex').value;
//   const spaceIds = document.getElementById(eventElemIDText + 'spaceIds').value;
//   const capacityMetaPersonId = document.getElementById(eventElemIDText + 'capacityMetaPersonId').value;
//   const capacityRangeMin = document.getElementById(eventElemIDText + 'capacityRangeMin').value;
//   const capacityRangeMax = document.getElementById(eventElemIDText + 'capacityRangeMax').value;
//   const startDate = document.getElementById(eventElemIDText + 'startDate').value;
//   const endDate = document.getElementById(eventElemIDText + 'endDate').value;
//   const period = document.getElementById(eventElemIDText + 'period').value;
//   const periodInterval = document.getElementById(eventElemIDText + 'periodInterval').value;
//   const startTime = document.getElementById(eventElemIDText + 'startTime').value;
//   const endTime = document.getElementById(eventElemIDText + 'endTime').value;
//   const requiredAttendance = document.getElementById(eventElemIDText + 'requiredAttendance').value;
//   const color = document.getElementById(eventElemIDText + 'color').value;

//   let SMARTEvent = {
//     description: description,
//     id: id,
//     metaeventId: metaeventId,
//     profileIndex: profileIndex,
//     spaceIds: spaceIds,
//     capacityMetaPersonId: capacityMetaPersonId,
//     capacityRangeMin: capacityRangeMin,
//     capacityRangeMax: capacityRangeMax,
//     startDate: startDate,
//     endDate: endDate,
//     period: period,
//     periodInterval: periodInterval,
//     startTime: startTime,
//     endTime: endTime,
//     requiredAttendance: requiredAttendance,
//     color: color
//   };

//   const oldEventIndex = smartEvents.findIndex(e => e.id === id);
//   if (oldEventIndex !== -1) {
//     smartEvents.splice(oldEventIndex, 1, SMARTEvent);
//   } else {
//     smartEvents.push(SMARTEvent)
//   }
// }

// function updateEventUI(SMARTEvent) {
//   const event = document.getElementById(SMARTEvent.id);
//   if (!event) {
//     generateEvent(SMARTEvent.id);
//   }

//   document.getElementById(eventId + 'description').value = SMARTEvent.description;
//   document.getElementById(eventId + 'id').value = SMARTEvent.id;
//   document.getElementById(eventId + 'metaeventId').value = SMARTEvent.metaeventId;
//   document.getElementById(eventId + 'profileIndex').value = SMARTEvent.profileIndex;
//   document.getElementById(eventId + 'spaceIds').value = SMARTEvent.spaceIds;
//   document.getElementById(eventId + 'capacityMetaPersonId').value = SMARTEvent.capacityMetaPersonId;
//   document.getElementById(eventId + 'capacityRangeMin').value = SMARTEvent.capacityRangeMin;
//   document.getElementById(eventId + 'capacityRangeMax').value = SMARTEvent.capacityRangeMax;
//   document.getElementById(eventId + 'startDate').value = SMARTEvent.startDate;
//   document.getElementById(eventId + 'endDate').value = SMARTEvent.endDate;
//   document.getElementById(eventId + 'period').value = SMARTEvent.period;
//   document.getElementById(eventId + 'periodInterval').value = SMARTEvent.periodInterval;
//   document.getElementById(eventId + 'startTime').value = SMARTEvent.startTime;
//   document.getElementById(eventId + 'endTime').value = SMARTEvent.endTime;
//   document.getElementById(eventId + 'requiredAttendance').value = SMARTEvent.requiredAttendance;
//   document.getElementById(eventId + 'color').value = SMARTEvent.color;

// }

// function generateEvent(id = -1) {
//   let eventNumber = id;
//   if (eventNumber === -1) {
//     eventNumber = nextEventID++;
//   }
//   let eventElemIDText = 'event_' + eventNumber;
//   // create the outer div
//   const eventsDiv = document.createElement('div');
//   eventsDiv.id = 'events';
//   eventsDiv.style.display = 'flex';
//   eventsDiv.style.flexDirection = 'column';



//   // create the event div
//   const eventDiv = document.createElement('div');
//   eventDiv.id = eventElemIDText;

//   // create seperator
//   const hr = document.createElement('hr');
//   hr.style.border = '1px solid black';
//   eventDiv.appendChild(hr);
//   // create the fold button
//   const foldButton = document.createElement('button');
//   foldButton.textContent = 'Fold';
//   foldButton.onclick = function () {
//     toggleHideElement(eventElemIDText + '_details');
//   };

//   // create the delete button
//   const deleteButton = document.createElement('button');
//   deleteButton.textContent = 'Delete';
//   deleteButton.onclick = function () {
//     removeElement(eventDiv.id);
//   };


//   // create the input rows
//   const inputRows = document.createElement('div');
//   inputRows.id = eventElemIDText + '_details';

//   // create the description input row
//   const descriptionRow = document.createElement('div');
//   descriptionRow.className = 'inputrow';

//   const descriptionLabel = document.createElement('label');
//   descriptionLabel.className = 'inputrowlabel-m';
//   descriptionLabel.textContent = 'description:';

//   const descriptionInput = document.createElement('input');
//   descriptionInput.id = eventElemIDText + "description";
//   descriptionInput.className = 'inputrow-input-m';
//   descriptionInput.type = 'text';
//   descriptionInput.value = 'human readable description';
//   descriptionInput.oninput = updateUserData;

//   descriptionRow.appendChild(descriptionLabel);
//   descriptionRow.appendChild(descriptionInput);

//   inputRows.appendChild(descriptionRow);

//   // create the id input row
//   const idRow = document.createElement('div');
//   idRow.className = 'inputrow';

//   const idLabel = document.createElement('label');
//   idLabel.className = 'inputrowlabel-m';
//   idLabel.textContent = 'id:';

//   const idInput = document.createElement('input');
//   idInput.id = eventElemIDText + "id";
//   idInput.className = 'inputrow-input-m';
//   idInput.type = 'number';
//   idInput.value = eventNumber;
//   idInput.oninput = updateUserData;

//   idRow.appendChild(idLabel);
//   idRow.appendChild(idInput);

//   inputRows.appendChild(idRow);

//   // create the metaevent-id input row
//   const metaeventIdRow = document.createElement('div');
//   metaeventIdRow.className = 'inputrow';

//   const metaeventIdLabel = document.createElement('label');
//   metaeventIdLabel.className = 'inputrowlabel-m';
//   metaeventIdLabel.textContent = 'metaevent-id:';

//   const metaeventIdInput = document.createElement('input');
//   metaeventIdInput.id = eventElemIDText + "metaeventId";

//   metaeventIdInput.className = 'inputrow-input-m';
//   metaeventIdInput.type = 'number';
//   metaeventIdInput.value = 1;
//   metaeventIdInput.oninput = updateUserData;

//   metaeventIdRow.appendChild(metaeventIdLabel);
//   metaeventIdRow.appendChild(metaeventIdInput);

//   inputRows.appendChild(metaeventIdRow);

//   // create the profile index input row
//   const profileIndexRow = document.createElement('div');
//   profileIndexRow.className = 'inputrow';

//   const profileIndexLabel = document.createElement('label');
//   profileIndexLabel.className = 'inputrowlabel-m';
//   profileIndexLabel.textContent = 'profile index:';

//   const profileIndexInput = document.createElement('input');
//   profileIndexInput.id = eventElemIDText + "profileIndex";
//   profileIndexInput.className = 'inputrow-input-m';
//   profileIndexInput.type = 'number';
//   profileIndexInput.value = 1;
//   profileIndexInput.oninput = updateUserData;

//   profileIndexRow.appendChild(profileIndexLabel);
//   profileIndexRow.appendChild(profileIndexInput);

//   inputRows.appendChild(profileIndexRow);

//   // create the space ids input row
//   const spaceIdsRow = document.createElement('div');
//   spaceIdsRow.className = 'inputrow';

//   const spaceIdsLabel = document.createElement('label');
//   spaceIdsLabel.className = 'inputrowlabel-m';
//   spaceIdsLabel.textContent = 'space ids (commaseperated):';

//   const spaceIdsInput = document.createElement('input');
//   spaceIdsInput.id = eventElemIDText + "spaceIds";

//   spaceIdsInput.className = 'inputrow-input-m';
//   spaceIdsInput.type = 'text';
//   spaceIdsInput.value = '1,2,3';
//   spaceIdsInput.oninput = updateUserData;

//   spaceIdsRow.appendChild(spaceIdsLabel);
//   spaceIdsRow.appendChild(spaceIdsInput);

//   inputRows.appendChild(spaceIdsRow);

//   // create the capacity MetaPerson id input row
//   const capacityMetaPersonIdRow = document.createElement('div');
//   capacityMetaPersonIdRow.className = 'inputrow';

//   const capacityMetaPersonIdLabel = document.createElement('label');
//   capacityMetaPersonIdLabel.className = 'inputrowlabel-m';
//   capacityMetaPersonIdLabel.textContent = 'capacity MetaPerson id:';

//   const capacityMetaPersonIdInput = document.createElement('input');
//   capacityMetaPersonIdInput.id = eventElemIDText + "capacityMetaPersonId";

//   capacityMetaPersonIdInput.className = 'inputrow-input-m';
//   capacityMetaPersonIdInput.type = 'number';
//   capacityMetaPersonIdInput.value = 1;
//   capacityMetaPersonIdInput.oninput = updateUserData;

//   capacityMetaPersonIdRow.appendChild(capacityMetaPersonIdLabel);
//   capacityMetaPersonIdRow.appendChild(capacityMetaPersonIdInput);

//   inputRows.appendChild(capacityMetaPersonIdRow);

//   // create the capacity range min input row
//   const capacityRangeMinRow = document.createElement('div');
//   capacityRangeMinRow.className = 'inputrow';

//   const capacityRangeMinLabel = document.createElement('label');
//   capacityRangeMinLabel.className = 'inputrowlabel-m';
//   capacityRangeMinLabel.textContent = 'capacity range min:';

//   const capacityRangeMinInput = document.createElement('input');
//   capacityRangeMinInput.id = eventElemIDText + "capacityRangeMin";

//   capacityRangeMinInput.className = 'inputrow-input-m';
//   capacityRangeMinInput.type = 'number';
//   capacityRangeMinInput.value = 0;
//   capacityRangeMinInput.oninput = updateUserData;

//   capacityRangeMinRow.appendChild(capacityRangeMinLabel);
//   capacityRangeMinRow.appendChild(capacityRangeMinInput);

//   inputRows.appendChild(capacityRangeMinRow);

//   // create the capacity range max input row
//   const capacityRangeMaxRow = document.createElement('div');
//   capacityRangeMaxRow.className = 'inputrow';

//   const capacityRangeMaxLabel = document.createElement('label');
//   capacityRangeMaxLabel.className = 'inputrowlabel-m';
//   capacityRangeMaxLabel.textContent = 'capacity range max:';

//   const capacityRangeMaxInput = document.createElement('input');
//   capacityRangeMaxInput.id = eventElemIDText + "capacityRangeMax";

//   capacityRangeMaxInput.className = 'inputrow-input-m';
//   capacityRangeMaxInput.type = 'number';
//   capacityRangeMaxInput.value = 1000;
//   capacityRangeMaxInput.oninput = updateUserData;

//   capacityRangeMaxRow.appendChild(capacityRangeMaxLabel);
//   capacityRangeMaxRow.appendChild(capacityRangeMaxInput);

//   inputRows.appendChild(capacityRangeMaxRow);

//   // create the start date input row
//   const startDateRow = document.createElement('div');
//   startDateRow.className = 'inputrow';

//   const startDateLabel = document.createElement('label');
//   startDateLabel.className = 'inputrowlabel-m';
//   startDateLabel.textContent = 'start date:';

//   const startDateInput = document.createElement('input');
//   startDateInput.id = eventElemIDText + "startDate";

//   startDateInput.className = 'inputrow-input-m';
//   startDateInput.type = 'date';
//   startDateInput.value = '2000-01-01';
//   startDateInput.oninput = updateUserData;

//   startDateRow.appendChild(startDateLabel);
//   startDateRow.appendChild(startDateInput);

//   inputRows.appendChild(startDateRow);

//   // create the end date input row
//   const endDateRow = document.createElement('div');
//   endDateRow.className = 'inputrow';

//   const endDateLabel = document.createElement('label');
//   endDateLabel.className = 'inputrowlabel-m';
//   endDateLabel.textContent = 'end date:';

//   const endDateInput = document.createElement('input');
//   endDateInput.id = eventElemIDText + "endDate";

//   endDateInput.className = 'inputrow-input-m';
//   endDateInput.type = 'date';
//   endDateInput.value = '2999-01-01';
//   endDateInput.oninput = updateUserData;

//   endDateRow.appendChild(endDateLabel);
//   endDateRow.appendChild(endDateInput);

//   inputRows.appendChild(endDateRow);

//   // create the period input row
//   const periodRow = document.createElement('div');
//   periodRow.className = 'inputrow';

//   const periodLabel = document.createElement('label');
//   periodLabel.className = 'inputrowlabel-m';
//   periodLabel.textContent = 'period:';

//   const periodInput = document.createElement('input');
//   periodInput.id = eventElemIDText + "period";
//   periodInput.className = 'inputrow-input-m';
//   periodInput.type = 'text';
//   periodInput.value = 'day';
//   periodInput.oninput = updateUserData;

//   periodRow.appendChild(periodLabel);
//   periodRow.appendChild(periodInput);

//   inputRows.appendChild(periodRow);

//   // create the period interval input row
//   const periodIntervalRow = document.createElement('div');
//   periodIntervalRow.className = 'inputrow';

//   const periodIntervalLabel = document.createElement('label');
//   periodIntervalLabel.className = 'inputrowlabel-m';
//   periodIntervalLabel.textContent = 'period interval:';

//   const periodIntervalInput = document.createElement('input');
//   periodIntervalInput.id = eventElemIDText + "periodInterval";
//   periodIntervalInput.className = 'inputrow-input-m';
//   periodIntervalInput.type = 'number';
//   periodIntervalInput.value = 1;
//   periodIntervalInput.oninput = updateUserData;

//   periodIntervalRow.appendChild(periodIntervalLabel);
//   periodIntervalRow.appendChild(periodIntervalInput);

//   inputRows.appendChild(periodIntervalRow);

//   // create the start-time input row
//   const startTimeRow = document.createElement('div');
//   startTimeRow.className = 'inputrow';

//   const startTimeLabel = document.createElement('label');
//   startTimeLabel.className = 'inputrowlabel-m';
//   startTimeLabel.textContent = 'start-time:';

//   const startTimeInput = document.createElement('input');
//   startTimeInput.id = eventElemIDText + "startTime";
//   startTimeInput.className = 'inputrow-input-m';
//   startTimeInput.type = 'time';
//   startTimeInput.value = '00:00';
//   startTimeInput.oninput = updateUserData;

//   startTimeRow.appendChild(startTimeLabel);
//   startTimeRow.appendChild(startTimeInput);

//   inputRows.appendChild(startTimeRow);

//   // create the end-time input row
//   const endTimeRow = document.createElement('div');
//   endTimeRow.className = 'inputrow';

//   const endTimeLabel = document.createElement('label');
//   endTimeLabel.className = 'inputrowlabel-m';
//   endTimeLabel.textContent = 'end-time:';

//   const endTimeInput = document.createElement('input');
//   endTimeInput.id = eventElemIDText + "endTime";
//   endTimeInput.className = 'inputrow-input-m';
//   endTimeInput.type = 'time';
//   endTimeInput.value = '23:59';
//   endTimeInput.oninput = updateUserData;

//   endTimeRow.appendChild(endTimeLabel);
//   endTimeRow.appendChild(endTimeInput);

//   inputRows.appendChild(endTimeRow);

//   // create the required-attendance input row
//   const requiredAttendanceRow = document.createElement('div');
//   requiredAttendanceRow.className = 'inputrow';

//   const requiredAttendanceLabel = document.createElement('label');
//   requiredAttendanceLabel.className = 'inputrowlabel-m';
//   requiredAttendanceLabel.textContent = 'required-attendance:';

//   const requiredAttendanceInput = document.createElement('input');
//   requiredAttendanceInput.id = eventElemIDText + "requiredAttendance";

//   requiredAttendanceInput.className = 'inputrow-input-m';
//   requiredAttendanceInput.type = 'text';
//   requiredAttendanceInput.value = '02:00';
//   requiredAttendanceInput.oninput = updateUserData;

//   requiredAttendanceRow.appendChild(requiredAttendanceLabel);
//   requiredAttendanceRow.appendChild(requiredAttendanceInput);

//   inputRows.appendChild(requiredAttendanceRow);

//   // create the color input row
//   const colorRow = document.createElement('div');
//   colorRow.className = 'inputrow';

//   const colorLabel = document.createElement('label');
//   colorLabel.className = 'inputrowlabel-m';
//   colorLabel.textContent = 'color:';

//   const colorInput = document.createElement('input');
//   colorInput.id = eventElemIDText + "color";

//   colorInput.className = 'inputrow-input-m';
//   colorInput.type = 'color';
//   colorInput.value = '#0000ff';
//   colorInput.oninput = updateUserData;

//   colorRow.appendChild(colorLabel);
//   colorRow.appendChild(colorInput);

//   inputRows.appendChild(colorRow);

//   // append the elements to the DOM
//   const inputRowButtons = document.createElement('div');
//   inputRowButtons.className = 'inputrow';

//   const foldButtonDiv = document.createElement('div');
//   foldButtonDiv.appendChild(foldButton);

//   const deleteButtonDiv = document.createElement('div');
//   deleteButtonDiv.appendChild(deleteButton);

//   inputRowButtons.appendChild(foldButtonDiv);
//   inputRowButtons.appendChild(deleteButtonDiv);

//   eventDiv.appendChild(inputRowButtons);
//   eventDiv.appendChild(inputRows);

//   eventsDiv.appendChild(eventDiv);

//   document.getElementById('eventsList').appendChild(eventsDiv);
//   updateEventModel(eventElemIDText);
// }