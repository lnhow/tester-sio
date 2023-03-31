const createSocketIOConnection = require('./socket-io.create')

// const total_connection = 20000
const argv = process.argv.slice(2)
const connectArgv = argv.length > 0 ? parseInt(argv[0]) : null

const n_connection = connectArgv || 15000 // 15000
// const n_connection = 10000
console.log(n_connection)
const isDirect = true
const isStaging = false

const handshakePathDirect = '/api/skijan-vi/ws/handshake'
const handshakePathProxy = '/vi/api/skijan-vi/ws/handshake'
const handshakePath = isDirect ? handshakePathDirect : handshakePathProxy

const namespace = 'ws/skijan-vi/test'

const stgUrl = `https://skijan.gogojungle.com/${namespace}`
const localUrl = `ws://localhost:8925/${namespace}`
const proxyLocalUrl = `ws://localhost:8920/${namespace}`
const url = isDirect ? localUrl : (isStaging ? stgUrl : proxyLocalUrl)

const wsOptions = {
  path: handshakePath,
  forceNew: true,
  reconnection: true,
  reconnectionDelay: 15000,
  // reconnectionDelayMax: 5000,
  reconnectionAttempts: 3,
  transports: ['websocket'],
}


async function test(n_connection = 10000) {
  let i = 0;
  while (i < n_connection) {
    const n = 30
    await wait(800)
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

test(n_connection)
