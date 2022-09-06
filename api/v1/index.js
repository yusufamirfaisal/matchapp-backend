const router = require('express').Router();

router.use('/competitions', require('./competitions'));

module.exports = router;