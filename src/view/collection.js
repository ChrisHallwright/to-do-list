import Collection from "../model/collection.js";

Collection.loadAll();
if (Collection.all.length == 0) {
  const c1 = new Collection('Default');
  c1.store();
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
  // Prefix the ids with letters to ensure they are valid
  //oneColl.id = `ID${this.id}`;

  let el;

  el = document.createElement('p');
  el.textContent = this.name;
  oneColl.appendChild(el);

  el = document.createElement('button');
  el.classList.add('detail-btn');
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

  // Save button
  let fe = document.createElement('button');
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
      // Replace parent div id of 'new' with 'ID' + the new object's id,
      //  as for pre-existing to-do objects.
      //frm.parentElement.id = `ID${coll.id}`;
    } else {
//      coll.name = document.querySelector(`div#ID${coll.id} input[name="name"]`).value;
      coll.name = document.querySelector(`div#ID${coll.name} input[name="name"]`).value;
    }

    coll.store();

    frm.classList.remove('active');
  });
  frm.appendChild(fe);

  // Cancel button
  fe = document.createElement('button');
  fe.setAttribute('type', 'button');
  fe.setAttribute('action', '');
  fe.textContent = 'Cancel';
  fe.addEventListener('click', (e) => {
    frm.classList.remove('active');
    e.preventDefault();
  });
  frm.appendChild(fe);

  // Delete button
  if (!newColl) {
    fe = document.createElement('button');
    fe.setAttribute('type', 'button');
    fe.setAttribute('action', '');
    fe.textContent = 'Delete';
    fe.addEventListener('click', (e) => {

      coll.destroy();

      frm.classList.remove('active');

      frm.parentElement.remove();
      e.preventDefault();
    });
    frm.appendChild(fe);
  }

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