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
    if (localStorage.getItem('taskArr')) {
      this.taskArr = JSON.parse(localStorage.getItem('taskArr'));
    }
  }

  // main functions

  getIndex = () => this.taskArr.length + 1;

  clearTaskArr = () => { this.taskArr = []; };

  updateTaskArr = () => {
    const tempArr = [...this.taskArr];
    this.clearTaskArr();
    tempArr.forEach((task) => {
      const newTask = new Task(task.description, task.completed, this.getIndex());
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
    textTask.addEventListener('input', () => {
      this.taskArr[index].description = textTask.value;
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

  clearBtnState = 0;

  thereAreCompletedTasks = () => this.clearBtnState;

  ChangeClearBtnState = () => {
    if (this.thereAreCompletedTasks) clearBtn.classList.add('active');
    else clearBtn.classList.remove('active');
  };

  showCompletedTasks = (index, $check, $box, $textTask) => {
    if (this.taskArr[index].completed === true) {
      $check.classList.toggle('hidden');
      $box.classList.toggle('hidden');
      $textTask.classList.toggle('underlined');
    }
  }

  addCheckBoxListener = ($checkBox, $textTask, $box, $check, index) => {
    $checkBox.addEventListener('change', () => {
      if ($checkBox.checked) this.clearBtnState += 1;
      else this.clearBtnState -= 1;
      console.log(this.clearBtnState);
      $check.classList.toggle('hidden');
      $box.classList.toggle('hidden');
      $textTask.classList.toggle('underlined');
      this.taskArr[index].completed = !this.taskArr[index].completed;
      this.saveLocalStorage();
      this.ChangeClearBtnState();
    });
  }

  // Delete completed task from task array
  deleteCompletedTasks = () => {
    this.clearBtnState = 0;
    this.ChangeClearBtnState();
    console.log(this.clearBtnState);
    this.taskArr = this.taskArr.filter((el) => el.completed === false);
    this.saveLocalStorage();
    this.getLocalStorage();
    this.updateTaskArr();
    this.displayTasks();
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
    if ($newTaskInput.value) {
      const newTask = new Task($newTaskInput.value, false, this.getIndex());
      this.taskArr.push(newTask);
      this.saveLocalStorage();
      this.displayTasks();
      $newTaskInput.value = '';
    }
  }
}

export default ToDoApp;
