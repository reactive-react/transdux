jest.dontMock('../transdux.js');
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

const {default:Transdux, TxMixin} = require('../transdux')

  describe('transdux', () => {
    describe('todo dispatch', ()=>{
      let todolist;
      let Todo = React.createClass({
        render(){
          return <div className={'todo-'+this.props.id} key={this.props.id} data-complete={this.props.done}>{this.props.text}</div>
        }
      });
      let TodoList = React.createClass({
        mixins: [TxMixin],
        getInitialState(){
          return {
            todos: [
              {id:1, text:'hehe',done:false},
              {id:2, text:'heheda',done:false},
            ]
          }
        },
        componentDidMount(){
          this.bindActions({
            complete(msg, state){
              return {
                todos: state.todos.map(todo=>{
                  if(todo.id==msg){
                    todo.done=!todo.done
                  }
                  return todo
                })
              }
            }
          })
        },
        render(){
          console.log('render:',this.state.todos);
          let todos = this.state.todos.map(todo=>{
            return <Todo {...todo}/>
          })
          return <div>{todos}</div>
        }
      });
      let Buttons = React.createClass({
        mixins: [TxMixin],
        render(){
          return (
            <div>
                <button className="btn-complete" onClick={_=>this.dispatch(TodoList, 'complete', 1)} >complete</button>
                <button className="btn-change-color" onClick={_=>this.dispatch(Todo, 'colorChange',"red")}>color change</button>
            </div>)
        }   
      });

      beforeEach(()=>{
        todolist = TestUtils.renderIntoDocument(
          <Transdux>
              <TodoList />
             <Buttons />
          </Transdux>
        )
      });

      it('click complete buttom will complete', () => {
   //     expect(TestUtils.findRenderedDOMComponentWithClass(todolist, 'todo-1').props['data-complete']).toBe(false);
        TestUtils.Simulate.click(TestUtils.findRenderedDOMComponentWithClass(todolist, 'btn-complete'));
        jest.runAllTimers();
        jest.runAllTicks();
        expect(TestUtils.scryRenderedComponentsWithType(todolist, Todo)[0].props.done).toBe(true);
      });
    })
  });
