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

  pushTask = (taskDescription) => {
    const newTask = new Task(taskDescription, false, this.taskArr.length);
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

  updateTaskArr = () => {
    const tempArr = [...this.taskArr];
    this.taskArr = [];
    tempArr.forEach((task) => {
      const newTask = new Task(task.description, false, this.taskArr.length);
      this.taskArr.push(newTask);
    });
    this.saveLocalStorage();
  }

  activateItem = (textTask, li, icon, index) => {
    textTask.addEventListener('click', () => {
      li.classList.add('highlight');
      icon.classList.add('fa-trash-alt');
      icon.classList.remove('fa-ellipsis-v');
      icon.style.cursor = 'pointer';

      icon.addEventListener('click', () => {
        this.taskArr.splice(index, 1);
        this.updateTaskArr();
        this.getLocalStorage();
        this.displayTasks();
      });

      textTask.addEventListener('input', () => {
        this.taskArr[index].description = textTask.value;
        this.saveLocalStorage();
      });
    });
  };

  deactivateItem = (textTask, li, icon) => {
    textTask.addEventListener('focusout', () => {
      setTimeout(() => {
        li.classList.remove('highlight');
        icon.classList.add('fa-ellipsis-v');
        icon.classList.remove('fa-trash-alt');
        icon.style.cursor = 'move';
      }, 120);
    });
  }

  displayTasks = () => {
    $root.innerHTML = '';
    this.taskArr.forEach((task, index) => {
      const input = createElement('input', { type: 'checkBox', class: 'check-box' });
      const textTask = createElement('textarea', { class: 'text-task', contenteditable: 'true', rows: 1 }, [task.description]);
      const icon = createElement('i', { class: 'icon fas fa-ellipsis-v' });
      const li = createElement('li', { class: 'task-li', draggable: 'true' }, [input, textTask, icon]);

      this.activateItem(textTask, li, icon, index);
      this.deactivateItem(textTask, li, icon);

      render(li, $root);
    });
  };
}

export default ToDoApp;
