const http = require('http')
const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname)
const port = process.env.PORT || 5000

const mime = {
  '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.json':'application/json',
  '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.svg':'image/svg+xml'
}

const server = http.createServer((req,res)=>{
  let reqPath = decodeURIComponent(req.url.split('?')[0])
  if(reqPath === '/') reqPath = '/index.html'
  const file = path.join(root, reqPath.replace(/^\//,''))
  if(!file.startsWith(root)) return res.writeHead(403).end('Forbidden')
  fs.stat(file, (err, stat)=>{
    if(err || !stat.isFile()) return res.writeHead(404).end('Not found')
    const ext = path.extname(file).toLowerCase()
    res.writeHead(200, {'Content-Type': mime[ext] || 'application/octet-stream'})
    fs.createReadStream(file).pipe(res)
  })
})

server.listen(port, ()=>{
  console.log(`Serving ${root} at http://localhost:${port}`)
})
