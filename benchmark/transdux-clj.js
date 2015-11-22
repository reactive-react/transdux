var conjs = require('con.js');
var tx = require('../transdux.js')
var txmixinClj = tx.TxMixinClj
var timer = require('./timer')
var time = timer.time
var CYCLE = timer.CYCLE

var inputChan = conjs.async.chan()
var outputChan = conjs.async.chan()
var context = {
  transduxChannel: inputChan,
    transduxOutput: outputChan,
  transduxPublication: conjs.async.pub(inputChan, function(_){return _['action']}),
}

time(function(done){
  function Target(){
    return {
      state: 0,
      context:context,
      setState: function(state){
        this.state=state
        done(state)
      },
      constructor: Target
    }
  }
  var target = new Target()
  txmixinClj.bindActions.call(target, {
    increment: function(msg,state){
      console.log(state.toString());
      var a = state
      a=a+1
            // a=conjs.map(function(m){return m+1}, state)
      return a
      // return msg+1
    }
  })

  for(var i=0;i<CYCLE+1;i++){
    txmixinClj.dispatch.call(target, Target, 'increment', i)
  }
})
/**
Memory Usage Before: { rss: 43053056, heapTotal: 18550784, heapUsed: 11807800 }
Memory Usage After: { rss: 51732480, heapTotal: 30921984, heapUsed: 21277392 }
Elapsed 108ms
*/
