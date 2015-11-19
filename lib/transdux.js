import {async, map, updateIn, extra, toJs, hash} from 'con.js'
const {put,sub,take,chan, pub} = async
import React from 'react';

export const TxMixin = {
  contextTypes: {
    transduxChannel: React.PropTypes.object,
    transduxPublication: React.PropTypes.object,
  },
  bindActions(actions) {
    extra.each(extra.toClj(actions), ([name,action])=>{
      let tx = map((msg)=>{
        return action(msg.value, this.state)
      });
      let actionChan = chan(1, tx);
      sub(this.context.transduxPublication, hash(this.constructor.toString()+name), actionChan);

      function takeloop(chan, action){
        take(chan).then(action).then(takeloop.bind(null, chan,action))
      };
      takeloop(actionChan, (newstate)=>{
        this.setState(newstate)
      });
    })
  },
  dispatch(where, how, what) {
    put(this.context.transduxChannel,
        {action:hash(where.toString()+how),
         value:what})
      .then(_=>console.info('[transdux] dispatched message' + where, how, what),
            _=>console.error('[transdux ERROR] please check if you props.chan is available \n' + _.message, how, what));
    console.log('[transdux] dispatching message...' +  how, what)
  }
}

const Transdux = React.createClass({
  childContextTypes: {
    transduxChannel: React.PropTypes.object,
    transduxPublication: React.PropTypes.object,
  },
  getChildContext(){
    let inputchan = chan();
    return {
      transduxChannel: inputchan,
      transduxPublication: pub(inputchan, _=>_['action']),
    }
  },
  render(){
    return <div>{this.props.children}</div>
  }
});

export default Transdux
