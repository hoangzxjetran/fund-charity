'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class VolunteerStatus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      VolunteerStatus.hasMany(models.VolunteerRegistration, { foreignKey: 'status' });
    }
  }
  VolunteerStatus.init({
    statusId: DataTypes.INTEGER,
    statusName: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'VolunteerStatus',
  });
  return VolunteerStatus;
};