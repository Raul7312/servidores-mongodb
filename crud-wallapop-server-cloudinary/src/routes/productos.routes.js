const express = require('express')
const router = express.Router()
const multer = require('multer')
const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const Producto = require('../models/producto.model')
require('dotenv').config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'wallapop',
        allowed_formats: ['jpg', 'png', 'jpeg'],
    },
})
const upload = multer({ storage })

// GET
router.get('/', async (req, res) => {
    const productos = await Producto.find()
    res.json(productos)
})

// POST
router.post('/', async (req, res) => {
    const producto = new Producto(req.body)
    await producto.save()
    res.json(producto)
})

// PUT
router.put('/:id', async (req, res) => {
    const producto = await Producto.findByIdAndUpdate(
        req.params.id,
        req.body,
        { returnDocument: 'after' }
    )
    res.json(producto)
})

// DELETE
router.delete('/:id', async (req, res) => {
    const producto = await Producto.findById(req.params.id)
    const publicId = producto.imgUrl.split('/').slice(-1)[0].split('.')[0]
    await cloudinary.uploader.destroy(`wallapop/${publicId}`)
    await Producto.findByIdAndDelete(req.params.id)
    res.json({ mensaje: 'Producto eliminado' })
})

// POST imagen
router.post('/:id/imagen', upload.single('imagen'), async (req, res) => {
    const productoActual = await Producto.findById(req.params.id)

    if (productoActual.imgUrl) {
        const publicId = productoActual.imgUrl.split('/').slice(-1)[0].split('.')[0]
        await cloudinary.uploader.destroy(`wallapop/${publicId}`)
    }

    const imgUrl = req.file.path
    const producto = await Producto.findByIdAndUpdate(
        req.params.id,
        { imgUrl },
        { returnDocument: 'after' }
    )
    res.json(producto)
})

module.exports = router