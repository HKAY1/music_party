const helmet = require('helmet');
const indexRouter = require('routes/index');
const requestParser = require('middlewares/request-parser');
const moment = require('moment');

module.exports = (app, config) => {

     app.use(helmet());

     //request parser 
       app.use(requestParser.parse);
    
    app.use('/', indexRouter);

    app.use(function postHandler(req, res, next) {
        res.set('access-control-expose-headers', 'Server-Time');
        res.set('Server-Time', moment().format());
        // if response contains downloadableFile download it
        if (res.downloadableFile) {
            res.download(res.downloadableFile, res.downloadableFileName);

            return;
        } else if (req.route && req.route.path) {
            var responseData = {
                success: true,
                resultSize: res.resultSize,
                data: res.data
            };

            if (res.paginate) {
                responseData['paginate'] = res.paginate;
            }

            res.json(responseData);
            res.end();
            return;
        } else {
            next();
        }
    });

    /*
     * handle 404
     */
    app.use(function notFoundHandler(req, res, next) {
        if (!req.route || !req.route.path) {
            console.log(req.params);
            res.status(404);
            console.log('%s %d %s', req.method, res.statusCode, req.url);
            return res.json({
                error: 'Not found'
            });
        }
    });
    /*
     * error handlers
     */
    app.use(function errorHandler(err, req, res, next) {
        console.error('err handler', err, 'url => ', req.url);
        if (err.name === 'MongoServerError' && err.code === 11000) {
            let dupErr = {};
            dupErr.message = "Duplicate Key";
            dupErr.keys = err.keyValue;
            err = dupErr;
            res.status(err.status || 422);
        } else if (err.name === 'ValidationError') {
            res.status(err.status || 422);
        } else {
            var request = {url: req.url};
            request.error = err;
            request.method = req.method;
            if (req.body) {
                request.body = req.body;
            }
            if (req.params) {
                request.params = req.params;
            }
            if (req.query) {
                request.query = req.query;
            }
            res.status(err.status || 500);
        }
        return res.json({
            success: false,
            error: err
        });
    });

    app.set('port', config.port || 2300);

}

