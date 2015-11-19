'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TxMixin = undefined;

var _con = require('con.js');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var put = _con.async.put;
var sub = _con.async.sub;
var take = _con.async.take;
var chan = _con.async.chan;
var pub = _con.async.pub;

function genUuid(reactClass) {
  reactClass.uuid = reactClass.uuid || _uuid2.default.v4();
  return reactClass.uuid;
}

var TxMixin = exports.TxMixin = {
  contextTypes: {
    transduxChannel: _react2.default.PropTypes.object,
    transduxPublication: _react2.default.PropTypes.object
  },
  bindActions: function bindActions(actions) {
    var _this = this;

    _con.extra.each(_con.extra.toClj(actions), function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2);

      var name = _ref2[0];
      var action = _ref2[1];

      var tx = (0, _con.map)(function (msg) {
        return action(msg.value, _this.state);
      });
      var actionChan = chan(1, tx);
      sub(_this.context.transduxPublication, genUuid(_this.constructor) + name, actionChan);

      function takeloop(chan, action) {
        take(chan).then(action).then(takeloop.bind(null, chan, action));
      };
      takeloop(actionChan, function (newstate) {
        _this.setState(newstate);
      });
    });
  },
  dispatch: function dispatch(where, how, what) {
    put(this.context.transduxChannel, { action: genUuid(where) + how,
      value: what }).then(function (_) {
      return console.info('[transdux] dispatched message' + genUuid(where), how, what);
    }, function (_) {
      return console.error('[transdux ERROR] \n' + _.message, how, what);
    });
    console.log('[transdux] dispatching message...' + how, what);
  }
};

var Transdux = _react2.default.createClass({
  childContextTypes: {
    transduxChannel: _react2.default.PropTypes.object,
    transduxPublication: _react2.default.PropTypes.object
  },
  getChildContext: function getChildContext() {
    var inputchan = chan();
    return {
      transduxChannel: inputchan,
      transduxPublication: pub(inputchan, function (_) {
        return _['action'];
      })
    };
  },
  render: function render() {
    return _react2.default.createElement(
      'div',
      null,
      this.props.children
    );
  }
});

exports.default = Transdux;

