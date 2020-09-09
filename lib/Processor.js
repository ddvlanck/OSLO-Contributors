const fetch = require('node-fetch');
let contributorsAndAffiliations = new Map();
let uniqueContributors = new Set();
let uniqueAffiliations = new Set();
const Stats = require('./Statistics');

class Processor {

    // These methods are used when we do not parse the JSON-LD but handle it as JSON
    async processJSONFile(object) {
        if (object.report && object.report != "null") {
            const data = await this.fetchFile(object.report);
            this.processData(data, object.name);
        } else {
            this.putEmpty(object.name)
        }
    }

    processData(data, name) {
        console.log('[Processor]: start processing standard ' + name);
        let anonData = this.transformData(data['contributors'].concat(data['authors'], data['editors']));
        contributorsAndAffiliations.set(name, {contributors: anonData, published: data['publication-date']});
    }

    transformData(data) {
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
            console.log('[Processor]: error while transforming the data. Printing error:');
            console.log(e);
        }

        let result = [];
        for (let index in names) {
            result.push({affiliation: names[index], count: frequency[index]});
        }
        return result;
    }

    putEmpty(name) {
        contributorsAndAffiliations.set(name, []);
    }

    createReport(path) {
        Stats.createReport(contributorsAndAffiliations, uniqueAffiliations, uniqueContributors, path);
    }

    fetchFile(path) {
        return new Promise(resolve => {
            fetch(path).then(res => resolve(res.json()));
        })
    }
}

module.exports = new Processor;
