/* Use window.localStorage for this solution
*/

class IO {

  constructor() {
    let storage;
    try {
      storage = window.localStorage;
      const x = "__storage_test__";
      storage.setItem(x, x);
      storage.removeItem(x);

      this.store = storage;

    } catch (e) {
      if (
        e instanceof DOMException &&
        e.name === "QuotaExceededError" &&
        // acknowledge QuotaExceededError only if there's something already stored
        storage &&
        storage.length !== 0
      ) {
        this.store = storage;
      } else {
        this.store = undefined;
      };
    }
  }

  // Create keys as entity names plus unique id strings separated by a pipe character,
  //  with values being the objects to be stringified and stored

  storeItem(entityName, key, value) {
    this.store.setItem(entityName + '|' + key, JSON.stringify(value));
  }

  retrieveItem(entityName, key) {
    return JSON.parse(this.store.getItem(entityName + '|' + key));
  }

  deleteItem(entityName, key) {
    this.store.removeItem(entityName + '|' + key);
  }

  retrieveAll(entityName) {
    let result = [];
    Object.keys(localStorage).forEach(key => {
      let [en, id] = key.split('|');
      if (en === entityName) {
        result.push(this.retrieveItem(en, id));
      }
    });

    return result;
  }
}

export default IO;