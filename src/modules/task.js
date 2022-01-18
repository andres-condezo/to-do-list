class Task {
  constructor(description = '', completed = false, index = 0) {
    this.description = description;
    this.completed = completed;
    this.index = index;
  }
}

export default Task;
