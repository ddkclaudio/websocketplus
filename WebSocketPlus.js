const WebSocket = require('ws')
const EventEmitter = require('events');
module.exports = class WebSocketPlus extends EventEmitter {

    constructor(wsurl, config) {
        super()
        this.ws;
        this.wsurl = wsurl
        this.waitingTime = 0
        this.resetConfigs()
        this.updateConfig(config)

        if (wsurl)
            this.open()
    }

    resetConfigs() {
        this.configs = {
            maxRetries: 0,
            openMessage: "",
            reconnection: true,
            waitingTimeMin: 1,
            waitingTimeMax: 5,
            waitingTimeSteps: 1
        }
    }

    updateConfig(config) {

        if (!config)
            return

        const self = this
        const keys = Object.keys(config)
        keys.forEach(key => {
            self.configs[key] = config[key]
        });
    }

    getConfigs() {
        return JSON.parse(JSON.stringify(this.configs))
    }

    open() {
        const self = this
        this.ws = new WebSocket(this.wsurl);

        this.ws.on('open', function () {
            self.emit('open');

            if (self.configs.openMessage)
                self.send(self.configs.openMessage)
        });

        this.ws.on('error', function (e) {
            self.emit('error', e);
        });

        this.ws.on('close', function () {
            if (self.configs.reconnection) {
                setTimeout(function () {
                    self.open()
                }, self.getTimeWait() * 1000);
                self.emit('close', `Trying to reconnect in ${self.waitingTime * 1000} milliseconds...`);
            } else {
                self.emit('close', `Auto reconnection is disabled`);
            }
        })

        this.ws.on('message', function (message) {
            try {
                self.emit('message', JSON.parse(message));
            } catch (error) {
                self.emit('message', message);
            }
        })
    }

    getTimeWait() {
        this.waitingTime += this.configs.waitingTimeSteps
        if (this.waitingTime > this.configs.waitingTimeMax)
            this.waitingTime = this.configs.waitingTimeMin
        return this.waitingTime
    }

    send(message) {
        if (!this.ws)
            return false
        try {
            if (typeof (message) === "string")
                this.ws.send(message)
            else
                this.ws.send(JSON.stringify(message))
        } catch (e) {
            this.emit('error', e);
            return false
        }

        return true
    }

    close() {
        try {
            this.ws.close()
            return true
        } catch (e) {
            this.emit("error", e)
            return false
        }
    }
}