const models = require('../../models');

const destroy = async (req, res) => {
    try {
        await models.Competition.destroy({
            where: {
                id: req.params.id
            }
        })
        res.jsend.success({});
    } catch (error) {
        res.jsend.error(error)
    }
}

module.exports = destroy;