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

  class StockData{
      constructor(ticker){
          this.stock = ticker
          this.price = 0
          this.likes = 0
      }
  }

class StockHandler{
    constructor(name){
        this.stocksList=[]
    }
    //takes a ticker and returns the stock's latest price
    //This function is responsible for storing the likes in the database to keep track of them.

    async getStock(stock, ipaddr){ //stock object of format : { stock: [ 'goog', 'msft' ], like: 'true' }
        if(Array.isArray(stock.stock))
            stock.stock.forEach(s => {
                this.stocksList.push(new StockData(s.toUpperCase()))
            })
        else
            this.stocksList.push(new StockData(stock.stock.toUpperCase()))

        const promise1 = this.getPrice(this.stocksList[0].stock)
        .then(await this.handleLikes(this.stocksList[0].stock,stock.like,ipaddr))
        await promise1

        if(this.stocksList.length == 2){
            const promise2 = this.getPrice(this.stocksList[1].stock)
            .then(await this.handleLikes(this.stocksList[1].stock,stock.like,ipaddr))
            await promise2
        }

        if(this.stocksList.length == 1)
            return this.stocksList[0]
        else{// if 2 items, replace likes by rel_likes and compute them
            this.stocksList[0].rel_likes = this.stocksList[0].likes-this.stocksList[1].likes
            this.stocksList[1].rel_likes = this.stocksList[1].likes-this.stocksList[0].likes
            delete this.stocksList[0].likes
            delete this.stocksList[1].likes
        }
        return this.stocksList
    }

    async getPrice(ticker){
        let reqStr = 'https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/' + ticker + '/quote'

        await ax.get(reqStr)
        .then(data => {
            this.stocksList.forEach(item => {
                if(item.stock == ticker){
                    item.price = data.data.latestPrice
                }
            })
        })
        .catch(err=> {return console.error(err)})
    }

        async likesCallback(err, doc){//Start by looking in DB to see if the ticker already has an entry
        console.log("here1")
        if(err) console.error(err)
        return doc
        
        }

    async handleLikes(ticker, like, ipaddr){
      // var doc
      var doc = await LikedStock.findOne({ ticker: ticker }, (err, doc) => {
        if(err) console.error(err)
        // return doc
      })

       var likes = 0

      if (!doc) {//If not, we add it
          var ipArr = []// Create new Entry
          if(like){
              ipArr.push(ipaddr) //If the stock has the like parameter we add it it's first like. 
              likes = ipArr.length
              const likedStock = new LikedStock({ticker:ticker, IP: ipArr})
              likedStock.save((err, doc) => {
                  if(err) console.error(err)
              })
          }
      } else if(like){//If it is found in the list, we validate that the current IP isn't already in the IP list
              if(doc.IP.includes(ipaddr)){//IP Already in there so nothing to be done.
                  likes = doc.IP.length
              } else {
              LikedStock.updateOne(//If the IP is Not already in there we add it to the list.
                  {_id:doc._id},
                  {$push:{IP:ipaddr}},
                  (err, doc) => {
                      if(err) console.error(err)
                  })
                  likes = doc.IP.length + 1
              } 
          }else//Nothing to do, return the likes
            likes = doc.IP.length
      this.stocksList.forEach(item => {
          if(item.stock == ticker){
              item.likes = likes
          }
      }) 
    }
}

module.exports = StockHandler;