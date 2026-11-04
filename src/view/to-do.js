import ToDo from "../model/to-do.js";

ToDo.loadAll();

/* const t1 = new ToDo('sit up straight');
t1.store();
const t2 = new ToDo('eat less');
t2.store();
 */
function toDoDiv() {
  const div = document.createElement('div');
  div.classList.add('to-do');

  let td;
  let el;
  for (td of ToDo.all) {
    el = document.createElement('p');
    el.textContent = td.title;
    div.appendChild(el);
    el = document.createElement('p');
    el.textContent = td.collection;
    div.appendChild(el);
  }

  return div;
}

export default toDoDiv;