const router = require('koa-router')();
var getRawBody = require('raw-body');

var tool = require('../wechat/tool.js');
var conf = require('../wechat/config.js');
var Token = require('../wechat/token.js');
// 一启动服务的时候就会拿到token
new Token().init();

// ---------------------------------来自微信服务器初次验证验证配置
router.get('/', async(ctx, next) => {
  // 路径解析
  var obj = tool.parseUrl(ctx.url);

  var sha = tool.sha({
    token: conf.wx.token,
    timestamp: obj.timestamp,
    nonce: obj.nonce
  });
  // 加密串和回音
  var signature = obj.signature;

  // 验证不成功
  if (sha != signature) {
    ctx.body = "";
    console.log('>>--配置失败');
  }
  // 验证成功
  else {
    ctx.body = obj.echostr + "";
    console.log('>>--配置成功');

  }
  next();
});

// ------------------------------------微信服务器的回复
router.post('/', async function(ctx, next) {

  // 路径解析
  var obj = tool.parseUrl(ctx.url);

  var sha = tool.sha({
    token: conf.wx.token,
    timestamp: obj.timestamp,
    nonce: obj.nonce
  });
  // 加密串和回音
  var signature = obj.signature;

  // 验证不成功
  if (sha != signature) {
    ctx.body = "";
  }
  // 验证成功
  else {
    // 这个傻逼。我操。
    var data_xml = await getRawBody(ctx.req, {
      length: ctx.request.header['content-length'],
      limit: '1mb',
      encoding: "utf-8"
    });
    // 格式化对象
    var data_f = await tool.xml2js(data_xml);

    // 用户过来的信息再次格式化
    var data = tool.format_data(data_f.xml);

    // 给用户回复的信息
    var echo = await tool.data_to_echo(ctx.url, data);
    
    ctx.res.status = 200;
    ctx.res.type = 'application/xml';
    ctx.body = tool.tpl(echo);
    // next();
  }
})

module.exports = router


