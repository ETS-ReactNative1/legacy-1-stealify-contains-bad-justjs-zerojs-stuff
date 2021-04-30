const { ffi } = stealify.library('ffi')
const handle = stealify.sys.dlopen()
if (!handle) throw new Error('Clould not create handle')

function wrap_chdir () {
  const fn = stealify.sys.dlsym(handle, 'chdir')
  if (!fn) throw new Error('Could not find symbol')
  const cif = new ArrayBuffer(8)
  const dv = new DataView(cif)
  const status = ffi.ffiPrepCif(cif, ffi.FFI_TYPE_UINT32, [ffi.FFI_TYPE_POINTER])
  if (status !== ffi.FFI_OK) {
    throw new Error(`Bad Status ${status}`)
  }
  const fp = new DataView(new ArrayBuffer(8))
  dv.setBigUint64(0, fp.buffer.getAddress(), true)
  return str => {
    fp.setBigUint64(0, ArrayBuffer.fromString(`${str}\0`).getAddress(), true)
    return ffi.ffiCall(cif, fn)
  }
}

function wrap_close () {
  const fn = stealify.sys.dlsym(handle, 'close')
  if (!fn) throw new Error('Could not find symbol')
  const cif = new ArrayBuffer(8)
  const dv = new DataView(cif)
  const status = ffi.ffiPrepCif(cif, ffi.FFI_TYPE_UINT32, [ffi.FFI_TYPE_UINT32])
  if (status !== ffi.FFI_OK) {
    throw new Error(`Bad Status ${status}`)
  }
  const fp = new DataView(new ArrayBuffer(4))
  dv.setBigUint64(0, fp.buffer.getAddress(), true)
  return fd => {
    fp.setUint32(0, fd, true)
    return ffi.ffiCall(cif, fn)
  }
}

function wrap_atoi () {
  const fn = stealify.sys.dlsym(handle, 'atoi')
  if (!fn) throw new Error('Could not find symbol')
  const cif = new ArrayBuffer(8)
  const dv = new DataView(cif)
  const status = ffi.ffiPrepCif(cif, ffi.FFI_TYPE_UINT32, [ffi.FFI_TYPE_POINTER])
  if (status !== ffi.FFI_OK) {
    throw new Error(`Bad Status ${status}`)
  }
  const fp = new DataView(new ArrayBuffer(8))
  dv.setBigUint64(0, fp.buffer.getAddress(), true)
  return str => {
    fp.setBigUint64(0, ArrayBuffer.fromString(`${str}\0`).getAddress(), true)
    return ffi.ffiCall(cif, fn)
  }
}

function wrap_uname () {
  const fn = stealify.sys.dlsym(handle, 'uname')
  if (!fn) throw new Error('Could not find symbol')
  const cif = new ArrayBuffer(8)
  const dv = new DataView(cif)
  const status = ffi.ffiPrepCif(cif, ffi.FFI_TYPE_UINT32, [ffi.FFI_TYPE_POINTER])
  if (status !== ffi.FFI_OK) {
    throw new Error(`Bad Status ${status}`)
  }
  const fp = new DataView(new ArrayBuffer(8))
  dv.setBigUint64(0, fp.buffer.getAddress(), true)
  return buf => {
    fp.setBigUint64(0, buf.getAddress(), true)
    return ffi.ffiCall(cif, fn)
  }
}

function wrap_sqrt () {
  const fn = stealify.sys.dlsym(handle, 'sqrt')
  if (!fn) throw new Error('Could not find symbol')
  const cif = new ArrayBuffer(8)
  const dv = new DataView(cif)
  const status = ffi.ffiPrepCif(cif, ffi.FFI_TYPE_DOUBLE, [ffi.FFI_TYPE_DOUBLE])
  if (status !== ffi.FFI_OK) {
    throw new Error(`Bad Status ${status}`)
  }
  const fp = new DataView(new ArrayBuffer(8))
  dv.setBigUint64(0, fp.buffer.getAddress(), true)
  return val => {
    fp.setFloat64(0, val, true)
    return ffi.ffiCall(cif, fn)
  }
}

function readCString (buf, u8, off) {
  const start = off
  while (u8[off] !== 0) off++
  return buf.readString(off - start, start)
}

const atoi = wrap_atoi()
stealify.print(atoi(stealify.args[2] || '1'))
stealify.print(atoi(stealify.args[2] || '22'))
stealify.print(atoi(stealify.args[2] || '333'))
stealify.print(atoi(stealify.args[2] || '4444'))
const uname = wrap_uname()
const b = new ArrayBuffer(4096)
const u8 = new Uint8Array(b)
uname(b)
const _UTSNAME_LENGTH = 65
const sysname = readCString(b, u8, 0)
stealify.print(sysname)
const nodename = readCString(b, u8, _UTSNAME_LENGTH)
stealify.print(nodename)
const release = readCString(b, u8, _UTSNAME_LENGTH * 2)
stealify.print(release)
const version = readCString(b, u8, _UTSNAME_LENGTH * 3)
stealify.print(version)
const machine = readCString(b, u8, _UTSNAME_LENGTH * 4)
stealify.print(machine)
const domain = readCString(b, u8, _UTSNAME_LENGTH * 5)
stealify.print(domain)

// does not work - need to translate floats?
const sqrt = wrap_sqrt()
stealify.print(sqrt(9.0))

const close = wrap_close()
const fd = stealify.fs.open('demo.js')
stealify.print(fd)
stealify.print(close(fd))

const chdir = wrap_chdir()
stealify.print(chdir('/tmp'))
