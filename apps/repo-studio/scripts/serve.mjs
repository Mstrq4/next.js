import http from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import handler from 'serve-handler'

const here = path.dirname(fileURLToPath(import.meta.url))
const publicDirectory = path.resolve(here, '../out')
const port = Number(process.env.PORT || 4173)

const server = http.createServer((request, response) =>
  handler(request, response, {
    public: publicDirectory,
    cleanUrls: true,
    trailingSlash: false,
  })
)

server.listen(port, () => {
  console.log('Next Studio: http://localhost:' + port)
})
