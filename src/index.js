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
const $clearAllCompletedBtn = $('.removeCompletedBtn');

const main = () => {
  app.getLocalStorage();
  app.displayTasks();
  $refreshBtn.addEventListener('click', () => {
    app.clearTaskArr();
    app.ChangeClearBtnState();
    app.displayTasks();
  });
  $newTaskInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') { app.addTask($newTaskInput); }
  });
  $clearAllCompletedBtn.addEventListener('click', () => { app.clearAllCompleted(); });
  app.ChangeClearBtnState();
};

main();
