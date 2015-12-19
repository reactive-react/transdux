import {async,map} from 'con.js/async';
const {sub,observe,put,put$,chan,pub,pipeline} = async;
import React from 'react';
import uuid from 'uuid';

function genUuid(reactClass){
  reactClass.uuid = reactClass.uuid || uuid.v4();
  return reactClass.uuid;
}
const id = _=>_;

export const TxMixin = {
  contextTypes: {
    transduxChannel: React.PropTypes.object,
    transduxPublication: React.PropTypes.object,
  },
  bindActions(actions, imm=id, unimm=id) {
    for(let name in actions){
      let tx = map((msg)=>{
        this.setState((prevState, props)=>{
          return unimm(actions[name].call(this, msg.value, imm(prevState), imm(props)));
        });
        return this.state
      });
      let actionChan = chan(32,tx);
      sub(this.context.transduxPublication, genUuid(this.constructor)+name, actionChan);
      observe(actionChan, (newstate)=>{});
    }
  },
  dispatch(where, how, what) {
    put(this.context.transduxChannel,
        {action:genUuid(where)+how,
         value:what})
      .then(id,_=>console.log('[Error] dispatching:'+what))
  }
}

export function mixin(reactClass) {
  reactClass.contextTypes = TxMixin.contextTypes;
  for (let name in TxMixin) {
    if(name!='contextTypes')
      reactClass.prototype[name] = TxMixin[name];
  }
  return reactClass
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
