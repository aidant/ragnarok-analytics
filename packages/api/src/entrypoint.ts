import 'dotenv/config.js'
import 'isomorphic-fetch'
import 'reflect-metadata'

import { PrismaClient } from '@ragnarok-analytics/sdk-prisma'
import { resolvers } from '@ragnarok-analytics/sdk-typeql'
import { ApolloServer, AuthenticationError } from 'apollo-server'
import {
  ApolloServerPluginLandingPageDisabled,
  ApolloServerPluginLandingPageGraphQLPlayground
} from 'apollo-server-core'
import { buildSchema } from 'type-graphql'
import { AUTHORIZED_USERS, HOST, PORT, isProduction } from './environment.js'
import { log } from './logger.js'

const prisma = new PrismaClient()

const { url } = await new ApolloServer({
  schema: await buildSchema({ resolvers }),
  context: async ({ req }) => {
    try {
      if (!req.headers.authorization) {
        throw new AuthenticationError('Missing Authorisation Token.')
      }

      const response = await fetch('https://discord.com/api/v10/users/@me', {
        headers: { Authorization: req.headers.authorization },
      })

      if (!response.ok) {
        throw new AuthenticationError('Invalid Authorisation Token.')
      }

      const json = await response.json()

      if (!AUTHORIZED_USERS.includes(json.id)) {
        throw new AuthenticationError('Unauthorized.')
      }
    } catch (error) {
      if (error instanceof AuthenticationError) throw error
      throw new AuthenticationError('Failed to Authenticate.')
    }

    return { prisma }
  },
  plugins: [
    isProduction
      ? ApolloServerPluginLandingPageDisabled()
      : ApolloServerPluginLandingPageGraphQLPlayground(),
  ],
}).listen({ host: HOST, port: PORT })

log(`🚀 Server ready at ${url}`)
