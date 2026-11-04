import Collection from "../model/collection.js";

Collection.loadAll();

/* const c1 = new Collection('Default');
c1.store();
const c2 = new Collection('Shopping');
c2.store();
 */
function collectionDiv() {
  const div = document.createElement('div');
  div.classList.add('collection');

  let coll;
  let el;
  for (coll of Collection.all) {
    el = document.createElement('p');
    el.textContent = coll.name;
    div.appendChild(el);
  }

  return div;
}

export default collectionDiv;