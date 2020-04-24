const DataEventManager = require('../DataEventManager');
const CalculateInterface = require('../Interface');

const fs = require('fs');


class StatisticsComputer extends CalculateInterface {

    constructor() {
        super();
        this._contributorPerStandard = {};
        this._allContributors = [];     // Duplicates may exist
        this._standards = [];
    }


    async onData(data) {
        data = data[0];
        const identifier = data['@id'];
        const version = data['urlref'];
        const publicationDate = data['publication-date'];

        let contributors = [];
        contributors = contributors.concat(data['contributors'], data['editors'], data['authors']);

        if (!this._contributorPerStandard.hasOwnProperty(version)) {
            this._contributorPerStandard[version] = [];
        }

        // Store data in arrays above
        this._contributorPerStandard[version].push({
            publicationDate: publicationDate,
            contributors: contributors,
            about: identifier
        });
        this._allContributors = this._allContributors.concat(contributors);
        this._standards.push(version);

        // Let data event manager know that we're done
        DataEventManager.ready();

    }

    createReport() {
        let graph = [];


        Object.keys(this._contributorPerStandard).forEach(standard => {
            const contributors = this._contributorPerStandard[standard][0].contributors;

            let freqTable = {};
            let organizationIdentifier = {};

            // Filter the contributors per organization for a standard
            for (let contributor of contributors) {

                if (contributor.hasOwnProperty('affiliation')) {
                    if (!freqTable.hasOwnProperty(contributor.affiliation['foaf:name'])) {
                        freqTable[contributor.affiliation['foaf:name']] = 0;
                    }

                    freqTable[contributor.affiliation['foaf:name']]++;

                    if (!organizationIdentifier.hasOwnProperty(contributor.affiliation['foaf:name'])) {
                        organizationIdentifier[contributor.affiliation['foaf:name']] = contributor.affiliation['foaf:homepage'];
                    }
                } else {
                    // Affiliation is undefined
                    if(!freqTable.hasOwnProperty('undefined')){
                        freqTable['undefined'] = 0;
                    }
                    freqTable['undefined']++;
                }
            }

            let organizationContributors = [];
            Object.keys(freqTable).forEach(organization => {
                console.log(organizationIdentifier[organization]);
                organizationContributors.push({
                    '@type': 'schema:Organization',
                    '@id': organizationIdentifier[organization],
                    'name': organization,
                    'numberOfPeopleContributors': freqTable[organization]
                });
            });

            graph.push({
                '@type': 'schema:Report',
                'about': this._contributorPerStandard[standard][0].about,
                'hasVersion': standard,
                'contributors': organizationContributors
            });
        });

        const doc = {
            '@context': {
                '@base': 'https://test.data.vlaanderen.be',
                'schema': 'https://schema.org/',
                'dcterms': 'http://purl.org/dc/terms/',
                'rdfs': 'http://www.w3.org/2000/01/rdf-schema#',
                'about': {
                    '@id': 'schema:about',
                    '@type': '@id'
                },
                'name': 'schema:name',
                'numberOfPeopleContributors': 'rdfs:label',
                'contributors': {
                    '@id': 'schema:name',
                    '@container': '@list'
                },
                'hasVersion': 'dcterms:hasVersion',
                'summary': '@graph'
            },
            'summary': graph
        };

        fs.writeFile('report.jsonld', JSON.stringify(doc, null, 4), () => {
            console.log('Done writing the report.');
        })


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
