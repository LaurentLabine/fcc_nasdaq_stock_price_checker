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

            ////////////////////////////////////////////


    test('Viewing two stocks: GET request to /api/stock-prices/', function(done) {
        chai.request(server)
            .get('/api/stock-prices')
            .query({stock:ticker2})
            .end((err, res) => {
                assert.equal(res.status, 200);
                expect(res.body).to.have.property("stockData");
                res = res.body.stockData
                expect(res).to.have.property("stock");
                expect(res).to.have.property("likes");
                assert.equal(res.likes,0)
                assert.equal(res.stock,ticker2)
            });
        done();
    });

    test('Viewing two stocks: GET request to /api/stock-prices/', function(done) {
        chai.request(server)
            .get('/api/stock-prices')
            .query({stock:ticker3})
            .end((err, res) => {
                assert.equal(res.status, 200);
                expect(res.body).to.have.property("stockData");
                res = res.body.stockData
                expect(res).to.have.property("stock");
                expect(res).to.have.property("likes");
                assert.equal(res.likes,0)
                assert.equal(res.stock,ticker3)
            });
        done();
    });

    test('Viewing two stocks: GET request to /api/stock-prices/', function(done) {
        chai.request(server)
            .get('/api/stock-prices')
            .query({stock:[ticker2,ticker3]})
            .end((err, res) => {
                assert.equal(res.status, 200);
                expect(res.body).to.have.property("stockData");
                resArray = res.body.stockData
                resArray.forEach(element => {
                    expect(element).to.have.property("stock");
                    expect(element).to.have.property("rel_likes");
                    assert.equal(element.rel_likes,0)
                });
            done();
        });
    });


    test('Viewing two stocks: GET request to /api/stock-prices/', function(done) {
        chai.request(server)
            .get('/api/stock-prices')
            .query({stock:[ticker2,ticker3],like:true})
            .end((err, res) => {
                assert.equal(res.status, 200);
                expect(res.body).to.have.property("stockData");
                resArray = res.body.stockData
                resArray.forEach(element => {
                    expect(element).to.have.property("stock");
                    expect(element).to.have.property("rel_likes");
                    assert.equal(element.rel_likes,0)
                });
            done();
        });
    });

    test('Viewing two stocks: GET request to /api/stock-prices/', function(done) {
        chai.request(server)
            .get('/api/stock-prices')
            .query({stock:ticker2})
            .end((err, res) => {
                assert.equal(res.status, 200);
                expect(res.body).to.have.property("stockData");
                res = res.body.stockData
                expect(res).to.have.property("stock");
                expect(res).to.have.property("likes");
                assert.equal(res.likes,1)
            });
        done();
    });

    test('Viewing two stocks: GET request to /api/stock-prices/', function(done) {
        chai.request(server)
            .get('/api/stock-prices')
            .query({stock:ticker3})
            .end((err, res) => {
                assert.equal(res.status, 200);
                expect(res.body).to.have.property("stockData");
                res = res.body.stockData
                expect(res).to.have.property("stock");
                expect(res).to.have.property("likes");
                assert.equal(res.likes,1)
            });
        done();
    });
});