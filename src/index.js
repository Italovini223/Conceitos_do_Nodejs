const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const {username} = request.headers;

  const user = users.find(user => user.userName === username);

  if(!user){
    return response.status(400).json({error: 'User not found'});
  }

  request.user = user;
  return next();
  
}

app.post('/users', (request, response) => {
  const {name, userName} = request.body;

  const userNameExistent = users.some(user => user.userName === userName);

  if(userNameExistent) {
    return response.status(400).json({error: 'User name already exists'});
  }

  const user = {
    id: uuidv4(),
    name,
    userName,
    todos: []
  }

  users.push(user);


  return response.status(201).json(user);

});

app.get('/todos', checksExistsUserAccount, (request, response) => {

  const {user} = request;

  const userTodos = user.todos;

  return response.status(200).json(userTodos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const {user} = request;
  const {title, deadline} = request.body;
  
  // date format => yyyy/mm/dd

  const todo = {
    id: uuidv4(),
    title,
    deadline: new Date(deadline),
    done: false,
    created_at: new Date()
  }

  user.todos.push(todo);

  return response.status(201).json(todo);

});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const {user} = request;
  const {id} = request.params;
  const {title, deadline} = request.body;

  const todo = user.todos.find(todo => todo.id === id);

  if(!todo){
    return response.status(400).json({error: 'todo not found'})
  }

  todo.title = title;
  todo.deadline = new Date(deadline);

  return response.status(200).json(todo);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const {user} = request;
  const {id} = request.params;

  const todo = user.todos.find(todo => todo.id === id);
  todo.done = true;

  return response.status(200).send();
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const {user} = request;
  const {id} = request.params;

  const todo = user.todos.find(todo => todo.id === id);

  user.todos.splice(todo, 1);

  return response.status(200).send();
});

module.exports = app;