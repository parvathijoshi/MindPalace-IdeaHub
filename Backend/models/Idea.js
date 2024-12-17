import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Idea = sequelize.define('Idea', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    createdBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    likes: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
    },
    deletedStatus: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    isApproved: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
    },
    is_draft: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
    }
});

export default Idea;
