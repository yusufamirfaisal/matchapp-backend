const models = require('../../models');

const getById = async (req, res) => {
    try {
        const data = await models.Competition.scope('withDetails').findByPk(req.params.id);
        res.jsend.success(data);
    } catch (error) {
        res.jsend.error(error)
    }
}

module.exports = getById;