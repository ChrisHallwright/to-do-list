import IO from '../dataIO.js';

const dataIO = new IO();

class ToDo {

  constructor(title, description = '', dueDate = null, priority = 3, collection = 'Default',
    notes = '', checklist = []) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.collection = collection;
    this.notes = notes;
    this.checklist = checklist;
    
    this.done = false;
    this.id = crypto.randomUUID();

    ToDo.all.push(this);
  }

  store() {
    dataIO.storeItem('to-do', this.id, this);
  }

  static all = [];

  static loadAll() {
    ToDo.all = [];
    for (const item of dataIO.retrieveAll('to-do')) {
      let props = [];
      for (const prop in item) {
        props.push(item[prop]);
      }
      new ToDo(...props);
    }
  }

  destroy() {
    dataIO.deleteItem('to-do', this.id);
    let i = ToDo.all.indexOf(this);
    ToDo.all.splice(i, 1);
  }

}

export default ToDo;