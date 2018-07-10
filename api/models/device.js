'use strict';

module.exports = (sequelize, DataTypes) => {
  const Device = sequelize.define('Device', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    subscription: { 
      allowNull: false,
      type: DataTypes.JSON,
    },
  }, {});
  return Device;
};