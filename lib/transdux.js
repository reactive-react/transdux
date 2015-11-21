import {async,map} from 'con.js/async';
const {sub,take,put,chan,pub} = async;
import React from 'react';
import uuid from 'uuid';

function genUuid(reactClass){
  reactClass.uuid = reactClass.uuid || uuid.v4();
  return reactClass.uuid;
}

export const TxMixin = {
  contextTypes: {
    transduxChannel: React.PropTypes.object,
    transduxPublication: React.PropTypes.object,
  },
  bindActions(actions) {
    for(let name in actions){
      let tx = map((msg)=>{
        return actions[name](msg.value, this.state)
      });
      let actionChan = chan(1, tx);
      sub(this.context.transduxPublication, genUuid(this.constructor)+name, actionChan);

      function takeloop(chan, action){
        take(chan).then(action).then(takeloop.bind(null, chan,action))
      };
      takeloop(actionChan, (newstate)=>{
        this.setState(newstate)
      });
    }
  },
  dispatch(where, how, what) {
    put(this.context.transduxChannel,
        {action:genUuid(where)+how,
         value:what})
      .then(_=>_, _=>console.error('[transdux ERROR] \n' + _.message, how, what));
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

export default Transdux;
