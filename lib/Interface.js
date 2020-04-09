const DataEventManager = require('./DataEventManager');

class CalculateInterface {
    constructor() {
        // Count the number of stream
        this._streamCounter = 0;

        // Count number of stream that is finished
        this._streamsFinished = 0;

        // Subscribe to 'data' events
        DataEventManager.subscribe('data', (...data) => this.onData(data));

        // Subscribe to 'end' event to start computing
        DataEventManager.subscribe('end', () => this.compute());

        // Subscribe to 'start' evnet to update stream counter
        DataEventManager.subscribe('start', () => this.onStart());

    }

    // Abstract methods to be overriden by interface implementations
    onData(data) {}

    onStart(){}

    onEnd(){}

    compute() {}
}

module.exports = CalculateInterface;
