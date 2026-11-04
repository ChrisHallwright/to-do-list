import toDoDiv from './view/to-do.js';
import collectionDiv from './view/collection.js';

const content = document.querySelector('#content');

content.appendChild(toDoDiv());

const toDoBtn = document.querySelector('#to-do');
toDoBtn.addEventListener('click', (e) => {
  content.replaceChild(toDoDiv(), content.childNodes[0]);
});

const collectionsBtn = document.querySelector('#collections');
collectionsBtn.addEventListener('click', (e) => {
  content.replaceChild(collectionDiv(), content.childNodes[0]);
});
