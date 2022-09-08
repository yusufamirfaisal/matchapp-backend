const { sequelize } = require('../models');
const models = require('../models');
const moment = require('moment');

const competition = models.Competition;
const team = models.Team;
const match = models.Match;
const schedule = models.Schedule;

exports.findAll = async (req, res) => {
    try {
        await competition.findAll().then(data => {
            res.jsend.success(data);
        });
    } catch (error) {
        res.jsend.error(error);
    }
};

exports.findByPk = async (req, res) => {
    try {
        await competition.scope('withDetails').findByPk(req.params.id).then(data => {
            res.jsend.success(data)
        });
    } catch (error) {
        res.jsend.error(error);
    }
};

exports.create = async (req, res) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();

        let data = {
            name: req.body.name,
            type: req.body.type,
            location: req.body.location,
            start: req.body.start,
            end: req.body.end,
            team: req.body.team
        };

        const saveCompetition = await competition.create({
            name: req.body.name,
            type: req.body.type,
            location: req.body.location,
            start: req.body.start,
            end: req.body.end
        }, { transaction });

        let splitTeam = data.team.split(', ');
        let listTeam = [];
        for (let i = 0; i < splitTeam.length; i++) {
            listTeam.push({
                name: splitTeam[i],
                competition: saveCompetition.id
            })
        };
        const saveTeam = await team.bulkCreate(listTeam, { transaction });

        if (data.type === 'half') {
            var numberOfMatch = (saveTeam.length / 2) * (saveTeam.length - 1);
            var listScheduleTeam = [];
            for (let i = 0; i < saveTeam.length; i++) {
                for (let j = i + 1; j < saveTeam.length; j++) {
                    listScheduleTeam.push({
                        team: saveTeam[i].id
                    }, {
                        team: saveTeam[j].id
                    });
                };
            };
        } else {
            var numberOfMatch = saveTeam.length * (saveTeam.length - 1);
            var listScheduleTeam = [];
            for (let i = 0; i < saveTeam.length; i++) {
                for (let j = 0; j < saveTeam.length; j++) {
                    if (saveTeam[i] !== saveTeam[j]) {
                        listScheduleTeam.push({
                            team: saveTeam[i].id
                        }, {
                            team: saveTeam[j].id
                        })
                    }
                }
            }
        }

        let listMatch = [];
        for (let i = 0; i < numberOfMatch; i++) {
            listMatch.push({
                competition: saveCompetition.id,
                date: moment(saveCompetition.start).add(i, 'days').format('YYYY-MM-DD')
            });
        };
        const saveMatch = await match.bulkCreate(listMatch, { transaction });

        let listScheduleMatch = [];
        for (let i = 0; i < saveMatch.length; i++) {
            for (let j = 0; j < 2; j++) {
                listScheduleMatch.push({
                    match: saveMatch[i].id
                });
            };
        };

        const listSchedule = listScheduleMatch.map((item, i) => Object.assign({}, item, listScheduleTeam[i]));
        await schedule.bulkCreate(listSchedule, { transaction });

        res.jsend.success(res.status);
        await transaction.commit();
    } catch (error) {
        res.jsend.error(error);
        if (transaction) {
            await transaction.rollback();
        }
    }
};

exports.update = async (req, res) => {
    try {
        await competition.update({
            name: req.body.name,
            type: req.body.type,
            location: req.body.location,
            start: req.body.start,
            end: req.body.end
        }, {
            where: {
                id: req.params.id
            }
        }).then(data => {
            data[0] === 0 ?
                res.jsend.error('Data not found!') :
                res.jsend.success(res.status)
        });
    } catch (error) {
        res.jsend.error(error);
    }
};

exports.delete = async (req, res) => {
    try {
        await competition.destroy({
            where: {
                id: req.params.id
            }
        }).then(data => {
            data === 0 ?
                res.jsend.error('Data not found!') :
                res.jsend.success(res.status);
        });
    } catch (error) {
        res.jsend.error(error)
    }
};