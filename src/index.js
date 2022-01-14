// *****************
// Imports
// *****************

import './styles/style.css';
import ToDoApp from './modules/app.js';
import { $ } from './modules/utils.js';

// ***************
//  Main Function
// ***************

const app = new ToDoApp();
const $newTaskInput = $('.new-task');
const $refreshBtn = $('.refresh');

const main = () => {
  app.getLocalStorage();
  app.displayTasks();
  $refreshBtn.addEventListener('click', () => { app.displayTasks(); });
  $newTaskInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      app.addTask($newTaskInput);
    }
  });
};

main();
