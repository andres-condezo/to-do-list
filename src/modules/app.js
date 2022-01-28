// This Module contains the app class

import { createElement, render } from './render.js';
import Task from './task.js';
import { $ } from './utils.js';

const $root = $('#root');
const clearBtn = $('.removeCompletedBtn');

// ***************
// To Do App Class
// ***************

class ToDoApp {
  constructor() {
    this.taskArr = [];
  }

  // Local Storage

  saveLocalStorage = () => {
    const localTaskArr = JSON.stringify(this.taskArr);
    localStorage.setItem('taskArr', localTaskArr);
  }

  getLocalStorage = () => {
    const storageIsNotEmpty = localStorage.getItem('taskArr');
    const localStorageArr = JSON.parse(localStorage.getItem('taskArr'));

    if (storageIsNotEmpty) this.taskArr = localStorageArr;
  }

  // Get the index of a new task
  getIndex = () => this.taskArr.length + 1;

  // Update the index property for every task of the array.
  updateIndex = () => {
    this.taskArr.forEach((task, index) => {
      task.index = index + 1;
    });
  }

  // Delete the entire array of tasks
  clearTaskArr = () => { this.taskArr = []; };

  // Update the interface and storage
  updateApp = () => {
    this.updateIndex();
    this.saveLocalStorage();
    this.ChangeClearBtnState();
    this.getLocalStorage();
    this.displayTasks();
  }

  // Remove one task
  addRemoveFunction = (trashIcon, index) => {
    trashIcon.addEventListener('click', () => {
      this.taskArr.splice(index, 1);
      this.updateApp();
    });
  }

  // Save the new description for the task
  addChangesListener = (textTask, index) => {
    textTask.addEventListener('input', () => {
      const task = this.taskArr[index];
      const newDescription = textTask.value;

      task.description = newDescription;
      this.saveLocalStorage();
    });
  }

  // Set active or idle style for an item
  setClasses = (li, ellipsisIcon, trashIcon) => {
    li.classList.toggle('highlight');
    ellipsisIcon.classList.toggle('visible');
    trashIcon.classList.toggle('visible');
  };

  // Handle the active status of the task.
  addActivationEvent = (textTask, li, ellipsisIcon, trashIcon, index) => {
    textTask.addEventListener('click', () => {
      this.setClasses(li, ellipsisIcon, trashIcon);
      this.addChangesListener(textTask, index);
    });
    this.addRemoveFunction(trashIcon, index);
  };

  // Handle the idle status of the task.
  addDeactivationEvent = (textTask, li, ellipsisIcon, trashIcon) => {
    textTask.addEventListener('focusout', () => {
      setTimeout(() => {
        this.setClasses(li, ellipsisIcon, trashIcon);
      }, 220);
    });
  }

  // Look for completed tasks
  thereAreCompletedTasks = () => this.taskArr.some((task) => task.completed === true);

  // Handle the Clear Btn State
  ChangeClearBtnState = () => {
    if (this.thereAreCompletedTasks()) clearBtn.classList.add('active');
    else clearBtn.classList.remove('active');
  };

  // Show completed status
  showCompletedTasks = (index, $check, $box, $textTask) => {
    const currentTask = this.taskArr[index];
    const isCompleted = (task) => task.completed === true;

    if (isCompleted(currentTask)) {
      $check.classList.toggle('hidden');
      $box.classList.toggle('hidden');
      $textTask.classList.toggle('underlined');
    }
  }

  // Handle the check box toggle
  addCheckBoxListener = ($checkBox, $textTask, $box, $check, index) => {
    const task = this.taskArr[index];

    $checkBox.addEventListener('change', () => {
      $check.classList.toggle('hidden');
      $box.classList.toggle('hidden');
      $textTask.classList.toggle('underlined');
      task.completed = !task.completed;
      this.saveLocalStorage();
      this.ChangeClearBtnState();
    });
  }

  // Delete completed task from task array
  clearAllCompleted = () => {
    const uncompletedTasks = this.taskArr.filter((el) => el.completed === false);

    if (this.thereAreCompletedTasks()) {
      this.taskArr = uncompletedTasks;
      this.updateApp();
    }
  }

  // Add event listeners to DOM elements
  addEvents = (textTask, li, ellipsisIcon, trashIcon, checkBox, check, box, index) => {
    this.addDeactivationEvent(textTask, li, ellipsisIcon, trashIcon);
    this.addCheckBoxListener(checkBox, textTask, box, check, index);
    this.addActivationEvent(textTask, li, ellipsisIcon, trashIcon, index);
    this.showCompletedTasks(index, check, box, textTask);
  };

  // Create and render DOM elements
  displayTasks = () => {
    $root.innerHTML = '';
    this.taskArr.forEach((task, index) => {
      const textTaskProperties = { class: 'text-task', contenteditable: 'true', rows: 1 };
      const check/*        */ = createElement('i', { class: 'fas fa-check check hidden' });
      const box/*          */ = createElement('i', { class: 'far fa-square box' });
      const checkBox/*     */ = createElement('input', { type: 'checkBox', class: 'check-box' });
      const textTask/*     */ = createElement('textarea', textTaskProperties, [task.description]);
      const ellipsisIcon/* */ = createElement('i', { class: 'icon fas fa-ellipsis-v ellipsis-icon visible' });
      const trashIcon/*    */ = createElement('i', { class: 'icon fas fa-trash-alt trash-icon' });
      const liChildren = [check, box, checkBox, textTask, ellipsisIcon, trashIcon];
      const li = createElement('li', { class: 'task-li', draggable: 'true' }, liChildren);
      this.addEvents(textTask, li, ellipsisIcon, trashIcon, checkBox, check, box, index);
      render(li, $root);
    });
  };

  // Create new task and push it onto the Task Array
  addTask = ($newTaskInput) => {
    const description = $newTaskInput.value;
    const completed = false;
    const index = this.getIndex();
    const descriptionIsValid = description;
    const newTask = new Task(description, completed, index);

    if (descriptionIsValid) {
      this.taskArr.push(newTask);
      this.updateApp();
      $newTaskInput.value = '';
    }
  }
}

export default ToDoApp;
