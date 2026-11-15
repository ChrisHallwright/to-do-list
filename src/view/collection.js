import Collection from "../model/collection.js";
import ToDo from "../model/to-do.js";
import { setParameter, getParameter } from '../model/parameter.js';


Collection.loadAll();
if (Collection.all.length == 0) {
  const c1 = new Collection('Default');
  c1.store();
  setParameter('collection-in-use', 'Default');
}

/*
const c2 = new Collection('Shopping');
c2.store(); */

function collectionDiv() {
  const div = document.createElement('div');
  div.classList.add('collection');

  // Button to add a new collection
  const addBtn = document.createElement('button');
  addBtn.textContent = '+';
  addBtn.addEventListener('click', (e) => {
    const newDiv = document.createElement('div');
    newDiv.id = 'new';
    const frm = collectionForm();
    newDiv.appendChild(frm);
    div.appendChild(newDiv);
  })
  div.appendChild(addBtn);

  const l = listCollections();
  div.appendChild(l);

  return div;
}

function listCollections() {
  const collectionsDiv = document.createElement('div');

  let c;
  for (c of Collection.all) {
    collectionsDiv.appendChild(c.display());
  }

  return collectionsDiv;
}

Collection.prototype.display = function () {
  let oneColl = document.createElement('div');
  oneColl.id = `ID${this.name}`;

  let el;

  el = document.createElement('p');
  el.textContent = this.name;
  oneColl.appendChild(el);

  el = document.createElement('button');
  el.classList.add('detail-btn');
  // Default collection has special meaning - prevent modification
  if (this.name === 'Default') {
    el.disabled = true;
  }
  el.textContent = '...';
  el.addEventListener('click', (e) => {
    let frm = collectionForm(this);
    oneColl.appendChild(frm);
  })
  oneColl.appendChild(el);

  return oneColl;
};

function collectionForm(coll = null) {
  // (A null collection object indicates New form is required)

  let newColl = false;
  if (!coll) {
    newColl = true;
  }

  let frm = document.createElement('form');
  frm.classList.add('active');

  // Add form elements

  frm.appendChild(formField(coll, 'name', 'text'));

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
    if (newColl) {
      const enteredName = document.querySelector(`div#new input[name="name"]`).value;
      coll = new Collection(enteredName);
    } else {
      coll.name = document.querySelector(`div#ID${coll.name} input[name="name"]`).value;
    }

    coll.store();
    setParameter('collection-in-use', coll.name);

    frm.classList.remove('active');
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
    e.preventDefault();
  });
  btnDiv.appendChild(fe);

  // Delete button
  if (!newColl) {
    fe = document.createElement('button');
    fe.classList.add('delete');
    fe.setAttribute('type', 'button');
    fe.setAttribute('action', '');
    fe.textContent = 'Delete';
    fe.addEventListener('click', (e) => {
      ToDo.loadAll()
      const toDoArray = ToDo.all.filter(td => {
        return td.collection === coll.name;
      })
      const nToDos = toDoArray.length;
      if (nToDos > 0) {
        const stillToDoArray = toDoArray.filter(td => {
          return td.done === false;
        })
        const nStillToDo = stillToDoArray.length;
        let msg = `For collection "${coll.name}" you have ${nToDos} to-dos`;
        if (nStillToDo == 0) {
          msg += ' all of which are done.\nOk to delete them all?'
        } else {
          if (nStillToDo == nToDos) {
            msg += ' none of which have been done.'
          } else {
            msg += ` of which ${nStillToDo} are still to do.`
          }
          msg += '\nAre you SURE you wish to delete them all?'
        }
        if (!window.confirm(msg)) {
          return;
        }
        toDoArray.forEach((td) => {
          td.destroy();
        })
        setParameter('collection-in-use', 'Default');        
      }

      const rslt = coll.destroy();

      frm.classList.remove('active');

      if (rslt != 'error') {
        frm.parentElement.remove();
      }
      e.preventDefault();
    });
    btnDiv.appendChild(fe);
  }

  frm.appendChild(btnDiv);

  return frm;
}

function formField(coll, fieldName, fieldType) {
  let div = document.createElement('div');
  div.classList.add('form-field');

  let lbl = document.createElement('label');
  lbl.setAttribute('for', fieldName);
  lbl.textContent = `${fieldName[0].toUpperCase()}${fieldName.slice(1)}: `;
  div.appendChild(lbl);

  let fe;
  switch (fieldType) {
    case 'textarea':
      fe = document.createElement('textarea');
      fe.setAttribute('name', fieldName);
      fe.id = fieldName;
      if (coll) {
        fe.setAttribute('value', coll[fieldName]);
      }
      break;
    default:  //input field
      fe = document.createElement('input');
      fe.setAttribute('type', fieldType);
      fe.setAttribute('name', fieldName);
      fe.id = fieldName;
      if (coll) {
        if (fieldType === 'checkbox') {
          fe.checked = coll[fieldName];
        } else {
          fe.setAttribute('value', coll[fieldName]);
        }
      }
  }

  // Set validation
  switch (fieldName) {
    case 'name':
      fe.required = true;
  }

  div.appendChild(fe);

  return div;
}

export default collectionDiv;