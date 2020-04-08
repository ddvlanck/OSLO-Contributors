const DataEventManager = require('./DataEventManager');

class CalculateInterface {
    constructor() {
        // Subscribe to 'data' events
        DataEventManager.subscribe('data', (...data) => this.onData(data));

    }

    // Abstract methods to be overriden by interface implementations
    onData(data) {}
}

module.exports = CalculateInterface;
