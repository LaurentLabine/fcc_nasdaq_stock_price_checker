'use strict';

const stockHandler = require('../controllers/stock.js')
const ax = require('axios')

module.exports = function (app) {



  app.route('/api/stock-prices')
    .get(function (req, res){
      let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      const handler = new stockHandler()
      //https://www.digitalocean.com/community/tutorials/javascript-promises-for-dummies
      handler.getStock(req.query, ip).then(result => res.json({stockData: result}))//When promise fulfills.
    });
};
