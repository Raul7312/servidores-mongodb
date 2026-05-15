const {Schema, model } = require('mongoose')

const productoSchema = new Schema({
    titulo: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    precio: {
        type: String,
        required: true
    },
    imgUrl: {
        type: String,
        default: ''
    },
    isReserved: {
        type: Boolean,
        default: false
    }
})

module.exports = model('Producto', productoSchema)