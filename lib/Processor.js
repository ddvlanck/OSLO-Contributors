const fetch = require('node-fetch');
const ParserJsonLd = require('@rdfjs/parser-jsonld');
const DataEventManager = require('./DataEventManager');
const stringToStream = require('string-to-stream');

const baseURI = 'https://raw.githubusercontent.com/Informatievlaanderen/OSLO-Generated/test/'

class Processor {


    _parseJsonLD(data){
        const parser = new ParserJsonLd();
        const stream = parser.import(stringToStream(data));

        DataEventManager.push('start', '');

        stream.on('start', () => {
            DataEventManager.push('start' , '');
        });

        stream.on('data', quad => {
            DataEventManager.push('data', quad);
        });

        stream.on('end', () => {
            DataEventManager.push('end', '');
        });
    }

    async processFile(path){
        const jsonldData = await this._fetchFile(path);
        this._parseJsonLD(jsonldData);
    }

    _fetchFile(path){
        return new Promise( resolve => {
            fetch(baseURI + path).then( res => resolve(res.text()));
        })
    }
}

module.exports = new Processor;
