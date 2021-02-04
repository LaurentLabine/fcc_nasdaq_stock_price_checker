const ax = require('axios');
const request = require('request');
const mongoose = require('mongoose');
const e = require('express');

const stockSchema = new mongoose.Schema({
    ticker: String,
    IP: [String]
    //https://www.tutorialspoint.com/count-number-of-elements-in-an-array-with-mongodb
  });

  const LikedStock = mongoose.model('Stock',stockSchema,"stockchecker")

  function getData(ticker){
    let reqStr = 'https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/' + ticker + '/quote'
    return ax.get(reqStr)
  }

class Stock{
    //takes a ticker and returns the stock's latest price
    //This function is responsible for storing the likes in the database to keep track of them.

    getStock(stock, ipaddr){
        console.log(stock)
      let result = {stockData:{stock: stock.stock}}

      let reqStr = 'https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/' + result.stockData.stock + '/quote'
      

      ax.get(reqStr)
      .then(data => {
        result.stockData.price = data.data.latestPrice
        // console.log("Likes : " + stock.getLikes(result.stockData.stock, ipaddr))
        // console.log("Likes Here : " + this.getLikes(result.stockData.stock, ipaddr))
        result.stockData.likes = this.getLikes(result.stockData.stock, ipaddr)
        console.log(result)
        return result
        })
      .catch(err=> {return console.error(err)})

    }

    getLikes(stock, ipaddr){
        var likes = 0
        LikedStock.findOne({ ticker: stock.ticker }, (err, doc) => {//Start by looking in DB to see if the ticker already has an entry
            if(err) console.error(err)
            if (!doc) {//If not, we add it
                // Create new Entry
                const likedStock = new LikedStock({ticker:stock.ticker, IP: [ipaddr]})
                likedStock.save((err, doc) => {
                    if(err) console.error(err)
                    else{
                        console.log("saved new entry!")
                        likes = 1
                    }
                })
            } else {//If it is found in the list, we validate that the current IP isn<t already int he list
                // if(doc.IP){//Make sure doc.IP exists before using it
                    if(doc.IP.includes(ipaddr)){//IP Already in there so nothing to be done.
                        console.log("WERE HERE WITH " + doc.IP.length + " Likes")
                        likes =  doc.IP.length
                    }
                    else{
                    likedStock.update(//IP Not already in there so we are adding it to the list.
                        {_id:doc._id},
                        {$push:{IP:ipaddr}},
                        (err, doc) => {
                            if(err) console.error(err)
                            else
                            likes = doc.IP.length+1
                        })
                    }
                // }
            }
        })
        console.log("Returning " + likes + " likes")
        return likes
    }
}

module.exports = Stock;