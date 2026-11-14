import './styles.css';

import toDoDiv from './view/to-do.js';
import collectionDiv from './view/collection.js';

const content = document.querySelector('#content');

content.appendChild(toDoDiv());

const toDoBtn = document.querySelector('#to-do');
toDoBtn.hidden = true;
const collectionsBtn = document.querySelector('#collections');

toDoBtn.addEventListener('click', (e) => {
  content.replaceChild(toDoDiv(), content.childNodes[0]);
  collectionsBtn.hidden = false;
  toDoBtn.hidden = true;
});

collectionsBtn.addEventListener('click', (e) => {
  content.replaceChild(collectionDiv(), content.childNodes[0]);
  toDoBtn.hidden = false;
  collectionsBtn.hidden = true;
});
