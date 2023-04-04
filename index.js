const createSocketIOConnection = require('./socket-io.create')

// const total_connection = 20000
const argv = process.argv.slice(2)
const connectArgv = argv.length > 0 ? parseInt(argv[0]) : null

const isDirect = true
// const isStaging = false

const handshakePathDirect = '/api/skijan-vi/ws/handshake'
const handshakePathProxy = '/vi/api/skijan-vi/ws/handshake'
const handshakePath = handshakePathDirect //isDirect ?  : handshakePathProxy

const namespace = 'ws/skijan-vi/test'

const stgUrl = `https://video.gogojungle.net/${namespace}`
const localUrl = `ws://localhost:8927/${namespace}`
const proxyLocalUrl = `ws://localhost:8920/${namespace}`
const url = isDirect ? localUrl : stgUrl

const wsOptions = {
  path: handshakePath,
  forceNew: true,
  reconnection: false,
  timeout: 40000,
  reconnectionDelay: 15000,
  // reconnectionDelayMax: 5000,
  // reconnectionAttempts: 3,
  transports: ['websocket'],
}


async function test(n_connection = 10000, steps = 100) {
  console.log(n_connection)
  let i = 0;
  while (i < n_connection) {
    const n = steps
    await wait(500)
    let i1 = 0
    while (i1 < n) {
      const con = createSocketIOConnection(url, i1 + i, wsOptions)
      i1 ++
    }
    i += n
  }
}

async function wait(time) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}

const n_connection = connectArgv || 10000 // 15000
test(n_connection, 100)
