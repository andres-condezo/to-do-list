class Task {
  constructor(description = 'All clean', completed = false, index = 0) {
    this.description = description;
    this.completed = completed;
    this.index = index;
  }
}

export default Task;
