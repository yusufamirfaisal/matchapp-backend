const models = require('../../models');

const getAll = async (req, res) => {
    try {
        const data = await models.Competition.findAll();
        res.jsend.success(data);
    } catch (error) {
        res.jsend.error(error);
    }
}

module.exports = getAll;