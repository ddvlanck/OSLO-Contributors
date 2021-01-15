const fs = require('fs');
class Statistics {

    createReport(data, uniqueAffiliations, uniqueContributors, path){
        console.log('[Statistics]: start creating the report.');
        let standards = [];

        for(let [standard, values] of data){
            let total = 0;

            if(values.contributors) {
                for (let contributor of values.contributors) {
                    total += contributor.count;
                }
            }

            standards.push({
                standard: standard,
                publicationDate: values.published,
                status: values.status,
                totalPeople: total,
                contributors: values.contributors
            });
        }

        let report = {uniqueContributors: uniqueContributors.size, uniqueAffiliations: uniqueAffiliations.size, standards: standards};

        fs.writeFileSync(path, JSON.stringify(report, null, 4));
        console.log('[Statistics]: done creating report.')
    }
}

module.exports = new Statistics;
