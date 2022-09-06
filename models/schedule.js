'use strict';
const {
    Model,
    Sequelize,
    Op
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Schedule extends Model {
        static associate(models) {
            this.belongsTo(models.Team, { foreignKey: 'team', targetKey: 'id' })
            this.belongsTo(models.Match, { foreignKey: 'match', targetKey: 'id' })
        }
    }

    Schedule.init({
        id: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4
        },
        match: {
            allowNull: false,
            type: Sequelize.UUID,
            references: {
                model: {
                    tableName: 't_matches',
                    key: 'id'
                }
            }
        },
        team: {
            allowNull: false,
            type: Sequelize.UUID,
            references: {
                model: {
                    tableName: 'm_teams',
                    key: 'id'
                }
            }
        }
    }, {
        sequelize,
        tableName: 't_schedules',
    });
    return Schedule;
};