import './style.css';
import { createElement, render } from './create-element';
import taskArr from './task-arr';

const displayTasks = (taskArr) => {
  taskArr.forEach((task) => {
    const input = createElement('input', {
      type: 'checkBox',
      class: 'check-box',
    });
    const textTask = task.description;
    const icon = createElement('i', { class: 'fas fa-ellipsis-v kebab' });
    const li = createElement('li', { class: 'task-li' }, [input, textTask, icon]);
    render(li, document.getElementById('root'));
  });
};

displayTasks(taskArr);
