const Product = require('../models/product')
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const APIFeatures = require('../utils/apiFeatures')


// Create new products = api/v1/admin/product/new
exports.newProduct = catchAsyncErrors(async (req, res, next) => { // const apiFeatures = new apiFeatures(Product.find(), req.query);

    req.body.user = req.user.id;
    const product = await Product.create(req.body);

    res.status(201).json({success: true, product})
})


// Get all products = api/v1/product
exports.getProducts = catchAsyncErrors(async (req, res, next) => {

    const resPerPage = 4;
    const productsCount = await Product.countDocuments();

    const apiFeatures = new APIFeatures(Product.find(), req.query)
    .search()
    .filter()

    let products = await apiFeatures.query.clone();
    let filteredProductsCount = products.length
    
    apiFeatures.pagination(resPerPage)

    products = await apiFeatures.query;


        res.status(200).json({
            success: true,
            productsCount,
            resPerPage,
            filteredProductsCount,
            products
        })
   
})


// Get single product = api/v1/product/:id
exports.getProductById = catchAsyncErrors(async (req, res, next) => {

    const product = await Product.findById(req.params.id);

    if (! product) {
        return next(new ErrorHandler('Product not found', 404));
    }

    res.status(200).json({success: true, message: 'This route will show product by id.', product})
})


// Update single product = api/v1/admin/product/:id
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {

    let product = await Product.findById(req.params.id);

    if (! product) {
        return next(new ErrorHandler('Product not found', 404));
    }

    // function to update product by id
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false

    });

    res.status(200).json({success: true, message: 'This route will update product by id.', product})
})


// Delete product by ID = api/v1/admin/product/:id
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {

    const product = await Product.findById(req.params.id);

    if (! product) {
        return next(new ErrorHandler('Product not found', 404));
    }

    await product.delete();

    res.status(200).json({success: true, message: 'product is deleted.', product})
})

// Create product review  = api/v1/review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {

    const {rating, comment, productId} = req.body;

    const review = {

        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }

    const product = await Product.findById(productId);
    const isReviewed = product.reviews.find(r => r.user.toString() === review.user._id.toString())


    if (isReviewed) {

        product.reviews.forEach(review => {
            if (review.user.toString() === review.user._id.toString()) {
                review.comment = comment;
                review.rating = rating;
            }
        })
    } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length
    } product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length

    await product.save({validateBeforeSave: false});

    res.status(200).json({success: true})
})


// Get Product Reviews   =>   /api/v1/reviews
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.id);

    res.status(200).json({
        success: true,
        reviews: product.reviews
    })
})

    // Delete Product Reviews   =>   /api/v1/reviews
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {

    const product = await Product.findById(req.query.productId);

    const reviews = product.reviews.filter(review => review._id === req.query.id.toString())

    const numOfReviews = reviews.length;
    // reduce function for one ouput
    const ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length

    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        numOfReviews
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true
    })
})
