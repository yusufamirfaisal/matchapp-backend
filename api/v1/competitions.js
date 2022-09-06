'use-strict';

const router = require('express').Router();
const competition = require('../../controllers/competition');

router.get('/', competition.findAll);
router.get('/:id', competition.findByPk);
router.post('/', competition.create);
router.patch('/:id', competition.update);
router.delete('/:id', competition.delete);

module.exports = router;