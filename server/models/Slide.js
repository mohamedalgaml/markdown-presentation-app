import { DataTypes } from 'sequelize';
import sequelize from '../sequelize/slidesDB.js';

const Slide = sequelize.define('Slide', {
title: {
type: DataTypes.STRING,
allowNull: false,
validate: {
notEmpty: true,
},
},
content: {
type: DataTypes.TEXT,
allowNull: false,
validate: {
notEmpty: true,
},
},
layout: {
type: DataTypes.STRING,
allowNull: false,
defaultValue: 'default',
validate: {
isIn: [['default', 'title-only', 'code', 'image-focused']],
},
},
order: {
type: DataTypes.INTEGER,
allowNull: false,
defaultValue: 0,
validate: {
min: 0,
},
},
imageUrl: {
type: DataTypes.STRING,
allowNull: true,
},
}, {
tableName: 'Slides',
timestamps: true,
});

export { Slide, sequelize as slidesDB };
