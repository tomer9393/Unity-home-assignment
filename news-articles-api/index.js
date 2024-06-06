const {SERVER_PORT} = require('./lib/consts');

const initializeServer = async () => {
  console.log('Initializing server...');
  const app = require('./lib/api/application');

  const PORT = process.env.SERVER_PORT || SERVER_PORT
  let Server;
  Server = app.listen(PORT, () => {
    console.log(`Server started and listening on port: ${PORT}...`);
  });

  const logError = err => {
    console.error(err);
  };

  process.on('SIGTERM', err => {
    logError(err);
    Server.close()
  });

  process.on('uncaughtException', logError);
  process.on('warning', logError);
  process.on('unhandledRejection', logError);
}

initializeServer();
