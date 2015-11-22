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

var initState = [0]
for(var i=0;i<1000;i++)
  initState.push(i)

time(function(done){
  function Target(){
    return {
      state: initState,
      context:context,
      setState: function(state){
        this.state=state
        done(state[0])
      },
      constructor: Target
    }
  }
  var target = new Target()
  txmixinClj.bindActions.call(target, {
    increment: function(msg,state){
      return conjs.map(function(m){return msg+1}, state)
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
