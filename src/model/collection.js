import IO from '../dataIO.js';
import ToDo from "../model/to-do.js";

const dataIO = new IO();

class Collection {
  constructor(name) {
    this.name = name;

    Collection.all.push(this);
  }

  store() {
    dataIO.storeItem('collection', this.name, this);
  }

  static all = [];

  static loadAll() {
    Collection.all = [];
    for (const item of dataIO.retrieveAll('collection')) {
      let props = [];
      for (const prop in item) {
        props.push(item[prop]);
      }
      new Collection(...props);
    }
  }

  destroy() {
    // Prevent deletion if used by any to-dos
    ToDo.loadAll();
    const toDoArray = ToDo.all.filter(td => {
      return td.collection === this.name;
    })
    if (toDoArray.length > 0) {
      alert(`I can't delete this collection.  It is being used by ${toDoArray.length} to-dos.`);
      return 'error';
    }

    dataIO.deleteItem('collection', this.name);
    let i = Collection.all.indexOf(this);
    Collection.all.splice(i, 1);
  }
}

export default Collection;