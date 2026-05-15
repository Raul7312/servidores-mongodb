const express = require('express');
const cors = require('cors')  

const app = express();

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static('src/uploads'))

app.use('/api/productos', require('./src/routes/productos.routes'))

module.exports = app; 