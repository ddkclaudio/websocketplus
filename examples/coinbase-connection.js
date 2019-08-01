const WebSocketPlus = require('../index')

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