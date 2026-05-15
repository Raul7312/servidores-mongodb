require('dotenv').config()
const app = require('./app')
const connectDB = require('./database')

const port = process.env.PORT

async function main() {
    await connectDB()
    app.listen(port)
    console.log('Se ha conectado bien')
}

main()