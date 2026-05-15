const express = require('express')
const router = express.Router()
const multer = require('multer')
const fs = require('fs')
const path = require('path')
const { v4: uuidv4 } = require('uuid')
const Producto = require('../models/producto.model')

// configuración del multer para guardar los archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, uuidv4() + path.extname(file.originalname))
    }
})
const upload = multer({ storage })

// get productos
router.get('/', async (req, res) => {
    const productos = await Producto.find()
    res.json(productos)
})

// post productos 
router.post('/', async (req, res) => {
    const producto = new Producto(req.body)
    await producto.save()
    res.json(producto)
})

// put producto 
router.put('/:id', async (req, res) => {
    const producto = await Producto.findByIdAndUpdate(
        req.params.id,
        req.body,
        { returnDocument: 'after' }
    )
    res.json(producto)
})

// dele producto 
router.delete('/:id', async (req, res) => {
    const producto = await Producto.findById(req.params.id)

    if (producto.imgUrl) {
        const nombreArchivo = producto.imgUrl.split('/uploads/')[1]
        const rutaArchivo = path.join(__dirname, '../../src/uploads', nombreArchivo)
        if (fs.existsSync(rutaArchivo)) {
            fs.unlinkSync(rutaArchivo)
        }
    }

    await Producto.findByIdAndDelete(req.params.id)
    res.json({ mensaje: 'Producto eliminado' })
})

// post imagen
router.post('/:id/imagen', upload.single('imagen'), async (req, res) => {
    const productoActual = await Producto.findById(req.params.id)

    if (productoActual.imgUrl) {
        const nombreArchivo = productoActual.imgUrl.split('/uploads/')[1]
        const rutaArchivo = path.join(__dirname, '../../src/uploads', nombreArchivo)
        if (fs.existsSync(rutaArchivo)) {
            fs.unlinkSync(rutaArchivo)
        }
    }

    const imgUrl = `http://${process.env.SERVER_IP}:${process.env.PORT}/uploads/${req.file.filename}`
    const producto = await Producto.findByIdAndUpdate(
        req.params.id,
        { imgUrl },
        { returnDocument: 'after' }
    )
    res.json(producto)
})


module.exports = router