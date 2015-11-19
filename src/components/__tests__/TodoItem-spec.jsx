jest.dontMock('../TodoItem');
import React from 'react'
import ReactDOM from 'react-dom'
import TestUtils from 'react-addons-test-utils'
import classnames from 'classnames'
import {hash, async, map, updateIn, extra, toJs} from 'con.js'

import TodoTextInput from '../TodoTextInput'
import MainSection from '../MainSection'
import Transdux from '../../../lib/transdux'

const {put, sub, take, chan} = async;

describe('TodoItem', () => {
    it('changes the text after click', () => {
        //var todoItem = TestUtils.renderIntoDocument(
        //    <TodoItem />
        //);
        //
        //var todoItemNode = ReactDOM.findDOMNode(todoItem);
        //expect(todoItemNode.textContent).toEqual('Off');
        //expect(todoItemNode.textContent).toEqual('On');
    });

});

