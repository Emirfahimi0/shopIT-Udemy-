const ErrorHandler = require('../utils/errorHandler')

// different error handlers for production and development environments
module.exports = (err, req, res, next) => {

    err.statusCode = err.statusCode || 500;

   if (process.env.NODE_ENV === 'DEVELOPMENT'){

        res.status(err.statusCode).json({
            success: false,
            error: err,
            errmessage: err.message,
            stack: err.stack
        })
   }

   if (process.env.NODE_ENV === 'PRODUCTION'){

        let error = {...err}
        error.message = err.message || 'Something went wrong';

        //Wrong mongoose object ID Error
        if(err.name ==='CastError'){
            const message = `Resource not found. Invalid: ${err.path}`;
            error = new ErrorHandler(message, 400);
        }
        
        //Handling mongoose validation errors
        if(err.name === 'ValidationError'){
            const message = Object.values(err.errors).map(val => val.message);
            error = new ErrorHandler(message, 400);
        }

        // Handling mongoose duplicate errors
        if(err.code === 11000){
            const message = `Duplicate field value entered ${Object.keys(err.keyValue)}`;
            error = new ErrorHandler(message, 400);
        }

        // Handling wrong JWT errors

        if(err.name === 'JsonWebTokenError'){
            const message = 'Json Web Token not found. Try again!!'
            error = new ErrorHandler(message, 401);
        }

        if(err.name === 'TokenExpiredError'){
            const message = 'Json Web Token is expired. Try again!!'
            error = new ErrorHandler(message, 401);
        }



        res.status(error.statusCode).json({
            success: false,
            message: error.message || 'Internal Server Error'
        })
   }

  
}