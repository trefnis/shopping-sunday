'use strict';

module.exports = (sequelize, DataTypes) => {
  const Reminder = sequelize.define('Reminder', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
    },
    daysBefore: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    time: {
      allowNull: false,
      type: DataTypes.TIME,
    },
    remindNotShoppingSunday: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
    },
    remindShoppingSunday: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
    },
    remindHoliday: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
    },
  }, {});
  Reminder.associate = function(models) {
    Reminder.belongsTo(models.Device, { onDelete: 'cascade' });
  };
  return Reminder;
};