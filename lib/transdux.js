import {async,map} from 'con.js/async';
import {toJs,toClj} from 'con.js';
const {sub,observe,put,put$,chan,pub,pipeline,swap,atom} = async;
import React from 'react';
import uuid from 'uuid';

function genUuid(reactClass){
  reactClass.uuid = reactClass.uuid || uuid.v4();
  return reactClass.uuid;
}
const id = _=>_;
function bindActions(imm, unimm) {
  return function(actions){
    for(let name in actions){
      let tx = map((msg)=>{
        return actions[name](msg.value, imm(this.state))
      });
      let actionChan = chan();
      sub(this.context.transduxPublication, genUuid(this.constructor)+name, actionChan);
      pipeline(1, this.context.transduxOutput, tx, actionChan)
      observe(this.context.transduxOutput, (newstate)=>{
        this.setState(unimm(newstate))
      });
    }
  }
}
export const TxMixin = {
  contextTypes: {
    transduxChannel: React.PropTypes.object,
    transduxPublication: React.PropTypes.object,
    transduxOutput: React.PropTypes.object,
  },
  bindActions: bindActions(id,id),
  dispatch(where, how, what) {
    put(this.context.transduxChannel,
        {action:genUuid(where)+how,
         value:what}).then(id,_=>console.log('[Error] dispatching:'+what))

  }
}

export const TxMixinClj = {
  constexTypes: TxMixin.contextTypes,
  bindActions: bindActions(toClj,toJs),
  dispatch:TxMixin.dispatch,
}

const Transdux = React.createClass({
  childContextTypes: {
    transduxChannel: React.PropTypes.object,
    transduxPublication: React.PropTypes.object,
  },
  getChildContext(){
    let inputchan = chan();
    let outputchan = chan();
    return {
      transduxChannel: inputchan,
      transduxOutput: outputchan,
      transduxPublication: pub(inputchan, _=>_['action']),
    }
  },
  render(){
    return <div>{this.props.children}</div>
  }
});

export default Transdux;
