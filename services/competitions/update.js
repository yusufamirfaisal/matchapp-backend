const models = require('../../models');

const update = async (req, res) => {
    try {
        await models.Competition.update({
            name: req.body.name,
            type: req.body.type,
            location: req.body.location,
            start: req.body.start,
            end: req.body.end
        }, {
            where: {
                id: req.params.id
            }
        })
        res.jsend.success({});
    } catch (error) {
        res.jsend.error(error)
    }
}

module.exports = update;