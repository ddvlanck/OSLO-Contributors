const fetch = require('node-fetch');
const DataEventManager = require('./DataEventManager');
const baseURI = 'https://raw.githubusercontent.com/Informatievlaanderen/OSLO-Generated/test/';
let fileCounter = 0;

class Processor {

    // These methods are used when we do not parse the JSON-LD but handle it as JSON
    async processJSONFile(path, lastFile){
        fileCounter++;
        const jsonData = await this._fetchFile(path);
        this._sendToInterfaces(jsonData, lastFile);
    }

    _sendToInterfaces(data, lastFile){
        DataEventManager.push('data', JSON.parse(data));

        if(lastFile){
            DataEventManager.lastChunkSend(fileCounter);
        }
    }

    _fetchFile(path){
        return new Promise( resolve => {
            fetch(baseURI + path).then( res => resolve(res.text()));
        })
    }
}

module.exports = new Processor;
