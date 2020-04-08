const fetch = require('node-fetch');
const stringToStream = require('string-to-stream');
const lineReader = require('line-reader');
const DataEventManager = require('./DataEventManager');


class Converter {

    _convertToJSON(data, name){
        let isLineZero = true;
        try {
            lineReader.eachLine(stringToStream(data), (line) => {
                const fields = line.split(';');
                const json = {
                    'key': name,
                    'person': fields[0] + ' ' + fields[1],
                    'organization': fields[3] === '' ? 'Onbekend' : fields[3]
                };
                DataEventManager.push('data', json);
            })
        } catch (e) {
            console.error(e);
        }

    }

    async processFile(stakeholdersFile, name){
        const csvData= await this._fetchFile(stakeholdersFile);
        this._convertToJSON(csvData, name);
    }

    _fetchFile(file){
        return new Promise( resolve => {
            fetch(file).then( res => resolve(res.text()));
        })
    }
}

module.exports = new Converter;
