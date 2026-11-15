import ToDo from "../model/to-do.js";
import Collection from "../model/collection.js";
import { startOfToday, addDays, differenceInCalendarDays } from "date-fns";
import { setParameter, getParameter } from '../model/parameter.js';

ToDo.loadAll();

/* const t1 = new ToDo('Tie knots');
t1.store();
const t2 = new ToDo('Change system');
t2.store(); 
const t3 = new ToDo('Bananas', '', null, 3, 'Shopping');
t3.store();
const t4 = new ToDo('Chicken', '', '2027-07-26', 3, 'Shopping');
t4.store(); 
 */

function toDoDiv() {
  const div = document.createElement('div');
  div.classList.add('to-do');

  // Select collection to display
  const sel = document.createElement('select');
  sel.id = 'collection-filter';
  let opt;
  for (let coll of Collection.all) {
    opt = document.createElement('option');
    opt.textContent = coll.name;

    if (coll.name === getParameter('collection-in-use')) {
      opt.selected = true;
    }

    sel.appendChild(opt);
  }
  sel.addEventListener('change', (e) => {
    const l = listToDos(e.target.value);
    setParameter('collection-in-use', e.target.value);
    div.replaceChild(l, div.childNodes[2]);
  });
  div.appendChild(sel);

  // Button to add a new to-do
  const addBtn = document.createElement('button');
  addBtn.textContent = '+';
  addBtn.addEventListener('click', (e) => {
    const newDiv = document.createElement('div');
    newDiv.id = 'new';
    const frm = toDoForm(sel.value);
    newDiv.appendChild(frm);
    disableContext(true);
    div.appendChild(newDiv);
  })
  div.appendChild(addBtn);

  const l = listToDos(sel.value);
  div.appendChild(l);

  return div;
}

function disableContext(boolSetting) {
  for (let b of document.querySelectorAll(
    '.detail-btn, input[type="radio"], div.to-do > select, div.to-do > button')) {
    b.disabled = boolSetting;
  }
}

function listToDos(coll) {
  const toDosDiv = document.createElement('div');
  let toDoArray;
  if (coll === 'Default') {
    // Default listing should include to-dos due before end of tomorrow from 
    //   non-Default collections
    toDoArray = ToDo.all.filter(td => {
      return td.collection === 'Default' ||
        td.done === false && td.dueDate != null
        && differenceInCalendarDays(addDays(startOfToday(), 2), td.dueDate) > 0;
    })
  } else {
    toDoArray = ToDo.all.filter(td => {
      return td.collection === coll;
    })
  }

  // Sort so that done items appear last
  toDoArray.sort((a, b) => { return a.done - b.done });

  let td;
  for (td of toDoArray) {
    toDosDiv.appendChild(td.display(coll));
  }

  return toDosDiv;
}

ToDo.prototype.display = function () {
  let oneTD = document.createElement('div');
  // Prefix the ids with letters to ensure they are valid
  oneTD.id = `ID${this.id}`;

  let el;

  el = document.createElement('input');
  el.setAttribute('type', 'radio');
  el.checked = this.done;
  el.addEventListener('change', (e) => {
    this.done = !this.done;
    this.store();
  });
  oneTD.appendChild(el);

  el = document.createElement('p');
  el.textContent = this.title;
  oneTD.appendChild(el);

  el = document.createElement('p');
  let coll = this.collection;
  if (coll === 'Default') {
    coll = '';
  }
  let dd = this.dueDate;
  if (dd) {
    dd = 'due: ' + dd;
  } else {
    dd = ''
  }
  el.textContent = (coll + ' ' + dd).trim();
  oneTD.appendChild(el);

  el = document.createElement('button');
  el.classList.add('detail-btn');
  el.textContent = '...';
  el.addEventListener('click', (e) => {
    let frm = toDoForm('', this);
    disableContext(true);
    oneTD.appendChild(frm);
  })
  oneTD.appendChild(el);

  return oneTD;
};

