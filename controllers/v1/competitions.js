const router = require('express').Router();
const competition = require('../../services/competitions');

router.post('/', competition.create);
router.delete('/:id', competition.destroy);
router.get('/', competition.getAll);
router.get('/:id', competition.getById);
router.put('/:id', competition.update);

module.exports = router;