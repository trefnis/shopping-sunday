'use strict';

const db = require('../models');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return db.sequelize.sync();
  },

  down: (queryInterface, Sequelize) => {
    return db.sequelize.drop();
  }
};
