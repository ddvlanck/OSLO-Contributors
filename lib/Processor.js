const fetch = require('node-fetch');
const Stats = require('./Statistics');
let contributorsAndAffiliations = new Map();
let uniqueContributors = new Set();
let uniqueAffiliations = new Set();
let termsPerRepository = {};
let noReportIncluded = 0;
let reportErrors = 0;

class Processor {

    // These methods are used when we do not parse the JSON-LD but handle it as JSON
    async processJSONFile(object) {
        if (object.report && object.report != "null") {
            await this.fetchFile(object.report)
                .then(data => {
                    this.processData(data, object.name, object.status, object.publicationDate, object.repository);
                })
                .catch(error => {
                    console.log(error);
                    reportErrors++;
                    this.putEmpty(object.name, object.status, object.publicationDate);
                });
        } else {
            noReportIncluded++;
            this.putEmpty(object.name, object.status, object.publicationDate);
        }
    }

    processData(data, name, status, publicationDate, repository) {
        console.log(`[Processor]: start processing standard ${name}`);
        const anonData = this.extractContributors(data['contributors'].concat(data['authors'], data['editors']));
        this.countTerminology(data, repository);
        contributorsAndAffiliations.set(name, {contributors: anonData, published: publicationDate, status: status});
    }

    extractContributors(data) {
        let names = [];
        let frequency = [];

        try {
            for (let contributor of data) {
                const affiliation = contributor.affiliation ? contributor.affiliation['foaf:name'] : 'unknown';
                const fullName = contributor['foaf:firstName'] + ' ' + contributor['foaf:lastName'];

                uniqueContributors.add(fullName);
                uniqueAffiliations.add(affiliation);

                if (names.includes(affiliation)) {
                    frequency[names.indexOf(affiliation)]++;
                } else {
                    names.push(affiliation);
                    frequency.push(1);
                }
            }
        } catch (e) {
            console.log(`[Processor]: error while transforming the data. Printing error:`);
            console.log(e);
        }

        let result = [];
        for (let index in names) {
            result.push({affiliation: names[index], count: frequency[index]});
        }
        return result;
    }

    countTerminology(data, repository) {
        if(!termsPerRepository.hasOwnProperty(repository)){
            termsPerRepository[repository] = new Set();
        }
        let set = termsPerRepository[repository];
        const terms = data['externalproperties'].concat(data['externals'], data['properties'], data['classes']);
        terms.forEach(term => set.add(term['@id']));
        termsPerRepository[repository] = set;
    }


    putEmpty(name, status, publicationDate) {
        contributorsAndAffiliations.set(name, {contributors: [], published: publicationDate, status: status});
    }

    createReport(path) {
        let totalTerms = 0;
        Object.keys(termsPerRepository).forEach( repository => {
            totalTerms += termsPerRepository[repository].size
        });
        Stats.createReport(contributorsAndAffiliations, uniqueAffiliations, uniqueContributors, totalTerms, noReportIncluded, reportErrors, path);
    }

    async fetchFile(path) {
        const response = await fetch(path);

        if (!response.ok) {
            const message = `An error has occured while processing the following file: ${path}. Are you sure this file still exists?`;
            throw new Error(message);
        }

        const data = await response.json();
        return data;
    }
}

module.exports = new Processor;
