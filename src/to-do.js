import IO from './dataIO.js';

class ToDo {

  constructor(title, description, dueDate = null, priority = 3, collection = 'Default',
    notes = '', checklist = []) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.collection = collection;
    this.notes = notes;
    this.checklist = checklist;
    
    this.done = false;

    ToDo.all.push(this);
  }

  static all = [];

  destroy() {
    let i = ToDo.all.indexOf(this);
    ToDo.all.splice(i, 1);
  }


  static list(collection) {

  }

}

export default ToDo;