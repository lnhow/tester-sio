const { WebSocket } = require('ws')

const WS_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  MESSAGE: 'message',
  ERROR: 'error',
  // DISCONNECTING: 'disconnecting',
  // NEW_LISTENER: 'newListener',
  // REMOVE_LISTENER: 'removeListener',
}

// Messages that server accepts (i.e. Server receives)
// const SERVER_EVENTS = {
//   ECHO: 'echo',
//   N_CLIENTS: 'n-clients',
//   BROADCAST: 'broadcast',
// }

// Messages that client accepts (i.e. Server sends)
const CLIENT_EVENTS = {
  CONNECT_CONFIRM: 'connect-confirm',
  ECHO: 'echo',
  N_CLIENTS: 'n-clients',
  BROADCAST: 'broadcast',
}

const createWSConnection = (url, id = -1, options = {}) => {
  console.log(url)
  const socket = new WebSocket(url, options)
  const log = (...info) => {
    console.log(`[Socket no.${id}]`, ...info)
  }

  const logEvent = (event, info = '') => {
    log(`[${event}]`, info)
  }

  socket.onopen = (event) => {
    logEvent(WS_EVENTS.CONNECT, `Connected (id: ${socket})`, event);
  }

  socket.onerror = (err) => {
    logEvent(WS_EVENTS.ERROR, `Err: ` + err.message)
    // socket.close()
  }
  socket.onmessage = (event) => {
    logEvent(WS_EVENTS.MESSAGE,  event.data)
    // socket.close()
  }
  socket.onclose = () => {
    logEvent(WS_EVENTS.DISCONNECT, `Disconnected`);
  }

  Object.keys(CLIENT_EVENTS).forEach((key) => {
    const event = CLIENT_EVENTS[key]
    socket.on(event, (res) => {
      logEvent(event, res)
    })
  })

  return {
    socket,
    actions: {
      // getNumClients: () => {
      //   socket.emit(SERVER_EVENTS.ECHO)
      // },
      // echo: (data) => {
      //   socket.emit(SERVER_EVENTS.ECHO, { data })
      // },
      // broadcast: (data) => {
      //   socket.emit(SERVER_EVENTS.BROADCAST, { data })
      // }
    }
  }
}

module.exports = createWSConnection