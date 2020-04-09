const DataEventManager = require('./DataEventManager');

class CalculateInterface {
    constructor() {

        // Subscribe to 'data' events
        DataEventManager.subscribe('data', (...data) => this.onData(data));

        // Subscribe to 'end' events to start computing -- if working with JSON
        DataEventManager.subscribe('end', () => this.compute());

    }

    // Abstract methods to be overriden by interface implementations
    onData(data) {}

    compute() {}
}

module.exports = CalculateInterface;
