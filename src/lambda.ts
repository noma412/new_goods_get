import serverlessExpress from '@vendia/serverless-express'
import app from './app'

let serverlessExpressInstance

async function setup(event, context) {
  serverlessExpressInstance = serverlessExpress({ app })
  return serverlessExpressInstance(event, context)
}

function handler(event, context) {
  if (serverlessExpressInstance)
    return serverlessExpressInstance(event, context)

  return setup(event, context)
}

exports.handler = handler