// {
//   _readableState: {
//     objectMode: false,
//     highWaterMark: 16384,
//     buffer: BufferList { head: null, tail: null, length: 0 },
//     length: 0,
//     pipes: null,
//     pipesCount: 0,
//     flowing: null,
//     ended: true,
//     endEmitted: false,
//     reading: false,
//     sync: true,
//     needReadable: false,
//     emittedReadable: true,
//     readableListening: false,
//     resumeScheduled: false,
//     defaultEncoding: 'utf8',
//     ranOut: false,
//     awaitDrain: 0,
//     readingMore: true,
//     decoder: null,
//     encoding: null
//   },
//   readable: true,
//   domain: null,
//   _events: {},
//   _eventsCount: 0,
//   _maxListeners: undefined,
//   socket: Socket {
//     connecting: false,
//     _hadError: false,
//     _handle: TCP {
//       bytesRead: 332,
//       _externalStream: {},
//       fd: -1,
//       reading: true,
//       owner: [Circular],
//       onread: [Function: onread],
//       onconnection: null,
//       writeQueueSize: 0,
//       _consumed: true
//     },
//     _parent: null,
//     _host: null,
//     _readableState: ReadableState {
//       objectMode: false,
//       highWaterMark: 16384,
//       buffer: [Object],
//       length: 0,
//       pipes: null,
//       pipesCount: 0,
//       flowing: true,
//       ended: false,
//       endEmitted: false,
//       reading: true,
//       sync: false,
//       needReadable: true,
//       emittedReadable: false,
//       readableListening: false,
//       resumeScheduled: false,
//       defaultEncoding: 'utf8',
//       ranOut: false,
//       awaitDrain: 0,
//       readingMore: false,
//       decoder: null,
//       encoding: null
//     },
//     readable: true,
//     domain: null,
//     _events: {
//       end: [Object],
//       finish: [Function: onSocketFinish],
//       _socketEnd: [Function: onSocketEnd],
//       drain: [Object],
//       timeout: [Function: bound socketOnTimeout],
//       data: [Function: bound socketOnData],
//       error: [Object],
//       close: [Object],
//       resume: [Function: onSocketResume],
//       pause: [Function: onSocketPause]
//     },
//     _eventsCount: 10,
//     _maxListeners: undefined,
//     _writableState: WritableState {
//       objectMode: false,
//       highWaterMark: 16384,
//       needDrain: false,
//       ending: false,
//       ended: false,
//       finished: false,
//       decodeStrings: false,
//       defaultEncoding: 'utf8',
//       length: 0,
//       writing: false,
//       corked: 0,
//       sync: true,
//       bufferProcessing: false,
//       onwrite: [Function: bound onwrite],
//       writecb: null,
//       writelen: 0,
//       bufferedRequest: null,
//       lastBufferedRequest: null,
//       pendingcb: 0,
//       prefinished: false,
//       errorEmitted: false,
//       bufferedRequestCount: 0,
//       corkedRequestsFree: [Object]
//     },
//     writable: true,
//     allowHalfOpen: true,
//     destroyed: false,
//     _bytesDispatched: 0,
//     _sockname: null,
//     _pendingData: null,
//     _pendingEncoding: '',
//     server: Server {
//       domain: null,
//       _events: [Object],
//       _eventsCount: 2,
//       _maxListeners: undefined,
//       _connections: 1,
//       _handle: [Object],
//       _usingSlaves: false,
//       _slaves: [],
//       _unref: false,
//       allowHalfOpen: true,
//       pauseOnConnect: false,
//       httpAllowHalfOpen: false,
//       timeout: 120000,
//       _pendingResponseData: 0,
//       maxHeadersCount: null,
//       _connectionKey: '6::::1234'
//     },
//     _server: Server {
//       domain: null,
//       _events: [Object],
//       _eventsCount: 2,
//       _maxListeners: undefined,
//       _connections: 1,
//       _handle: [Object],
//       _usingSlaves: false,
//       _slaves: [],
//       _unref: false,
//       allowHalfOpen: true,
//       pauseOnConnect: false,
//       httpAllowHalfOpen: false,
//       timeout: 120000,
//       _pendingResponseData: 0,
//       maxHeadersCount: null,
//       _connectionKey: '6::::1234'
//     },
//     _idleTimeout: 120000,
//     _idleNext: TimersList {
//       _idleNext: [Circular],
//       _idlePrev: [Circular],
//       _timer: [Object],
//       _unrefed: true,
//       msecs: 120000,
//       nextTick: false
//     },
//     _idlePrev: TimersList {
//       _idleNext: [Circular],
//       _idlePrev: [Circular],
//       _timer: [Object],
//       _unrefed: true,
//       msecs: 120000,
//       nextTick: false
//     },
//     _idleStart: 3988,
//     parser: HTTPParser {
//       '0': [Function: parserOnHeaders],
//       '1': [Function: parserOnHeadersComplete],
//       '2': [Function: parserOnBody],
//       '3': [Function: parserOnMessageComplete],
//       '4': [Function: bound onParserExecute],
//       _headers: [],
//       _url: '',
//       _consumed: true,
//       socket: [Circular],
//       incoming: [Circular],
//       outgoing: null,
//       maxHeaderPairs: 2000,
//       onIncoming: [Function: bound parserOnIncoming]
//     },
//     on: [Function: socketOnWrap],
//     _paused: false,
//     read: [Function],
//     _consuming: true,
//     _httpMessage: ServerResponse {
//       domain: null,
//       _events: [Object],
//       _eventsCount: 2,
//       _maxListeners: undefined,
//       output: [],
//       outputEncodings: [],
//       outputCallbacks: [],
//       outputSize: 0,
//       writable: true,
//       _last: false,
//       upgrading: false,
//       chunkedEncoding: false,
//       shouldKeepAlive: true,
//       useChunkedEncodingByDefault: false,
//       sendDate: true,
//       _removedHeader: {},
//       _contentLength: null,
//       _hasBody: true,
//       _trailer: '',
//       finished: false,
//       _headerSent: false,
//       socket: [Circular],
//       connection: [Circular],
//       _header: null,
//       _headers: null,
//       _headerNames: {},
//       _onPendingData: [Function: bound updateOutgoingData],
//       _sent100: false,
//       _expect_continue: false,
//       statusCode: 404,
//       __onFinished: [Object]
//     },
//     _peername: { address: '::ffff:127.0.0.1', family: 'IPv6', port: 13192 }
//   },
//   connection: Socket {
//     connecting: false,
//     _hadError: false,
//     _handle: TCP {
//       bytesRead: 332,
//       _externalStream: {},
//       fd: -1,
//       reading: true,
//       owner: [Circular],
//       onread: [Function: onread],
//       onconnection: null,
//       writeQueueSize: 0,
//       _consumed: true
//     },
//     _parent: null,
//     _host: null,
//     _readableState: ReadableState {
//       objectMode: false,
//       highWaterMark: 16384,
//       buffer: [Object],
//       length: 0,
//       pipes: null,
//       pipesCount: 0,
//       flowing: true,
//       ended: false,
//       endEmitted: false,
//       reading: true,
//       sync: false,
//       needReadable: true,
//       emittedReadable: false,
//       readableListening: false,
//       resumeScheduled: false,
//       defaultEncoding: 'utf8',
//       ranOut: false,
//       awaitDrain: 0,
//       readingMore: false,
//       decoder: null,
//       encoding: null
//     },
//     readable: true,
//     domain: null,
//     _events: {
//       end: [Object],
//       finish: [Function: onSocketFinish],
//       _socketEnd: [Function: onSocketEnd],
//       drain: [Object],
//       timeout: [Function: bound socketOnTimeout],
//       data: [Function: bound socketOnData],
//       error: [Object],
//       close: [Object],
//       resume: [Function: onSocketResume],
//       pause: [Function: onSocketPause]
//     },
//     _eventsCount: 10,
//     _maxListeners: undefined,
//     _writableState: WritableState {
//       objectMode: false,
//       highWaterMark: 16384,
//       needDrain: false,
//       ending: false,
//       ended: false,
//       finished: false,
//       decodeStrings: false,
//       defaultEncoding: 'utf8',
//       length: 0,
//       writing: false,
//       corked: 0,
//       sync: true,
//       bufferProcessing: false,
//       onwrite: [Function: bound onwrite],
//       writecb: null,
//       writelen: 0,
//       bufferedRequest: null,
//       lastBufferedRequest: null,
//       pendingcb: 0,
//       prefinished: false,
//       errorEmitted: false,
//       bufferedRequestCount: 0,
//       corkedRequestsFree: [Object]
//     },
//     writable: true,
//     allowHalfOpen: true,
//     destroyed: false,
//     _bytesDispatched: 0,
//     _sockname: null,
//     _pendingData: null,
//     _pendingEncoding: '',
//     server: Server {
//       domain: null,
//       _events: [Object],
//       _eventsCount: 2,
//       _maxListeners: undefined,
//       _connections: 1,
//       _handle: [Object],
//       _usingSlaves: false,
//       _slaves: [],
//       _unref: false,
//       allowHalfOpen: true,
//       pauseOnConnect: false,
//       httpAllowHalfOpen: false,
//       timeout: 120000,
//       _pendingResponseData: 0,
//       maxHeadersCount: null,
//       _connectionKey: '6::::1234'
//     },
//     _server: Server {
//       domain: null,
//       _events: [Object],
//       _eventsCount: 2,
//       _maxListeners: undefined,
//       _connections: 1,
//       _handle: [Object],
//       _usingSlaves: false,
//       _slaves: [],
//       _unref: false,
//       allowHalfOpen: true,
//       pauseOnConnect: false,
//       httpAllowHalfOpen: false,
//       timeout: 120000,
//       _pendingResponseData: 0,
//       maxHeadersCount: null,
//       _connectionKey: '6::::1234'
//     },
//     _idleTimeout: 120000,
//     _idleNext: TimersList {
//       _idleNext: [Circular],
//       _idlePrev: [Circular],
//       _timer: [Object],
//       _unrefed: true,
//       msecs: 120000,
//       nextTick: false
//     },
//     _idlePrev: TimersList {
//       _idleNext: [Circular],
//       _idlePrev: [Circular],
//       _timer: [Object],
//       _unrefed: true,
//       msecs: 120000,
//       nextTick: false
//     },
//     _idleStart: 3988,
//     parser: HTTPParser {
//       '0': [Function: parserOnHeaders],
//       '1': [Function: parserOnHeadersComplete],
//       '2': [Function: parserOnBody],
//       '3': [Function: parserOnMessageComplete],
//       '4': [Function: bound onParserExecute],
//       _headers: [],
//       _url: '',
//       _consumed: true,
//       socket: [Circular],
//       incoming: [Circular],
//       outgoing: null,
//       maxHeaderPairs: 2000,
//       onIncoming: [Function: bound parserOnIncoming]
//     },
//     on: [Function: socketOnWrap],
//     _paused: false,
//     read: [Function],
//     _consuming: true,
//     _httpMessage: ServerResponse {
//       domain: null,
//       _events: [Object],
//       _eventsCount: 2,
//       _maxListeners: undefined,
//       output: [],
//       outputEncodings: [],
//       outputCallbacks: [],
//       outputSize: 0,
//       writable: true,
//       _last: false,
//       upgrading: false,
//       chunkedEncoding: false,
//       shouldKeepAlive: true,
//       useChunkedEncodingByDefault: false,
//       sendDate: true,
//       _removedHeader: {},
//       _contentLength: null,
//       _hasBody: true,
//       _trailer: '',
//       finished: false,
//       _headerSent: false,
//       socket: [Circular],
//       connection: [Circular],
//       _header: null,
//       _headers: null,
//       _headerNames: {},
//       _onPendingData: [Function: bound updateOutgoingData],
//       _sent100: false,
//       _expect_continue: false,
//       statusCode: 404,
//       __onFinished: [Object]
//     },
//     _peername: { address: '::ffff:127.0.0.1', family: 'IPv6', port: 13192 }
//   },
//   httpVersionMajor: 1,
//   httpVersionMinor: 0,
//   httpVersion: '1.0',
//   complete: true,
//   headers: {
//     'x-forwarded-for': '::ffff:103.7.30.106',
//     'x-forwarded-proto': 'https',
//     'x-pagekite-port': '443',
//     'user-agent': 'Mozilla/4.0',
//     accept: '*/*',
//     host: 'arminc.pagekite.me:443',
//     pragma: 'no-cache',
//     connection: 'Keep-Alive'
//   },
//   rawHeaders: ['X-Forwarded-For',
//     '::ffff:103.7.30.106',
//     'X-Forwarded-Proto',
//     'https',
//     'X-PageKite-Port',
//     '443',
//     'User-Agent',
//     'Mozilla/4.0',
//     'Accept',
//     '*/*',
//     'Host',
//     'arminc.pagekite.me:443',
//     'Pragma',
//     'no-cache',
//     'Connection',
//     'Keep-Alive'
//   ],
//   trailers: {},
//   rawTrailers: [],
//   upgrade: false,
//   url: '/?signature=7fe4606ee92c5e11e64f6652809420f52fd682e8&echostr=14462911741965762174&timestamp=1504837246&nonce=1455098669',
//   method: 'GET',
//   statusCode: null,
//   statusMessage: null,
//   client: Socket {
//     connecting: false,
//     _hadError: false,
//     _handle: TCP {
//       bytesRead: 332,
//       _externalStream: {},
//       fd: -1,
//       reading: true,
//       owner: [Circular],
//       onread: [Function: onread],
//       onconnection: null,
//       writeQueueSize: 0,
//       _consumed: true
//     },
//     _parent: null,
//     _host: null,
//     _readableState: ReadableState {
//       objectMode: false,
//       highWaterMark: 16384,
//       buffer: [Object],
//       length: 0,
//       pipes: null,
//       pipesCount: 0,
//       flowing: true,
//       ended: false,
//       endEmitted: false,
//       reading: true,
//       sync: false,
//       needReadable: true,
//       emittedReadable: false,
//       readableListening: false,
//       resumeScheduled: false,
//       defaultEncoding: 'utf8',
//       ranOut: false,
//       awaitDrain: 0,
//       readingMore: false,
//       decoder: null,
//       encoding: null
//     },
//     readable: true,
//     domain: null,
//     _events: {
//       end: [Object],
//       finish: [Function: onSocketFinish],
//       _socketEnd: [Function: onSocketEnd],
//       drain: [Object],
//       timeout: [Function: bound socketOnTimeout],
//       data: [Function: bound socketOnData],
//       error: [Object],
//       close: [Object],
//       resume: [Function: onSocketResume],
//       pause: [Function: onSocketPause]
//     },
//     _eventsCount: 10,
//     _maxListeners: undefined,
//     _writableState: WritableState {
//       objectMode: false,
//       highWaterMark: 16384,
//       needDrain: false,
//       ending: false,
//       ended: false,
//       finished: false,
//       decodeStrings: false,
//       defaultEncoding: 'utf8',
//       length: 0,
//       writing: false,
//       corked: 0,
//       sync: true,
//       bufferProcessing: false,
//       onwrite: [Function: bound onwrite],
//       writecb: null,
//       writelen: 0,
//       bufferedRequest: null,
//       lastBufferedRequest: null,
//       pendingcb: 0,
//       prefinished: false,
//       errorEmitted: false,
//       bufferedRequestCount: 0,
//       corkedRequestsFree: [Object]
//     },
//     writable: true,
//     allowHalfOpen: true,
//     destroyed: false,
//     _bytesDispatched: 0,
//     _sockname: null,
//     _pendingData: null,
//     _pendingEncoding: '',
//     server: Server {
//       domain: null,
//       _events: [Object],
//       _eventsCount: 2,
//       _maxListeners: undefined,
//       _connections: 1,
//       _handle: [Object],
//       _usingSlaves: false,
//       _slaves: [],
//       _unref: false,
//       allowHalfOpen: true,
//       pauseOnConnect: false,
//       httpAllowHalfOpen: false,
//       timeout: 120000,
//       _pendingResponseData: 0,
//       maxHeadersCount: null,
//       _connectionKey: '6::::1234'
//     },
//     _server: Server {
//       domain: null,
//       _events: [Object],
//       _eventsCount: 2,
//       _maxListeners: undefined,
//       _connections: 1,
//       _handle: [Object],
//       _usingSlaves: false,
//       _slaves: [],
//       _unref: false,
//       allowHalfOpen: true,
//       pauseOnConnect: false,
//       httpAllowHalfOpen: false,
//       timeout: 120000,
//       _pendingResponseData: 0,
//       maxHeadersCount: null,
//       _connectionKey: '6::::1234'
//     },
//     _idleTimeout: 120000,
//     _idleNext: TimersList {
//       _idleNext: [Circular],
//       _idlePrev: [Circular],
//       _timer: [Object],
//       _unrefed: true,
//       msecs: 120000,
//       nextTick: false
//     },
//     _idlePrev: TimersList {
//       _idleNext: [Circular],
//       _idlePrev: [Circular],
//       _timer: [Object],
//       _unrefed: true,
//       msecs: 120000,
//       nextTick: false
//     },
//     _idleStart: 3988,
//     parser: HTTPParser {
//       '0': [Function: parserOnHeaders],
//       '1': [Function: parserOnHeadersComplete],
//       '2': [Function: parserOnBody],
//       '3': [Function: parserOnMessageComplete],
//       '4': [Function: bound onParserExecute],
//       _headers: [],
//       _url: '',
//       _consumed: true,
//       socket: [Circular],
//       incoming: [Circular],
//       outgoing: null,
//       maxHeaderPairs: 2000,
//       onIncoming: [Function: bound parserOnIncoming]
//     },
//     on: [Function: socketOnWrap],
//     _paused: false,
//     read: [Function],
//     _consuming: true,
//     _httpMessage: ServerResponse {
//       domain: null,
//       _events: [Object],
//       _eventsCount: 2,
//       _maxListeners: undefined,
//       output: [],
//       outputEncodings: [],
//       outputCallbacks: [],
//       outputSize: 0,
//       writable: true,
//       _last: false,
//       upgrading: false,
//       chunkedEncoding: false,
//       shouldKeepAlive: true,
//       useChunkedEncodingByDefault: false,
//       sendDate: true,
//       _removedHeader: {},
//       _contentLength: null,
//       _hasBody: true,
//       _trailer: '',
//       finished: false,
//       _headerSent: false,
//       socket: [Circular],
//       connection: [Circular],
//       _header: null,
//       _headers: null,
//       _headerNames: {},
//       _onPendingData: [Function: bound updateOutgoingData],
//       _sent100: false,
//       _expect_continue: false,
//       statusCode: 404,
//       __onFinished: [Object]
//     },
//     _peername: { address: '::ffff:127.0.0.1', family: 'IPv6', port: 13192 }
//   },
//   _consuming: false,
//   _dumped: false,
//   _parsedUrl: Url {
//     protocol: null,
//     slashes: null,
//     auth: null,
//     host: null,
//     port: null,
//     hostname: null,
//     hash: null,
//     search: '?signature=7fe4606ee92c5e11e64f6652809420f52fd682e8&echostr=14462911741965762174&timestamp=1504837246&nonce=1455098669',
//     query: 'signature=7fe4606ee92c5e11e64f6652809420f52fd682e8&echostr=14462911741965762174&timestamp=1504837246&nonce=1455098669',
//     pathname: '/',
//     path: '/?signature=7fe4606ee92c5e11e64f6652809420f52fd682e8&echostr=14462911741965762174&timestamp=1504837246&nonce=1455098669',
//     href: '/?signature=7fe4606ee92c5e11e64f6652809420f52fd682e8&echostr=14462911741965762174&timestamp=1504837246&nonce=1455098669',
//     _raw: '/?signature=7fe4606ee92c5e11e64f6652809420f52fd682e8&echostr=14462911741965762174&timestamp=1504837246&nonce=1455098669'
//   }
// }
