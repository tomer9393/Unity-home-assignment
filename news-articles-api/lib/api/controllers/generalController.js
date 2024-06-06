'use strict';

const {APPLICATION_NAME} = require('../../consts');

const getHealth = async (req, res) =>
    res.json({status: 'OK', application: APPLICATION_NAME});

module.exports = {
  getHealth
};
