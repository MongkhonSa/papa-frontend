
import express,{json} from 'express'
import next from 'next'
import { downloadXLSX } from './service'
const port = parseInt(process.env.PORT!, 10) || 3009
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
import config from './config'
import { poolConnected } from './db'
app.prepare().then(async() => {
  const server = express()
  server.use(json())
  server.post('/dowload-xlsx',downloadXLSX)
  server.all('*', (req, res) => {
    return handle(req, res)
  })

 poolConnected()
 .then(()=>console.log('connect to database',config.server))
 .catch(e=>console.log('unable to connect pool',e))
  
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`)
  })
})