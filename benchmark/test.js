var Benchmark = require('benchmark');
var suite = new Benchmark.Suite;
var conjs = require('con.js');
var tx = require('../transdux.js').TxMixin
// Maximal 1024 per channel
var CYCLE = 1023
function time(f) {
  console.log('Memory Usage Before:', process.memoryUsage())
  var s = new Date();
  f(function(index){
    if(index==CYCLE){
      console.log('Memory Usage After:', process.memoryUsage())
      console.log("Elapsed "+((new Date()).valueOf()-s.valueOf())+"ms");
    }

  });
}
var inputChan = conjs.async.chan()
var context = {
  transduxChannel: inputChan,
  transduxPublication: conjs.async.pub(inputChan, function(_){return _['action']}),
}

time(function(done){
  function Target(){
    return {
      context:context,
      setState: function(index){done(index)},
      constructor: Target
    }
  }
  var target = new Target()
  tx.bindActions.call(target, {
    complete: function(msg,state){
      return msg
    }
  })

  for(var i=0;i<CYCLE+1;i++){
    tx.dispatch.call(target, Target, 'complete', i)
  }
})
/**
Memory Usage Before: { rss: 45805568, heapTotal: 17518848, heapUsed: 12665456 }
Memory Usage After: { rss: 45764608, heapTotal: 29890048, heapUsed: 13124152 }
Elapsed 83ms
*/




// time(function(done){
//   var i =0
//   while(i!=CYCLE){
//     i++
//     setTimeout(function(){done()}, 0)
//   }
//   setTimeout(function(){done(CYCLE),0})
// })
/**
Memory Usage Before: { rss: 45432832, heapTotal: 17518848, heapUsed: 12664416 }
Memory Usage After: { rss: 46772224, heapTotal: 19570688, heapUsed: 10927824 }
Elapsed 7ms
*/
