const app = require ('./app')
const connectDB = require('./config/database')
const dotenv = require('dotenv');
const cloudinary = require('cloudinary');



//Handle the Uncaught exception
process.on('uncaughtException',err => {
    
    console.log(`ERROR: ${err.stack}`);
    console.log('Shutting down server due to Uncaught exception');
    process.exit(1);
})

//setting up confiq  file 
dotenv.config({path:'backend/config/config.env'})



//connecting to MongoDB 
connectDB();



// Setting up cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

const server = app.listen(process.env.PORT, () =>{
    console.log(`Server started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`)
})

//Handle Uhandled Promise rejection

process.on('unhandledRejection', err =>{
    console.log(`ERROR: ${err.message}`);
    console.log('Shutting down server due to Unhandled Promise rejection');
    server.close(() => {
        process.exit(1);
    });
})