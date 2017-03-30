var express = require('express');
var kafka = require('../kafka/kafka').Kafka;
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
    console.log("\n");
    console.log(kafka);
    console.log(kafka.getTopic());
  res.render('index', { title: 'Message Queue' });

});
router.get('/helo', function(req, res, next){
  res.send('hello');
})
router.post('/produce', function(req, res, next){
    console.log(req.body);
    kafka.produce({'topic':kafka.getTopic(),msg:req.body.data}, function(err, data){
       if(err)
           console.log("Error occurred while producing");
        console.log("Data Sent"+ data);
        res.status(200);
        res.send(data);
    });
})

module.exports = router;
