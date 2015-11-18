import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import TodoTextInput from './TodoTextInput'
import {async, map, updateIn, extra, toJs} from 'con.js'
const {put,sub,take,chan} = async
class TodoItem extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      editing: false,
      todo: this.props.todo
    }
  }

  componentDidMount(){
    function complete(msg){
      return state=>updateIn(state, ['completed'], _=>!_)
    }
    let tx = map((msg)=>{
      return toJs(complete(msg)(extra.toClj(this.state.todo)))
    })
    let completeChan = chan(1, tx);
    sub(this.props.pub, "TodoItem.complete", completeChan);
    function takeloop(chan, action){
      take(chan).then(action).then(takeloop.bind(null, chan,action))
    }
    takeloop(completeChan, (newtodo)=>{
      this.setState({todo: newtodo})
    })
  }
  handleDoubleClick() {
    this.setState({ editing: true })
  }

  handleSave(id, text) {
    if (text.length === 0) {
      this.props.deleteTodo(id)
    } else {
      this.props.editTodo(id, text)
    }
    this.setState({ editing: false })
  }

  render() {
    const { chan } = this.props
    let {todo} = this.state

    let element
    if (this.state.editing) {
      element = (
        <TodoTextInput text={todo.text}
                       editing={this.state.editing}
                       onSave={(text) => this.handleSave(todo.id, text)} />
      )
    } else {
      element = (
        <div className="view">
          <input className="toggle"
                 type="checkbox"
                 checked={todo.completed}
                 onChange={() => put(this.props.chan, {action:'TodoItem.complete', id:todo.id})} />
          <label onDoubleClick={this.handleDoubleClick.bind(this)}>
            {todo.text}
          </label>
          <button className="destroy"
                  onClick={() => deleteTodo(todo.id)} />
        </div>
      )
    }

    return (
      <li className={classnames({
        completed: todo.completed,
        editing: this.state.editing
      })}>
        {element}
      </li>
    )
  }
}

TodoItem.propTypes = {
  todo: PropTypes.object.isRequired,
  editTodo: PropTypes.func.isRequired,
  deleteTodo: PropTypes.func.isRequired,
  completeTodo: PropTypes.func.isRequired
}

export default TodoItem
