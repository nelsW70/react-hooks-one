import React, { useState, useEffect, useReducer } from 'react';
import uuid from 'uuid/v4';

const initialTasksState = {
  tasks: [],
  completedTasks: []
};

const tasksReducer = (state, action) => {
  console.log('state', state, 'action', action);
  return {
    ...state,
    tasks: [...state.tasks, action.task]
  };
};

const TASKS_STORAGE_KEY = 'TASKS_STORAGE_KEY';

const storeTasks = taskMap => {
  localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(taskMap));
};

const readStoredTasks = () => {
  const tasksMap = JSON.parse(localStorage.getItem(TASKS_STORAGE_KEY));

  return tasksMap ? tasksMap : { tasks: [], completedTasks: [] };
};

export default function Tasks() {
  const [taskText, setTaskText] = useState('');
  const storedTasks = readStoredTasks();
  const [tasks, setTasks] = useState(storedTasks.tasks);
  const [completedTasks, setCompletedTasks] = useState(
    storedTasks.completedTasks
  );

  const [state, dispatch] = useReducer(tasksReducer, initialTasksState);

  useEffect(() => {
    storeTasks({ tasks, completedTasks });
  });

  const updateTaskText = event => {
    setTaskText(event.target.value);
  };

  const addTask = () => {
    dispatch({ task: { taskText, id: uuid() } });
    setTasks([...tasks, { taskText, id: uuid() }]);
    setTaskText('');
  };

  const completeTask = completedTask => () => {
    setCompletedTasks([...completedTasks, completedTask]);
    setTasks(tasks.filter(task => task.id !== completedTask.id));
  };

  const deleteTask = task => () => {
    setCompletedTasks(completedTasks.filter(t => t.id !== task.id));
  };

  return (
    <div>
      <h3>Tasks</h3>
      <div className="form">
        <input type="text" value={taskText} onChange={updateTaskText} />
        <button onClick={addTask}>Add Task</button>
      </div>
      <div className="task-list">
        {tasks.map(task => {
          const { id, taskText } = task;
          return (
            <div key={id} onClick={completeTask(task)}>
              {taskText}
            </div>
          );
        })}
      </div>
      <div className="completed-list">
        {completedTasks.map(task => {
          const { id, taskText } = task;
          return (
            <div key={id}>
              {taskText}{' '}
              <span className="delete-task" onClick={deleteTask(task)}>
                x
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
