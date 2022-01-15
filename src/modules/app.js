import { createElement, render } from './render.js';
import Task from './task.js';
import { $ } from './utils.js';

const $root = $('#root');
const $removeBtn = $('.removeCompletedBtn');

class ToDoApp {
  constructor() {
    this.taskArr = [];
    this.completedTaskArr = [];
  }

  // Local Storage

  saveLocalStorage = () => {
    const localTaskArr = JSON.stringify(this.taskArr);
    const localCompletedTaskArr = JSON.stringify(this.completedTaskArr);
    localStorage.setItem('taskArr', localTaskArr);
    localStorage.setItem('completedTaskArr', localCompletedTaskArr);
  }

  getLocalStorage = () => {
    if (localStorage.getItem('taskArr') && localStorage.getItem('completedTaskArr')) {
      this.taskArr = JSON.parse(localStorage.getItem('taskArr'));
      this.completedTaskArr = JSON.parse(localStorage.getItem('completedTaskArr'));
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

  clearCompletedArr = () => { this.completedTaskArr = []; this.saveLocalStorage(); };

  completedArrIsNotEmpty = () => this.completedTaskArr.length;

  checkCompletedArr = () => {
    if (this.completedArrIsNotEmpty()) {
      $removeBtn.classList.add('active');
    } else {
      $removeBtn.classList.remove('active');
    }
  };

  addRemoveFunction = (trashIcon, index) => {
    trashIcon.addEventListener('click', () => {
      this.taskArr.splice(index, 1);
      this.completedTaskArr = [];
      this.completedTaskArr = this.completedTaskArr.filter((el) => el !== index);
      this.checkCompletedArr();
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

  setClasses = (InputIsFocused, li, ellipsisIcon, trashIcon, cursorStyle) => {
    if (InputIsFocused) {
      trashIcon.style.cursor = cursorStyle;
      li.classList.add('highlight');
      ellipsisIcon.classList.remove('visible');
      trashIcon.classList.add('visible');
    } else {
      ellipsisIcon.style.cursor = cursorStyle;
      li.classList.remove('highlight');
      ellipsisIcon.classList.add('visible');
      trashIcon.classList.remove('visible');
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
      }, 220);
    });
  }

  addCheckBoxListener = ($checkBox, $textTask, $square, $check, index) => {
    $checkBox.addEventListener('change', () => {
      if ($checkBox.checked) {
        this.completedTaskArr.push(index);
      } else {
        this.completedTaskArr = this.completedTaskArr.filter((el) => el !== index);
      }
      $check.classList.toggle('hidden');
      $square.classList.toggle('hidden');
      $textTask.classList.toggle('underlined');
      this.taskArr[index].completed = !this.taskArr[index].completed;
      this.saveLocalStorage();
      this.checkCompletedArr();
    });
  }

  deleteCompletedTasks = () => {
    this.completedTaskArr.forEach((num) => {
      this.completedTaskArr = this.completedTaskArr.filter((el) => el !== num);
      this.saveLocalStorage();
    });
    this.checkCompletedArr();
    this.taskArr = this.taskArr.filter((el) => el.completed === false);
    this.saveLocalStorage();
    this.updateTaskArr();
    this.getLocalStorage();
    this.displayTasks();
  }

  displayTasks = () => {
    $root.innerHTML = '';
    this.taskArr.forEach((task, index) => {
      const checkBox = createElement('input', { type: 'checkBox', class: 'check-box' });
      const square = createElement('i', { class: 'far fa-square square' });
      const check = createElement('i', { class: 'fas fa-check check hidden' });
      const textTask = createElement('textarea', { class: 'text-task', contenteditable: 'true', rows: 1 }, [task.description]);
      const ellipsisIcon = createElement('i', { class: 'icon fas fa-ellipsis-v visible' });
      const trashIcon = createElement('i', { class: 'icon fas fa-trash-alt' });
      const li = createElement('li', { class: 'task-li', draggable: 'true' }, [square, check, checkBox, textTask, ellipsisIcon, trashIcon]);
      this.addActivationEvent(textTask, li, ellipsisIcon, trashIcon, index);
      this.addDeactivationEvent(textTask, li, ellipsisIcon, trashIcon);
      this.addCheckBoxListener(checkBox, textTask, square, check, index);
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
