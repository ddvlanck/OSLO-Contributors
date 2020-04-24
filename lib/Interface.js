const DataEventManager = require('./DataEventManager');

class CalculateInterface {
    constructor() {

        // Subscribe to 'data' events
        DataEventManager.subscribe('data', (...data) => this.onData(data));

        // Subscribe to 'end' events to start computing
        DataEventManager.subscribe('end', () => this.createReport());

    }

    // Abstract methods to be overriden by interface implementations
    onData(data) {}

    createReport() {}
}

module.exports = CalculateInterface;
