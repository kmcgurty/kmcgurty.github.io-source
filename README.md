Installation
---
You can easily have this running on your own server.

1. Install [Node](https://nodejs.org/en/)
2. Clone this repo
3. run `npm install` in the directory you cloned
4. run `npm start` to start the Express server (default port: 3000, you can use iptables to forward port 80 traffic to 3000)
5. If you're running this on a VPS, you probably want to use [forever service](https://github.com/zapty/forever-service). It will start the server on boot and also restart if problems arise.