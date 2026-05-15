const {connect} = require('mongoose')

const connectDB = async () => {
    try {
        await connect('mongodb://localhost:27017/flutter-wallapop-local')
        console.log('Conectado a MongoDB')
    } catch (error) {
        console.error('Error conectando a MongoDB:', error)
        process.exit(1)
    }
}

module.exports = connectDB