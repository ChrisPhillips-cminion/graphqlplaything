const express = require("express");
const { postgraphile } = require("postgraphile");
const Client = require('pg').Client
const Pool = require('pg').Pool

const app = express();

const fs = require('fs');
const config = {
  database: 'apim',
  host: process.env.pghost,
  user:fs.readFileSync('/etc/cert/username').toString(),
  password:fs.readFileSync('/etc/cert/password').toString(),
  // this object will be passed to the TLSSocket constructor
  ssl: {
    ca: fs.readFileSync('/etc/cert/ca.crt').toString(),
    key: fs.readFileSync('/etc/cert/tls.key').toString(),
    cert: fs.readFileSync('/etc/cert/tls.crt').toString(),
    minVersion : 'TLSv1.2',
    maxVersion : 'TLSv1.3',
    loaded : true,
    enableTrace : true,
    rejectUnauthorized : true,
  },
}
const client = new Client(config)
client.connect(err => {
  if (err) {
    console.error('error connecting', err.stack)
  } else {
    console.log('connected')

  }
})
const pool = new Pool(config)
pool
  .connect()
  .then(client => {
    console.log('connected')
    client.release()
  })
  .catch(err => console.error('error connecting', err.stack))
  .then(()=>{
    client.query('SELECT table_name  FROM information_schema.tables ORDER BY table_name;    ', (err, res) => {
      if (err) {
        console.log(err.stack)
      } else {
        console.log(res.rows[0])
      }
    })

  })
  .then(() => {

    console.log('Starting express function')

let middleware =   postgraphile(
    pool,
    "public",
    {
      watchPg: true,
      graphiql: true,
      enhanceGraphiql: true,
    }
  )

  app.use(middleware);

const server = app.listen(3000, () => {
  const address = server.address();
  if (typeof address !== 'string') {
    const href = `http://localhost:${address.port}'/graphiql'`;
    console.log(`PostGraphiQL available at ${href} 🚀`);
  } else {
    console.log(`PostGraphile listening on ${address} 🚀`);
  }
});
})
