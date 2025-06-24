
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
  dialect: 'sqlite',              
  storage: './slides.db',   
  logging: false,                 
  define: {
    timestamps: true,             
    freezeTableName: true     
  }
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully');

    await sequelize.sync(); 
    console.log('✅ All models synchronized successfully');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);

    if (sequelize) {
      await sequelize.close();
      console.log('🛑 Database connection closed due to error');
    }
  }
})();

export default sequelize;
