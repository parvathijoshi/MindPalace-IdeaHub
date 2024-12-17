import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const IdeasWithTags = sequelize.define('IdeasWithTags', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    ideaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // references: {
        //     model: 'Ideas',
        //     key: 'id'
        // }
    },
    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // references: {
        //     model: 'Categories',
        //     key: 'id'
        // }
    }
}, {
    tableName: 'IdeasWithTags',
    timestamps: false
});

export default IdeasWithTags;
