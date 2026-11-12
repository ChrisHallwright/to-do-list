import ToDo from "../model/to-do.js";
import Collection from "../model/collection.js";

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

  const addBtn = document.createElement('button');
  addBtn.textContent = '+';
  addBtn.addEventListener('click', (e) => {
    const newDiv = document.createElement('div');
    newDiv.id = 'new';
    const frm = toDoForm();
    newDiv.appendChild(frm);
    for (let b of document.querySelectorAll('.detail-btn, input[type="radio"]')) {
      b.disabled = true;
    }
    div.appendChild(newDiv);
  })
  div.appendChild(addBtn);

  let td;
  for (td of ToDo.all) {
    div.appendChild(td.display());
  }

  return div;
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
    let frm = toDoForm(this);
    for (let b of document.querySelectorAll('.detail-btn, input[type="radio"]')) {
      b.disabled = true;
    }
    oneTD.appendChild(frm);
  })
  oneTD.appendChild(el);

  return oneTD;
};

function toDoForm(td = null) {
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
  frm.appendChild(formField(td, 'collection', 'select'));
  frm.appendChild(formField(td, 'notes', 'textarea'));
  frm.appendChild(formField(td, 'checklist', 'text'));
  frm.appendChild(formField(td, 'done', 'checkbox'));

  // Save button
  let fe = document.createElement('button');
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
    for (let b of document.querySelectorAll('.detail-btn, input[type="radio"]')) {
      b.disabled = false;
    }
    // Sync outer radio button for pre-existing to-dos by oneTD div's aligned id
    if (!newTD) {
      document.querySelector(`div#ID${td.id} > input[type="radio"]`).checked = td.done;
    }
  });
  frm.appendChild(fe);

  // Cancel button
  fe = document.createElement('button');
  fe.setAttribute('type', 'button');
  fe.setAttribute('action', '');
  fe.textContent = 'Cancel';
  fe.addEventListener('click', (e) => {
    frm.classList.remove('active');
    for (let b of document.querySelectorAll('.detail-btn, input[type="radio"]')) {
      b.disabled = false;
    }
    e.preventDefault();
  });
  frm.appendChild(fe);

  // Delete button
  if (!newTD) {
    fe = document.createElement('button');
    fe.setAttribute('type', 'button');
    fe.setAttribute('action', '');
    fe.textContent = 'Delete';
    fe.addEventListener('click', (e) => {

      td.destroy();

      frm.classList.remove('active');
      for (let b of document.querySelectorAll('.detail-btn, input[type="radio"]')) {
        b.disabled = false;
      }

      frm.parentElement.remove();
      e.preventDefault();
    });
    frm.appendChild(fe);
  }

  return frm;
}

function formField(td, fieldName, fieldType) {
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
        } else {
          if (coll.name === 'Default') {
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
      case 'collection':
        fe.value = 'Default';
        break;
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