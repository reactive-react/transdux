import {async, map, updateIn, extra, toJs, hash} from 'con.js'
const {put,sub,take,chan} = async
module.exports = {
  bindActions(actions, reactclass) {
    extra.each(extra.toClj(actions), ([name,action])=>{
      let tx = map((msg)=>{
        return toJs(action(msg.value, extra.toClj(this.state)))
      });
      let actionChan = chan(1, tx);
      sub(this.props.pub, hash(reactclass.toString()+name), actionChan);
      
      function takeloop(chan, action){
        take(chan).then(action).then(takeloop.bind(null, chan,action))
      };
      takeloop(actionChan, (newtodos)=>{
        this.setState({todos: newtodos})
      });
    })
  },
  dispatch(where, how, what) {
    put(this.props.chan, {action:hash(where.toString()+how), value:what});
  }
}
