const express = require('express');
const cors = require('cors');
const http = require('http');
const mongose = require('mongoose');
const routes = require('./routes');
const { setupWebSocket } = require('./websocket');

// Métodos HTTP: GET, POST, PUT, DELETE

// Tipos de parâmetros:
// 
// Query Params: request.query (Filtros, ordenação, paginação, ...)
// Route Params: request.params (Identificar um recuso na alteração ou remoção)
// Body: request.body (Dados para criação ou alteração de um registro)

const app = express();
const server = http.Server(app);

setupWebSocket(server);

mongose.connect('mongodb+srv://neptune076:qwedcvb1562@cluster0-32xlu.mongodb.net/week10?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true
})

app.use(cors())
app.use(express.json());
app.use(routes);


server.listen(3333)