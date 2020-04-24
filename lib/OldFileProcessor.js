const fetch = require('node-fetch');
const ParserN3 = require('@rdfjs/parser-n3');
const stringToStream = require('string-to-stream');
const parser = new ParserN3();
const fs = require('fs');

let affiliationReferences = [];
let affiliationObjects = {};

let filePath;


class OldVersionProcessor {

    async processFile(path){
        filePath = path;
        const content = await this._fetchFile();
        this._parseContent(content);
    }

    _parseContent(data){
        const output = parser.import(stringToStream(data));
        output.on('data', quad => this._onQuad(quad));
        output.on('end', () => {
            this._createReport();
        })
    }

    _onQuad(quad){

        if(quad.predicate.value === 'http://schema.org/affiliation'){
            affiliationReferences.push(quad.object.value);

            if(!affiliationObjects.hasOwnProperty(quad.object.value)){
                affiliationObjects[quad.object.value] = {};
            }
        }

        if(quad.predicate.value === 'http://xmlns.com/foaf/0.1/name' ){
            if(!affiliationObjects.hasOwnProperty(quad.subject.value)){
                affiliationObjects[quad.subject.value] = {};
            }

            affiliationObjects[quad.subject.value].name = quad.object.value
        }

        if(quad.predicate.value === 'http://xmlns.com/foaf/0.1/homepage'){
            if(!affiliationObjects.hasOwnProperty(quad.subject.value)){
                affiliationObjects[quad.subject.value] = {};
            }

            affiliationObjects[quad.subject.value].homepage = quad.object.value
        }
    }

    _fetchFile(){
        return new Promise(resolve => {
            fetch(filePath).then(res => resolve(res.text()));
        })
    }

    _createReport(){
        // foaf:homepage is used as a predicate somewhere else
        // Since triples are parsed in random order, we can not detect which blank node is from the other foaf:homepage
        // We need to check if the blank node is in the affiliationReferences

        let freqTable = {};

        Object.keys(affiliationObjects).forEach( key => {
            if(affiliationReferences.includes(key)){
                const object = affiliationObjects[key];

                if(!freqTable.hasOwnProperty(object.homepage)){
                    freqTable[object.homepage] = {};
                    freqTable[object.homepage].counter = 0;
                }

                freqTable[object.homepage].name = object.name;
                freqTable[object.homepage].counter++;
            }
        });

        let organizationContributors = [];
        Object.keys(freqTable).forEach(organization => {
            organizationContributors.push({
                '@type': 'schema:Organization',
                '@id': organization,
                'name': freqTable[organization].name,
                'numberOfPeopleContributors': freqTable[organization].counter
            });
        });

        const doc = {
            '@context': {
                'schema': 'https://schema.org/',
                'rdfs': 'http://www.w3.org/2000/01/rdf-schema#',
                'name': 'schema:name',
                'numberOfPeopleContributors': 'rdfs:label',
                'contributors': {
                    '@id': 'schema:name',
                    '@container': '@list'
                }
            },
            '@type' : 'schema:Report',
            'contributors' : organizationContributors
        };

        const pieces = filePath.split('/');
        const output = pieces[pieces.length-1].split('.')[0];

        fs.writeFile('data/' + output + '-report.jsonld', JSON.stringify(doc, null, 4), () => {
            console.log('Done writing the report.');
        })


    }
}

module.exports = new OldVersionProcessor;
