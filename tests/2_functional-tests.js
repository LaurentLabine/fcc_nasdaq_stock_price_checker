const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const expect = chai.expect

chai.use(chaiHttp);

function makeTicker(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

 var ticker  = makeTicker(10).toUpperCase()
 var ticker2  = makeTicker(10).toUpperCase()
 var ticker3  = makeTicker(10).toUpperCase()

suite('Functional Tests', function() {
    test('Viewing one stock: GET request to /api/stock-prices/', function(done) {
        chai.request(server)
            .get('/api/stock-prices')
            .query({stock: 'goog'})
            .end((err, res) => {
            assert.equal(res.status, 200);
            expect(res.body).to.have.property("stockData");
            expect(res.body.stockData).to.have.property("stock");
            expect(res.body.stockData).to.have.property("price");
            expect(res.body.stockData).to.have.property("likes");
            done();
        });
    });

    test('Viewing one stock and liking it: GET request to /api/stock-prices/', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock:ticker ,like: true})
        .end((err, res) => {
            assert.equal(res.status, 200);
            expect(res.body).to.have.property("stockData");
            expect(res.body.stockData).to.have.property("stock");
            assert.equal(res.body.stockData.stock, ticker, "Comparing Tickers");
            expect(res.body.stockData).to.have.property("likes");
            assert.equal(res.body.stockData.likes,1)
            done();
        });
    });

    test('Viewing the same stock and liking it again: GET request to /api/stock-prices/', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock:ticker ,like: true})
        .end((err, res) => {
            assert.equal(res.status, 200);
            expect(res.body).to.have.property("stockData");
            expect(res.body.stockData).to.have.property("stock");
            assert.equal(res.body.stockData.stock, ticker, "Comparing Tickers");
            expect(res.body.stockData).to.have.property("likes");
            assert.equal(res.body.stockData.likes,1)
            done();
        });
    });

    test('Viewing two stocks: GET request to /api/stock-prices/', function(done) {
        chai.request(server)
            .get('/api/stock-prices')
            .query({stock:['goog','msft']})
            .end((err, res) => {
                assert.equal(res.status, 200);
                expect(res.body).to.have.property("stockData");
                resArray = res.body.stockData
                resArray.forEach(element => {
                    expect(element).to.have.property("price");
                    expect(element).to.have.property("stock");
                    expect(element).to.have.property("rel_likes");
                });
                assert.equal(res.body.stockData[0].rel_likes, -res.body.stockData[1].rel_likes )
                done();
            });
        });

    test('Viewing two stocks and liking them: GET request to /api/stock-prices/', function(done) {
        
        // var res1
        // var res2
        // var res3
        // var res4
        // var res5
        // var res6

        // const promise1 = chai.request(server)//Get count of likes for ticker2.  Expected to be 0
        // .get('/api/stock-prices')
        // .query({stock:ticker2})
        // .end((err, res) => {
        //     assert.equal(res.status, 200);
        //     res1 = res.body.stockData
        //     expect(res1).to.have.property("stock");
        //     expect(res1).to.have.property("likes");
        //     assert.equal(res1.stock,ticker2,"Ticker's don't match request 1")
        //     assert.equal(res1.likes,0,"Ticker's don't match request 1")
        // })

        // await promise1

        // chai.request(server)
        // .get('/api/stock-prices')
        // .query({stock:ticker3})
        // .end((err, res) => {
        //     assert.equal(res.status, 200);
        //     res2 = res.body.stockData
        //     expect(res2).to.have.property("stock");
        //     expect(res2).to.have.property("likes");
        //     assert.equal(res2.stock,ticker3,"Ticker's don't match request 2")
        //     assert.equal(res2.likes,0,"Ticker's don't match request 1")
        // })

        // chai.request(server)
        // .get('/api/stock-prices')
        // .query({stock:[ticker2,ticker3]})
        // .end((err, res) => {
        //     assert.equal(res.status, 200);
        //     res3 = res.body.stockData
        //     assert.equal(res3.length,2)
        //     expect(res3[0]).to.have.property("stock");
        //     expect(res3[1]).to.have.property("rel_likes");
        //     assert.equal(res3[0].stock,ticker2,"Ticker's item 0 don't match request 3")
        //     assert.equal(res3[1].stock,ticker3,"Ticker's item 1 don't match request 3")
        //     assert.equal(res3[0].rel_likes,0,"Ticker's don't match request 1")
        //     assert.equal(res3[1].rel_likes,0,"Ticker's don't match request 1")
        // })


        chai.request(server)
            .get('/api/stock-prices')
            .query({stock:[ticker2,ticker3],like:true})
            .end((err, res) => {
                assert.equal(res.status, 200);
                res4 = res.body.stockData
                assert.equal(res4.length,2)
                expect(res4[0]).to.have.property("stock");
                expect(res4[1]).to.have.property("rel_likes");
                assert.equal(res4[0].stock,ticker2,"Ticker's item 0 don't match request 3")
                assert.equal(res4[1].stock,ticker3,"Ticker's item 1 don't match request 3")
                assert.equal(res4[0].rel_likes,0,"Ticker's item 0 don't match request 3")
                assert.equal(res4[1].rel_likes,0,"Ticker's item 1 don't match request 3")
                done()
        })

        // chai.request(server)
        // .get('/api/stock-prices')
        // .query({stock:ticker2})
        // .end((err, res) => {
        //     assert.equal(res.status, 200);
        //     res5 = res.body.stockData
        //     expect(res5).to.have.property("stock");
        //     expect(res5).to.have.property("likes");
        //     assert.equal(res5.stock,ticker2,"Ticker's don't match request 1")
        //     console.log(res5)
        //     assert.equal(res5.likes,1,"Ticker's don't match request 1")
        // })

        // chai.request(server)
        // .get('/api/stock-prices')
        // .query({stock:ticker3})
        // .end((err, res) => {
        //     assert.equal(res.status, 200);
        //     res6 = res.body.stockData
        //     expect(res6).to.have.property("stock");
        //     expect(res6).to.have.property("likes");
        //     assert.equal(res6.stock,ticker3,"Ticker's don't match request 2")
        //     assert.equal(res6.likes,1,"Ticker's don't match request 1")
        // })


            // chai.request(server)
            // .get('/api/stock-prices')
            // .query({stock:[ticker2,ticker3],like:true})
            // .end(function(err, res) {
            //     assert.equal(res.status, 200);
            //     resArray = res.body
            //     console.log("Second")
            //     console.log(res.body.stockdata)
                // resArray.forEach(element => {
                //     expect(element).to.have.property("updated_on");
                //     expect(element).to.have.property("assigned_to");
                //     expect(element).to.have.property("open");
                //     expect(element).to.have.property("status_text");
                //     expect(element).to.have.property("_id");
                //     expect(element).to.have.property("issue_title");
                //     expect(element).to.have.property("issue_text");
                //     expect(element).to.have.property("created_by");
                //     expect(element).to.have.property("created_on");
                //     assert.equal(element.open,false)
                //     assert.equal(element.created_by,"bob")
                // });
            // done();
            // });

        });
});
