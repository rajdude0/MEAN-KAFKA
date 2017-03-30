var kafkanode = require('kafka-node');

var server = require('http').createServer();
var io = require('socket.io')(server);
io.on('connection', function(client){
  console.log('someone has connected');
  client.on('event', function(data){});
  client.on('disconnect', function(){
    console.log('someone has disconnected');
  });
});
server.listen(2120);


function Kafka(){
    this.topic = 'demo';
    var Producer = kafkanode.Producer;
    var Consumer = kafkanode.Consumer;
    this.client = new kafkanode.Client();
    this.producer = new Producer(this.client);
    this.consumer = new Consumer(this.client, [{'topic':this.topic, partition:0}]);
    this.kafkaReady = false;

    this.partition = 0;
    this.producer.on('ready', function(){

        this.kafkaReady = true;
    })
    this.producer.on('error', function(err){
        this.kafkaReady = false;
        console.log('Error:'+err );
    })
}
Kafka.prototype = {
    constructor: Kafka,

    getTopic: function(){
    return this.topic;
    },
    runConsumer: function(){
        this.consumer.on('message', function(message){
            console.log("Consumer:"+message.value);
            io.emit('data', message.value);
        });
    },
    setTopic: function(data){
    this.topic = data;
    },

    produce: function(data, callback){
        var producer = this.getProducer();
       this.createPayload(data, function(payload){
        producer.send(payload, function(err, data){
            callback(err,data);
        })
       })
    },

     getProducer: function(){
        return this.producer;
    },
    createPayload :  function(data, callback){
    payloads = [
        { topic: data.topic, messages:data.msg, partition: 0 }
    ];
    callback(payloads);
    }

}

/*
this.getTopic = function(){
    return this.topic;
}

this.setTopic = function(data){
    this.topic = data;
}

this.produce = function(data, callback){
    this.createPayload(data, function(payload){
        this.producer.send(payload, function(err,data){
            callback(err,data);
        });
    })
}

this.createPayload = function(data, callback){
    payloads = [
        { topic: data.topic, messages:data.msg, partition: 0 }
    ];
 callback(payloads);
}

/*
producer.on('ready', function(){
   producer.send(payloads, function(err,data){
      console.log(data);
   });
});

producer.on('error', function(err){
    console.log('Error: '+err);
})*/

this.Kafka = new Kafka();
this.Kafka.runConsumer();
console.log(this.Kafka);

module.export = this.Kafka;
