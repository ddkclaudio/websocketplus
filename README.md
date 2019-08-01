

# Websocket Plus
A simple implementation of websocket auto-reconnection for [ws](https://www.npmjs.com/package/ws "ws")

## Installation

```sh
npm i websocketplus --save
```

## Example

```sh
npm run example
```

## Usage

```js
const WebSocketPlus = require('websocketplus')
const webSocketPlus = new WebSocketPlus('wss://ws-feed.pro.coinbase.com', {
    openMessage: {
        type: "subscribe",
        product_ids: ["BTC-USD"],
        channels: ["level2"]
    }
})

webSocketPlus.on('open', () => {});

webSocketPlus.on('error', (message) => {
    console.log('error', message);
});

webSocketPlus.on('close', (message) => {
    console.log('close', message);
});

webSocketPlus.on('message', (message) => {
    console.log('message', message.type);
});
```
