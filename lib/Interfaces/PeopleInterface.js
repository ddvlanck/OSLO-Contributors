const Interface = require('../Interface');

class PeopleInterface extends Interface {

    constructor() {
        super();
        this._contributorPerStandard = {};
        this._contributorObject = {};
        this._standards = [];
    }

    async onData(data){
        data = data[0];

        // Extract the identifier of the file = name of the standard
        if(data.predicate.value === 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type' && data.object.value === 'http://www.w3.org/2002/07/owl#Ontology'){
            this._standards.push(data.subject.value);
        }

        // Contributors to the standard
        // Here data.subject should be equals to the value from the if statement above
        if(data.predicate.value === 'http://purl.org/dc/terms/contributor'
            || data.predicate.value === 'http://www.w3.org/2001/02pd/rec54#editor'
            || data.predicate.value === 'http://xmlns.com/foaf/0.1/maker'){
            if(!this._contributorPerStandard.hasOwnProperty(data.subject.value)){
                this._contributorPerStandard[data.subject.value] = [];
            }

            this._contributorPerStandard[data.subject.value].push(data.object.value);   // data.object.value should be a blank node and should be link to a contributor in
                                                                                        // _contributorobject
        }

        if(data.predicate.value === 'http://xmlns.com/foaf/0.1/firstName'){
            if(!this._contributorObject.hasOwnProperty(data.subject.value)) {
                this._contributorObject[data.subject.value] = {}
            }

            this._contributorObject[data.subject.value].firstName = data.object.value;
        }

        if(data.predicate.value === 'http://xmlns.com/foaf/0.1/lastName'){
            if(!this._contributorObject.hasOwnProperty(data.subject.value)) {
                this._contributorObject[data.subject.value] = {}
            }

            this._contributorObject[data.subject.value].lastName = data.object.value;
        }
    }

    onStart(){
        this._streamCounter++;
    }

    onEnd(){
        this._streamsFinished++;

        if(this._streamCounter === this._streamsFinished){
            this.compute();
        }
    }

    compute() {
        console.log("#Standards: " + this._standards.length);
        console.log('#Contributors: ' + Object.keys(this._contributorObject).length);
        console.log('#Contributor test: ' + this._contributorPerStandard['https://data.vlaanderen.be/ns/transportnetwerk'].length)
    }
}

module.exports = PeopleInterface;
