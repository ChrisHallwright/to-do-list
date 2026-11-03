import Collection from './collection.js';

const c1 = new Collection('default');
const c2 = new Collection('shopping');

Collection.loadAll();

let ca = Collection.all;

for (let c of ca) {
  console.log(c.name);
//  c.destroy();
//  break;
}

