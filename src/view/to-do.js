import ToDo from "../model/to-do.js";

ToDo.loadAll();

function toDoDiv() {
  const div = document.createElement('div');
  div.classList.add('to-do');

  let td;
  let el;
  for (td of ToDo.all) {
    el = document.createElement('p');
    el.textContent = td.title;
    div.appendChild(el);
  }

  return div;
}

export default toDoDiv;