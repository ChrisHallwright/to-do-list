import Collection from './collection.js';
import ToDo from './to-do.js';

const t1 = new ToDo('Build Wall');
const t2 = new ToDo('Go away');

//ToDo.loadAll();

let td = ToDo.all;

for (let t of td) {
  console.log(t.title);
//  c.destroy();
//  break;
}

