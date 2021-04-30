const libs = [
  'lib/fs.js',
  'lib/loop.js',
  'lib/path.js',
  'lib/process.js',
  'lib/build.js',
  'lib/repl.js',
  'lib/configure.js',
  'lib/acorn.js',
  'lib/websocket.js',
  'lib/inspector.js'
]

const version = stealify.version.stealify
const v8flags = '--stack-trace-limit=10 --use-strict --disallow-code-generation-from-strings'
const debug = true
const capabilities = [] // list of allowed internal modules, api calls etc. TBD

const modules = [{
  name: 'sys',
  obj: [
    'modules/sys/sys.o'
  ],
  lib: ['dl', 'rt']
}, {
  name: 'sha1',
  obj: [
    'modules/sha1/sha1.o'
  ]
}, {
  name: 'encode',
  obj: [
    'modules/encode/encode.o'
  ]
}, {
  name: 'fs',
  obj: [
    'modules/fs/fs.o'
  ]
}, {
  name: 'inspector',
  obj: [
    'modules/inspector/inspector.o'
  ]
}, {
  name: 'net',
  obj: [
    'modules/net/net.o'
  ]
}, {
  name: 'http',
  obj: [
    'modules/http/http.o',
    'modules/http/picohttpparser.o'
  ]
}, {
  name: 'vm',
  obj: [
    'modules/vm/vm.o'
  ]
}, {
  name: 'epoll',
  obj: [
    'modules/epoll/epoll.o'
  ]
}]

const embeds = [
  'stealify.cc',
  'Makefile',
  'main.cc',
  'stealify.h',
  'stealify.js',
  'config.js'
]

const target = 'stealify'
const main = 'stealify.js'

module.exports = { version, libs, modules, capabilities, target, main, v8flags, embeds, static: false, debug }
