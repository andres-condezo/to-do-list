import { createElement, render } from './render.js';
import Task from './task.js';
import { $ } from './utils.js';

const $root = $('#root');
const clearBtn = $('.removeCompletedBtn');

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
    if (storageIsNotEmpty) {
      this.taskArr = localStorageArr;
    }
  }

  // main functions

  getIndex = () => this.taskArr.length + 1;

  clearTaskArr = () => { this.taskArr = []; };

  updateTaskArr = () => {
    const tempArr = [...this.taskArr];
    this.clearTaskArr();
    tempArr.forEach((task) => {
      const index = this.getIndex();
      const newTask = new Task(task.description, task.completed, index);
      this.taskArr.push(newTask);
    });
    this.saveLocalStorage();
  }

  addRemoveFunction = (trashIcon, index) => {
    trashIcon.addEventListener('click', () => {
      this.taskArr.splice(index, 1);
      this.ChangeClearBtnState();
      this.updateTaskArr();
      this.getLocalStorage();
      this.displayTasks();
    });
  }

  addChangesListener = (textTask, index) => {
    const task = this.taskArr[index];
    const newDescription = textTask.value;
    textTask.addEventListener('input', () => {
      task.description = newDescription;
      this.saveLocalStorage();
    });
  }

  setClasses = (li, ellipsisIcon, trashIcon) => {
    li.classList.toggle('highlight');
    ellipsisIcon.classList.toggle('visible');
    trashIcon.classList.toggle('visible');
  };

  addActivationEvent = (textTask, li, ellipsisIcon, trashIcon, index) => {
    textTask.addEventListener('click', () => {
      this.setClasses(li, ellipsisIcon, trashIcon);
      this.addChangesListener(textTask, index);
    });
    this.addRemoveFunction(trashIcon, index);
  };

  addDeactivationEvent = (textTask, li, ellipsisIcon, trashIcon) => {
    textTask.addEventListener('focusout', () => {
      setTimeout(() => { this.setClasses(li, ellipsisIcon, trashIcon); }, 220);
    });
  }

  thereAreCompletedTasks = () => this.taskArr.some((task) => task.completed === true);

  ChangeClearBtnState = () => {
    if (this.thereAreCompletedTasks()) clearBtn.classList.add('active');
    else clearBtn.classList.remove('active');
  };

  showCompletedTasks = (index, $check, $box, $textTask) => {
    const currentTask = this.taskArr[index];
    const isCompleted = (task) => task.completed === true;
    if (isCompleted(currentTask)) {
      $check.classList.toggle('hidden');
      $box.classList.toggle('hidden');
      $textTask.classList.toggle('underlined');
    }
  }

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
    if (this.thereAreCompletedTasks()) {
      const uncompletedTasks = this.taskArr.filter((el) => el.completed === false);
      this.taskArr = uncompletedTasks;
      this.saveLocalStorage();
      this.ChangeClearBtnState();
      this.getLocalStorage();
      this.updateTaskArr();
      this.displayTasks();
    }
  }

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
    if (descriptionIsValid) {
      const newTask = new Task(description, completed, index);
      this.taskArr.push(newTask);
      this.saveLocalStorage();
      this.displayTasks();
      $newTaskInput.value = '';
    }
  }
}

export default ToDoApp;
