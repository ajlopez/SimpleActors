# Distributed Web Crawler 

A simple web crawler sample, with server and many clients.

## Usage
```
node server.js url [urls...]
```
Example:
```
node server.js http://ajlopez.wordpress.com
```
The server listen on port 3000.

Then many clients can be launched using different ports:
```
node client.js port
```

## To be done

- Configure the client with server host address
- Manage of client disconnection




