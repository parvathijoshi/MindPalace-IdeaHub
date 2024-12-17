import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js'; 

const Comment = sequelize.define('Comment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    commentedBy: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    commentedOn: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    isApproverComment: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
}, { timestamps: true });

export default Comment;
