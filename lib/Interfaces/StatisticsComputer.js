const Interface = require('../Interface');
const DataEventManager = require('../DataEventManager');

class StatisticsComputer extends Interface {

    constructor() {
        super();
        this._contributorPerStandard = {};
        this._allContributors = [];     // Duplicates may exist
        this._standards = [];
        this.frequencyTable = {};
    }


    async onData(data) {
        data = data[0];
        //const identifier = data['@id'];
        const identifier = data['urlref'];
        const publicationDate = data['publication-date'];

        let contributors = [];
        contributors = contributors.concat(data['contributors'], data['editors'], data['authors']);

        if (!this._contributorPerStandard.hasOwnProperty(identifier)) {
            this._contributorPerStandard[identifier] = [];
        }

        // Store data in arrays above
        this._contributorPerStandard[identifier].push({publicationDate: publicationDate, contributors: contributors});
        this._allContributors = this._allContributors.concat(contributors);
        this._standards.push(identifier);

        // Let data event manager know that we're done
        DataEventManager.ready();

    }

    compute() {
        console.log(this._countUniqueOrganizations(this._allContributors));
        console.log(this._countUniqueContributors(this._allContributors));
    }

    _countUniqueContributors(contributors) {
        let unique = [];

        for (let contributor of contributors) {
            if (!unique.includes(contributor['foaf:firstName'] + ' ' + contributor['foaf:lastName'])) {
                unique.push(contributor['foaf:firstName'] + ' ' + contributor['foaf:lastName']);
            }
        }

        return unique.length;
    }

    _countUniqueOrganizations(contributors) {
        let unique = [];

        for (let contributor of contributors) {

            if (contributor['affiliation']) {
                if (!unique.includes(contributor['affiliation']['foaf:name'])) {
                    unique.push(contributor['affiliation']['foaf:name']);
                }
            }
        }

        return unique.length;
    }
}

module.exports = StatisticsComputer;