function toDoForm(listColl, td = null) {
  // (A null td object indicates New form is required)

  let newTD = false;
  if (!td) {
    newTD = true;
  }

  let frm = document.createElement('form');
  frm.classList.add('active');

  // Add form elements

  frm.appendChild(formField(td, 'title', 'text'));
  frm.appendChild(formField(td, 'description', 'textarea'));
  frm.appendChild(formField(td, 'dueDate', 'date'));
  frm.appendChild(formField(td, 'priority', 'number'));
  frm.appendChild(formField(td, 'collection', 'select', listColl));
  frm.appendChild(formField(td, 'notes', 'textarea'));
  frm.appendChild(formField(td, 'checklist', 'text'));
  frm.appendChild(formField(td, 'done', 'checkbox'));

  const btnDiv = document.createElement('div');
  btnDiv.classList.add('form-buttons');

  // Save button
  let fe = document.createElement('button');
  fe.classList.add('save');
  fe.setAttribute('type', 'submit');
  fe.setAttribute('action', '#');
  fe.textContent = 'Save';
  fe.addEventListener('click', (e) => {

    if (!frm.reportValidity()) {
      return;
    }
    if (newTD) {
      const enteredTitle = document.querySelector(`div#new input[name="title"]`).value;
      td = new ToDo(enteredTitle);
      // Replace parent div id of 'new' with 'ID' + the new object's id,
      //  as for pre-existing to-do objects.
      frm.parentElement.id = `ID${td.id}`;
    } else {
      td.title = document.querySelector(`div#ID${td.id} input[name="title"]`).value;
    }

    td.description = document.querySelector(`div#ID${td.id} textarea[name="description"]`).value;
    td.dueDate = document.querySelector(`div#ID${td.id} input[name="dueDate"]`).value;
    td.priority = document.querySelector(`div#ID${td.id} input[name="priority"]`).value;
    td.collection = document.querySelector(`div#ID${td.id} select[name="collection"]`).value;
    td.notes = document.querySelector(`div#ID${td.id} textarea[name="notes"]`).value;
    td.checklist = document.querySelector(`div#ID${td.id} input[name="checklist"]`).value;
    td.done = document.querySelector(`div#ID${td.id} input[name="done"]`).checked;

    td.store();

    frm.classList.remove('active');
    disableContext(false);
    // Sync outer radio button for pre-existing to-dos by oneTD div's aligned id
    if (!newTD) {
      document.querySelector(`div#ID${td.id} > input[type="radio"]`).checked = td.done;
    }
  });
  btnDiv.appendChild(fe);

  // Cancel button
  fe = document.createElement('button');
  fe.classList.add('cancel');
  fe.setAttribute('type', 'button');
  fe.setAttribute('action', '');
  fe.textContent = 'Cancel';
  fe.addEventListener('click', (e) => {
    frm.classList.remove('active');
    disableContext(false);
    const newDiv = document.querySelector('div#new');
    if (newDiv) {
      newDiv.remove();
    }
    e.preventDefault();
  });
  btnDiv.appendChild(fe);

  // Delete button
  if (!newTD) {
    fe = document.createElement('button');
    fe.classList.add('delete');
    fe.setAttribute('type', 'button');
    fe.setAttribute('action', '');
    fe.textContent = 'Delete';
    fe.addEventListener('click', (e) => {

      td.destroy();

      frm.classList.remove('active');
      disableContext(false);

      frm.parentElement.remove();
      e.preventDefault();
    });
    btnDiv.appendChild(fe);
  }

  frm.appendChild(btnDiv);

  return frm;
}

function formField(td, fieldName, fieldType, listColl = '') {
  let div = document.createElement('div');
  div.classList.add('form-field');

  let lbl = document.createElement('label');
  lbl.setAttribute('for', fieldName);
  lbl.textContent = `${fieldName[0].toUpperCase()}${fieldName.slice(1)}: `;
  div.appendChild(lbl);

  let fe;
  switch (fieldType) {
    case 'select':
      fe = document.createElement('select');
      fe.setAttribute('name', fieldName);
      fe.id = fieldName;
      let opt;
      for (let coll of Collection.all) {
        opt = document.createElement('option');
        opt.textContent = coll.name;
        if (td) {
          if (coll.name === td[fieldName]) {
            opt.selected = true;
          }
        } else { // New to-do
          if (coll.name === listColl) {
            opt.selected = true;
          }
        }
        fe.appendChild(opt);
      }
      break;
    case 'textarea':
      fe = document.createElement('textarea');
      fe.setAttribute('name', fieldName);
      fe.id = fieldName;
      if (td) {
        fe.setAttribute('value', td[fieldName]);
      }
      break;
    default:  //input field
      fe = document.createElement('input');
      fe.setAttribute('type', fieldType);
      fe.setAttribute('name', fieldName);
      fe.id = fieldName;
      if (td) {
        if (fieldType === 'checkbox') {
          fe.checked = td[fieldName];
        } else {
          fe.setAttribute('value', td[fieldName]);
        }
      }
  }

  // Set validation
  switch (fieldName) {
    case 'title':
    case 'priority':
    case 'collection':
      fe.required = true;
    case 'priority':
      fe.min = '1';
      fe.max = '5';
  }

  // Set default values
  if (!td) {
    switch (fieldName) {
      case 'priority':
        fe.value = 3;
        break;
      case 'done':
        fe.checked = false;
        break;
    }
  }


  div.appendChild(fe);

  return div;
}

export default toDoDiv;