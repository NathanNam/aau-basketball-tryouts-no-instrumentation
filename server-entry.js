import { createServer } from 'node:http'
import * as serverModule from './dist/server/server.js'

const PORT = process.env.PORT || 3001
const HOST = process.env.HOST || '0.0.0.0'

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`)
    const request = new Request(url, {
      method: req.method,
      headers: req.headers,
      body:
        req.method !== 'GET' && req.method !== 'HEAD'
          ? await new Promise((resolve) => {
              const chunks = []
              req.on('data', (chunk) => chunks.push(chunk))
              req.on('end', () => resolve(Buffer.concat(chunks)))
            })
          : undefined,
    })

    const response = await (serverModule.default || serverModule.server).fetch(request)

    res.statusCode = response.status
    response.headers.forEach((value, key) => {
      res.setHeader(key, value)
    })

    if (response.body) {
      const reader = response.body.getReader()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        res.write(value)
      }
    }

    res.end()
  } catch (error) {
    console.error('Server error:', error)
    res.statusCode = 500
    res.end('Internal Server Error')
  }
})

server.listen(PORT, HOST, () => {
  console.log(`✅ Server listening on http://${HOST}:${PORT}`)
})

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully')
  server.close(() => {
    console.log('Server closed')
    process.exit(0)
  })
})
