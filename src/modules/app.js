import { createElement, render } from './render.js';
import Task from './task.js';
import { $ } from './utils.js';

const $root = $('#root');

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

  updateTaskArr = () => {
    const tempArr = [...this.taskArr];
    this.taskArr = [];
    tempArr.forEach((task) => {
      const newTask = new Task(task.description, false, this.getIndex());
      this.taskArr.push(newTask);
    });
    this.saveLocalStorage();
  }

  addRemoveFunction = (trashIcon, index) => {
    trashIcon.addEventListener('click', () => {
      this.taskArr.splice(index, 1);
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

  setClasses = (activate, li, ellipsisIcon, trashIcon, cursorStyle) => {
    if (activate) {
      li.classList.add('highlight');
      trashIcon.classList.add('visible');
      ellipsisIcon.classList.remove('visible');
      trashIcon.style.cursor = cursorStyle;
    } else {
      li.classList.remove('highlight');
      ellipsisIcon.classList.add('visible');
      trashIcon.classList.remove('visible');
      trashIcon.style.cursor = cursorStyle;
    }
  };

  addActivationEvent = (textTask, li, ellipsisIcon, trashIcon, index) => {
    textTask.addEventListener('click', () => {
      this.setClasses(true, li, ellipsisIcon, trashIcon, 'pointer');
      this.addChangesListener(textTask, index);
    });
    this.addRemoveFunction(trashIcon, index);
  };

  addDeactivationEvent = (textTask, li, ellipsisIcon, trashIcon) => {
    textTask.addEventListener('focusout', () => {
      setTimeout(() => {
        this.setClasses(false, li, ellipsisIcon, trashIcon, 'move');
      }, 120);
    });
  }

  displayTasks = () => {
    $root.innerHTML = '';
    this.taskArr.forEach((task, index) => {
      const input = createElement('input', { type: 'checkBox', class: 'check-box' });
      const textTask = createElement('textarea', { class: 'text-task', contenteditable: 'true', rows: 1 }, [task.description]);
      const ellipsisIcon = createElement('i', { class: 'icon fas fa-ellipsis-v visible' });
      const trashIcon = createElement('i', { class: 'icon fas fa-trash-alt' });
      const li = createElement('li', { class: 'task-li', draggable: 'true' }, [input, textTask, ellipsisIcon, trashIcon]);
      this.addActivationEvent(textTask, li, ellipsisIcon, trashIcon, index);
      this.addDeactivationEvent(textTask, li, ellipsisIcon, trashIcon);
      render(li, $root);
    });
  };

  pushTask = (taskDescription) => {
    const newTask = new Task(taskDescription, false, this.getIndex());
    this.taskArr.push(newTask);
    this.saveLocalStorage();
  }

  addTask = ($newTaskInput) => {
    if ($newTaskInput.value) {
      this.pushTask($newTaskInput.value);
      $newTaskInput.value = '';
      this.displayTasks();
    }
  }
}

export default ToDoApp;
