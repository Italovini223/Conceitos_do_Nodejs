const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const {userName} = request.headers;

  const user = users.find(user => user.userName === userName);

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

  users.push({
    id: uuidv4(),
    name,
    userName,
    todos: []
  });


  return response.status(200).send();

});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;