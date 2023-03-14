const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

let repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const { url, title, techs } = request.body;
  const id = uuid();
  const repository = {
    url,
    title,
    techs,
    id,
    likes: 0
  }
  repositories.push(repository)
  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const id = request.params.id;
  const { url, title, techs } = request.body;
  const repositoryIndex = repositories.findIndex((repo) => repo.id === id);
  if (repositoryIndex === -1) {
    return response.status(400).send();
  }
  const repositoryUpdated = {
    id: repositories[repositoryIndex].id,
    url: url ? url : repositories[repositoryIndex].url,
    title: title ? title : repositories[repositoryIndex].title,
    techs: techs ? techs : repositories[repositoryIndex].techs,
    likes: repositories[repositoryIndex].likes,
  }
  repositories[repositoryIndex] = repositoryUpdated;
  return response.json(repositoryUpdated);

});

app.delete("/repositories/:id", (request, response) => {
  const id = request.params.id;
  const repositoryIndex = repositories.findIndex((repo) => repo.id === id);
  if (repositoryIndex === -1) {
    return response.status(400).send();
  }
  repositories = repositories.filter((repo) => repo.id !== id);
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const id = request.params.id;
  const repositoryIndex = repositories.findIndex((repo) => repo.id === id);
  if (repositoryIndex === -1) {
    return response.status(400).send();
  }
  const repositoryUpdated = {
    ...repositories[repositoryIndex],
    likes: repositories[repositoryIndex].likes+1,
  }
  repositories[repositoryIndex] = repositoryUpdated;
  return response.json(repositoryUpdated);
});

module.exports = app;
