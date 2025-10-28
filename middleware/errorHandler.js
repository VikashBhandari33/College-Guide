const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: 'Validation Error',
            details: Object.values(err.errors).map(e => e.message)
        });
    }

    if (err.code === 11000) {
        return res.status(400).json({
            error: 'Duplicate Error',
            message: 'This email is already registered'
        });
    }

    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message
    });
};

module.exports = { errorHandler };