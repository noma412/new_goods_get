import serverlessExpress from '@vendia/serverless-express'
import app from './app'

const anyServerlessEspress = serverlessExpress as any

const server = anyServerlessEspress.createServer(app)

exports.handler = (event, context) =>
  anyServerlessEspress.proxy(server, event, context)
