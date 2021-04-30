const { join, baseName } = require('path')
const _require = global.require

function loadSymbolFile (handle, path) {
  path = path.replace(/[./]/g, '_')
  const start = stealify.sys.dlsym(handle, `_binary_${path}_start`)
  if (!start) return
  const end = stealify.sys.dlsym(handle, `_binary_${path}_end`)
  if (!end) return
  return stealify.sys.readMemory(start, end)
}

function requireInternal (...args) {
  const [path, parent = { dirName: '' }] = args
  const ext = path.split('.').slice(-1)[0]
  if (ext === 'js' || ext === 'json') {
    const module = stealify.requireCache[join(parent.dirName, path)]
    if (!module) {
      return _require(...args)
    }
    return module.exports
  }
  return stealify.requireNative(path, parent)
}

function requireCache (handle, path) {
  const { vm } = stealify
  const params = ['exports', 'require', 'module']
  const exports = {}
  let dirName = baseName(path)
  dirName = dirName.slice(dirName.indexOf('/') + 1)
  const module = { exports, type: 'js', dirName }
  module.text = loadSymbolFile(handle, path).readString()
  const fun = vm.compile(module.text, path, params, [])
  module.function = fun
  const fileName = path.slice(path.indexOf('/') + 1)
  stealify.requireCache[fileName] = module
  fun.call(exports, exports, p => requireInternal(p, module), module)
  return module
}

function requireShared (...args) {
  const [path] = args
  const name = 'module'
  const handle = stealify.sys.dlopen(path)
  function loadLibrary (path, name) {
    const ptr = stealify.sys.dlsym(handle, `_register_${name}`)
    if (!ptr) return
    return stealify.sys.library(ptr)
  }
  stealify.library = loadLibrary
  requireCache(handle, `${name}/config.js`)
  const config = requireInternal('config.js')
  const files = config.files.map(v => `${name}/${v}`)
  for (const file of files) {
    requireCache(handle, file)
  }
  const module = requireCache(handle, `${name}/index.js`)
  global.require = requireInternal
  return module.exports
}

global.require = stealify.require = (...args) => {
  const [path] = args
  const ext = path.split('.').slice(-1)[0]
  if (ext === 'so') {
    return requireShared(...args)
  }
  return _require(...args)
}

const { createServer, createParser } = require('.stealify/module.so')
const server = createServer()
server.onConnect = socket => {
  const buf = new ArrayBuffer(4096)
  const parser = createParser(buf)
  parser.onRequests = count => {
    for (const request of parser.get(count)) {
      socket.writeString('HTTP/1.1 200 OK\r\nContent-Length: 0\r\n\r\n')
    }
  }
  socket.onData = len => parser.parse(len)
  return buf
}
server.listen()
