const http = require('http');
const url = require('url');
const querystring = require('querystring');

const pug = require('pug');

const compileForm = pug.compileFile('./views/form.pug');
const compileResult = pug.compileFile('./views/result.pug');

const server = http.createServer((req, res) => {
  if (req.method === 'GET') {
    const { query } = url.parse(req.url, true);
    res.setHeader('Content-Type', 'text/html');
    res.write(compileForm({ fieldname: query.fieldname || 'default' }));
    res.end();
  }
  if (req.method === 'POST') {
    const body = [];
    req.on('data', (chunk) => body.push(chunk));
    req.on('end', () => {
      const parsedBody = querystring.parse(Buffer.concat(body).toString());
      const fieldname = Object.keys(parsedBody)[0];
      const value = parsedBody[fieldname];
      res.setHeader('Content-Type', 'text/html');
      res.write(compileResult({ fieldname, value }));
      res.end();
    });
  }
});

server.listen(3000);
