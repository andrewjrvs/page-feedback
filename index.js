const http = require('http');
const port = 3000;
const mergeFile = require('./merge-file').mergeFile;
const fs = require('fs');


const requestHandler = (req, res) => {
    var file = __dirname + req.url
    if (req.url === '/') {
        res.writeHead(200, {'Content-Type': 'text/html'});
        fs.createReadStream('./src/index.html').pipe(res);
    } else if (fs.existsSync(file)) {
        if (file.indexOf('/lib/') > -1) {
            res.write(mergeFile(file));
            res.end();
        } else {
            fs.createReadStream(file).pipe(res)
        }
    }
}

const server = http.createServer(requestHandler)

server.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on http://localhost:${port}`)
})