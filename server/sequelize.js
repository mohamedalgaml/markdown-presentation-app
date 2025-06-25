import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite', 
  logging: false
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
