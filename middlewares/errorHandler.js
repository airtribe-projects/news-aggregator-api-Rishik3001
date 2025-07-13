const errorHandler = (err, req, res, next) => {
    console.error('Error:', err.stack || err.message || err);

    if (err.response && err.response.data) {
        return res.status(502).json({
            msg: 'Failed to fetch data from external service',
            details: err.response.data,
        });
    }

    res.status(err.status || 500).json({
        msg: err.message || 'Internal Server Error',
    });
};

module.exports = { errorHandler }