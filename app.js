const http = require('http');
const { parse } = require('querystring');

const pug = require('pug');

const compileForm = pug.compileFile('./views/form.pug');
const compileResult = pug.compileFile('./views/result.pug');

const server = http.createServer((req, res) => {
  if (req.method === 'GET') {
    const [url, params] = req.url.split('?');
    if (url === '/') {
      // send the form only for url '/'
      const parsedParams = parse(params);
      res.setHeader('Content-Type', 'text/html');
      res.write(
        compileForm({ fieldname: parsedParams.fieldname || 'default' }),
      );
      res.end();
    } else {
      // redirection to the main page for all other urls (url params are kept)
      res.writeHead(302, {
        Location: params ? `/?${params}` : '/',
      });
      res.end();
    }
  }
  if (req.method === 'POST') {
    const body = [];
    req.on('data', (chunk) => body.push(chunk));
    req.on('end', () => {
      // send the result when all data is recieved
      const parsedBody = parse(Buffer.concat(body).toString());
      const [fieldname, value] = Object.entries(parsedBody)[0];
      res.setHeader('Content-Type', 'text/html');
      res.write(compileResult({ fieldname, value }));
      res.end();
    });
  }
});

server.listen(3000);
