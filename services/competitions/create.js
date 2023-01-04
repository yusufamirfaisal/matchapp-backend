const { sequelize } = require('../../models');
const models = require('../../models');
const moment = require('moment');

const create = async (req, res) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();

        const startDate = req.body.start;

        const endDate = req.body.end;

        const dayDiff = moment(endDate).diff(startDate, 'days');

        if (dayDiff < 0)
        
            throw new Error(`Minimum competition time is 1 day`);

        const createCompetition = await models.Competition.create({
            name: req.body.name,
            type: req.body.type,
            location: req.body.location,
            start: req.body.start,
            end: req.body.end
        }, { transaction });

        const splitTeam = req.body.team.split(', ');

        const listTeam = [];

        for (let i = 0; i < splitTeam.length; i++) {

            listTeam.push({

                name: splitTeam[i],

                competition: createCompetition.id

            })

        };

        const createTeam = await models.Team.bulkCreate(listTeam, { transaction });

        if (req.body.type === 'half') {

            var numberOfMatch = (createTeam.length / 2) * (createTeam.length - 1);

            var listScheduleTeam = [];

            for (let i = 0; i < createTeam.length; i++) {

                for (let j = i + 1; j < createTeam.length; j++) {

                    listScheduleTeam.push({

                        team: createTeam[i].id

                    }, {

                        team: createTeam[j].id

                    });

                };

            };

        } else {

            var numberOfMatch = createTeam.length * (createTeam.length - 1);

            var listScheduleTeam = [];

            for (let i = 0; i < createTeam.length; i++) {

                for (let j = 0; j < createTeam.length; j++) {

                    if (createTeam[i] !== createTeam[j]) {

                        listScheduleTeam.push({

                            team: createTeam[i].id

                        }, {

                            team: createTeam[j].id

                        })

                    }

                }

            }

        }

        let listMatch = [];

        for (let i = 0; i < numberOfMatch; i++) {

            listMatch.push({

                competition: createCompetition.id,

                date: moment(createCompetition.start).add(i, 'days').format('YYYY-MM-DD')

            });

        };

        const createMatch = await models.Match.bulkCreate(listMatch, { transaction });

        let listScheduleMatch = [];

        for (let i = 0; i < createMatch.length; i++) {

            for (let j = 0; j < 2; j++) {

                listScheduleMatch.push({

                    match: createMatch[i].id

                });

            };

        };

        const listSchedule = listScheduleMatch.map((item, i) => Object.assign({}, item, listScheduleTeam[i]));

        await models.Schedule.bulkCreate(listSchedule, { transaction });

        res.jsend.success({});

        await transaction.commit();
    } catch (error) {

        res.jsend.error(error);

        if (transaction) {

            await transaction.rollback();

        }

    }
}

module.exports = create;