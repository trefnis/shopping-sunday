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

  Device.associate = models => {
    Device.hasMany(models.Reminder, {
      as: 'reminders',
      foreignKey: 'deviceId',
      onDelete: 'cascade',
      hooks: true,
    });
  }
  
  return Device;
};