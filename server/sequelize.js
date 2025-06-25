import { Sequelize, DataTypes } from 'sequelize';
import pkg from 'better-sqlite3';
const betterSqlite3 = pkg;

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite', // استخدم هذا فقط
  logging: false,
  dialectModule: betterSqlite3
});

const Slide = sequelize.define('Slide', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { notEmpty: true },
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: { notEmpty: true },
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
    validate: { min: 0 },
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

export { sequelize, Slide };
