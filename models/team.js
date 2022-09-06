'use strict';
const {
    Model,
    Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Team extends Model {
        static associate(models) {
            this.belongsTo(models.Competition, { foreignKey: 'competition', targetKey: 'id' });
            this.hasMany(models.Schedule, { foreignKey: 'team', sourceKey: 'id' });
        }
    }

    Team.init({
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
        competition: {
            allowNull: false,
            type: Sequelize.UUID,
            references: {
                model: {
                    tableName: 'm_competitions',
                    key: 'id'
                }
            }
        }
    }, {
        sequelize,
        tableName: 'm_teams',
    });
    return Team;
};