import ToDo from "../model/to-do.js";

ToDo.loadAll();

/* const t1 = new ToDo('Tie knots');
t1.store();
const t2 = new ToDo('Change system');
t2.store(); 
const t3 = new ToDo('Bananas', '', null, 3, 'Shopping');
t3.store();
const t4 = new ToDo('Chicken', '', '26/07/2027', 3, 'Shopping');
t4.store(); */

ToDo.prototype.display = function () {
  let oneTD = document.createElement('div');

  let el;

  el = document.createElement('input');
  el.setAttribute('type', 'checkbox');
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
  el.textContent = '...';
  el.addEventListener('click', (e) => {
    let frm = document.createElement('form');
    frm.classList.add('active');
    frm = toDoForm(e.target, frm, this);
    e.target.disabled = true;
    oneTD.appendChild(frm);
  })
  oneTD.appendChild(el);

  return oneTD;
};

function toDoDiv() {
  const div = document.createElement('div');
  div.classList.add('to-do');
  let td;
  for (td of ToDo.all) {
    div.appendChild(td.display());
  }

  return div;
}

function toDoForm(detailBtn, frm, td) {
  // Add form elements

  frm.appendChild(formField(td, 'title', 'text'));
  frm.appendChild(formField(td, 'description', 'textarea'));
  frm.appendChild(formField(td, 'dueDate', 'date'));
  frm.appendChild(formField(td, 'priority', 'number'));
  frm.appendChild(formField(td, 'collection', 'text'));
  frm.appendChild(formField(td, 'notes', 'textarea'));
  frm.appendChild(formField(td, 'checklist', 'text'));
  frm.appendChild(formField(td, 'done', 'checkbox'));

  let fe = document.createElement('button');
  fe.setAttribute('type', 'submit');
  fe.setAttribute('action', '');
  fe.textContent = 'Save';
  fe.addEventListener('click', (e) => {
    td.title = document.querySelector('input#title').value;
    td.description = document.querySelector('input#description').value;
    td.dueDate = document.querySelector('input#dueDate').value;
    td.priority = document.querySelector('input#priority').value;
    td.collection = document.querySelector('input#collection').value;
    td.notes = document.querySelector('input#notes').value;
    td.checklist = document.querySelector('input#checklist').value;
    td.done = document.querySelector('input#done').value;
    td.store();

    frm.classList.remove('active');
    detailBtn.disabled = false;
    e.preventDefault();
  });
  frm.appendChild(fe);

  fe = document.createElement('button');
  fe.setAttribute('type', 'button');
  fe.setAttribute('action', '');
  fe.textContent = 'Cancel';
  fe.addEventListener('click', (e) => {
    frm.classList.remove('active');
    detailBtn.disabled = false;
    e.preventDefault();
  });
  frm.appendChild(fe);

  return frm;
}

function formField(td, fieldName, fieldType) {
  let div = document.createElement('div');
  div.classList.add('form-field');

  let lbl = document.createElement('label');
  lbl.setAttribute('for', fieldName);
  lbl.textContent = `${fieldName[0].toUpperCase()}${fieldName.slice(1)}: `;
  div.appendChild(lbl);

  let fe = document.createElement('input');
  fe.id = fieldName;
  fe.setAttribute('type', fieldType);
  fe.setAttribute('name', fieldName);
  fe.setAttribute('value', td[fieldName]);
  div.appendChild(fe);

  return div;
}

export default toDoDiv;