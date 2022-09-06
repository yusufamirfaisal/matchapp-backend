'use strict';
const {
    Model,
    Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Competition extends Model {
        static associate(models) {
            this.hasMany(models.Team, { foreignKey: 'competition', sourceKey: 'id' })
            this.hasMany(models.Match, { foreignKey: 'competition', sourceKey: 'id' })

            this.addScope('withDetails', {
                include: [{
                    required: false,
                    model: models.Team
                }, {
                    required: false,
                    model: models.Match,
                    include: [{
                        required: false,
                        model: models.Schedule,
                        include: [{
                            required: false,
                            model: models.Team
                        }]
                    }]
                }],
                order: [
                    ['Teams', 'name', 'ASC'],
                    ['Matches', 'date', 'ASC']
                ]
            });

            this.beforeDestroy(async (competition) => {
                let existingData = await this.findOne({
                    where: {
                        id: competition.id
                    }
                })

                if (existingData === 0) throw new Error('Data not found!')
            })
        }
    }

    Competition.init({
        id: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4
        },
        name: {
            allowNull: false,
            type: Sequelize.STRING
        },
        type: {
            allowNull: false,
            type: Sequelize.ENUM('full', 'half'),
            defaultValue: 'full'
        },
        location: {
            allowNull: false,
            type: Sequelize.STRING
        },
        start: {
            allowNull: false,
            type: Sequelize.DATE
        },
        end: {
            allowNull: false,
            type: Sequelize.DATE
        }
    }, {
        sequelize,
        tableName: 'm_competitions',
    });
    return Competition;
};