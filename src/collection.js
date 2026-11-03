import IO from './dataIO.js';

const dataIO = new IO();

class Collection {
  constructor(name) {
    this.name = name;

    Collection.all.push(this);
    dataIO.storeItem('collection', name, this);
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
    dataIO.deleteItem('collection', this.name);
    let i = Collection.all.indexOf(this);
    Collection.all.splice(i, 1);
  }
}

export default Collection;