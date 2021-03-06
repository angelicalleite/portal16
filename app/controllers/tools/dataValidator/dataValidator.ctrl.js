var express = require('express'),
    router = express.Router();

module.exports = function (app) {
    app.use('/', router);
};

router.get('/tools/data-validator', function (req, res) {
    res.render('pages/tools/dataValidator/dataValidator_tmp', {
        _meta: {
            title: 'Data validator'
        }
    });
});

router.get('/tools/data-validator-test', function (req, res) {
    res.render('pages/tools/dataValidator/dataValidator', {
        _meta: {
            title: 'Data validator'
        }
    });
});

router.get('/tools/data-validator-test/:jobid', function (req, res) {
    res.render('pages/tools/dataValidator/dataValidatorResults', {
        _meta: {
            title: 'Data validator'
        },
        jobId: req.params.jobid
    });
});
