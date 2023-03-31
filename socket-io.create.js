const { io } = require('socket.io-client')

const SIO_EVENTS = {
  CONNECT: 'connect',
  CONNECT_ERROR: 'connect_error',
  DISCONNECT: 'disconnect',
  DISCONNECTING: 'disconnecting',
  NEW_LISTENER: 'newListener',
  REMOVE_LISTENER: 'removeListener',
}

// Messages that server accepts (i.e. Server receives)
const SERVER_EVENTS = {
  ECHO: 'echo',
  N_CLIENTS: 'n-clients',
  BROADCAST: 'broadcast',
}

// Messages that client accepts (i.e. Server sends)
const CLIENT_EVENTS = {
  CONNECT_CONFIRM: 'connect-confirm',
  ECHO: 'echo',
  N_CLIENTS: 'n-clients',
  BROADCAST: 'broadcast',
}

const createSocketIOConnection = (url, id = -1, options = {}) => {
  const socket = io(url, options)
  const log = (...info) => {
    console.log(`[Socket no.${id}]`, ...info)
  }
  const logEvent = (event, info = '') => {
    log(`[${event}]`, info)
  }

  socket.on(SIO_EVENTS.CONNECT, (event) => {
    logEvent(SIO_EVENTS.CONNECT, `Connected (id: ${socket.id})`);
  })
  socket.on(SIO_EVENTS.CONNECT_ERROR, (err) => {
    logEvent(SIO_EVENTS.CONNECT_ERROR, `Err: ` + err.message)
    // socket.close()
  })
  socket.on(SIO_EVENTS.DISCONNECT, () => {
    logEvent(SIO_EVENTS.DISCONNECT, `Disconnected`);
  });

  Object.keys(CLIENT_EVENTS).forEach((key) => {
    const event = CLIENT_EVENTS[key]
    socket.on(event, (res) => {
      logEvent(event, res)
    })
  })

  return {
    socket,
    actions: {
      getNumClients: () => {
        socket.emit(SERVER_EVENTS.ECHO)
      },
      echo: (data) => {
        socket.emit(SERVER_EVENTS.ECHO, { data })
      },
      broadcast: (data) => {
        socket.emit(SERVER_EVENTS.BROADCAST, { data })
      }
    }
  }
}

module.exports = createSocketIOConnection