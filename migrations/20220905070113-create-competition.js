'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('m_competitions', {
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
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('m_competitions');
    }
};