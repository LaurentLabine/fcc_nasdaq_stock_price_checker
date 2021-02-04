'use strict';

const stockController = require('../controllers/stock.js')
const ax = require('axios')

module.exports = function (app) {

  const stock = new stockController;

  app.route('/api/stock-prices')
    .get(function (req, res){

      let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

      stock.getStock(req.query, ip).then(result=>res.json(res))
      // let result = {stockData:{stock: req.query.stock}}
      // let reqStr = 'https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/' + req.query.stock + '/quote'
      // let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

      // ax.get(reqStr)
      // .then(data => {
      //   result.stockData.price = data.data.latestPrice
      //   console.log("Likes : " + stock.getLikes(result.stockData.stock, ip))
      //   result.stockData.likes = stock.getLikes(result.stockData.stock, ip)
      //   return res.json(result)
      //   })
      // .catch(err=> {return console.error(err)})
    });
};
