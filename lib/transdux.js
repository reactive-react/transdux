import {async, map, updateIn, extra, toJs, hash} from 'con.js'
const {put,sub,take,chan} = async
module.exports = {
  bindActions(actions) {
    extra.each(extra.toClj(actions), ([name,action])=>{
      let tx = map((msg)=>{
        return action(msg.value, this.state)
      });
      let actionChan = chan(1, tx);
      sub(this.props.pub, hash(this.constructor.toString()+name), actionChan);

      function takeloop(chan, action){
        take(chan).then(action).then(takeloop.bind(null, chan,action))
      };
      takeloop(actionChan, (newstate)=>{
        this.setState(newstate)
      });
    })
  },
  dispatch(where, how, what) {
    put(this.props.chan, {action:hash(where.toString()+how), value:what});
  }
}
