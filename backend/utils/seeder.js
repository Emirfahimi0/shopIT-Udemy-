const Product = require('../models/product');
const dotenv = require('dotenv');
const connectDB = require('../config/database');

const products = require('../data/products');

//Setting dotenv file
dotenv.config({path:'backend/config/config.env'});

connectDB();

const seedProduct = async () =>{
    try{

        await Product.deleteMany();
        console.log('Product deleted');
        await Product.insertMany(products);
        console.log('all products inserted');
        process.exit();

    } catch(error){

        console.log(error.message);
        process.exit();

    }
}
seedProduct();