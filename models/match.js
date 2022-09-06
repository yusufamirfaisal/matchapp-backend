'use strict';
const {
    Model,
    Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Match extends Model {
        static associate(models) {
            this.belongsTo(models.Competition, { foreignKey: 'competition', targetKey: 'id' })
            this.hasMany(models.Schedule, { foreignKey: 'match', sourceKey: 'id' })
        }
    }
    Match.init({
        id: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4
        },
        competition: {
            allowNull: false,
            type: Sequelize.UUID,
            references: {
                model: {
                    tableName: 'm_competitions',
                    key: 'id'
                }
            }
        },
        date: {
            allowNull: false,
            type: Sequelize.DATE
        }
    }, {
        sequelize,
        tableName: 't_matches',
    });
    return Match;
};