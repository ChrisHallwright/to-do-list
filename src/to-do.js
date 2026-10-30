import { Storage } from './dataIO.js';

class ToDo {

  constructor(title, description, dueDate = null, priority = 3, collection = 'Default') {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.done = false;
  }

  static list(collection) {

  }

}

export default ToDo;