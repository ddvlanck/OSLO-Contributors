const fs = require('fs');
class Statistics {

    createReport(data, uniqueAffiliations, uniqueContributors, path){
        console.log('[Statistics]: start creating the report.');
        let report = [];

        for(let [standard, values] of data){
            let total = 0;

            if(values.contributors){
                for(let contributor of values.contributors){
                    total += contributor.count;
                }
            }

            report.push({
                standard: standard,
                publicationDate: values.published,
                totalPeople: total,
                contributors: values.contributors
            });
        }

        report.unshift({uniqueContributors: uniqueContributors.size, uniqueAffiliations: uniqueAffiliations.size})

        fs.writeFileSync(path, JSON.stringify(report, null, 4));
        console.log('[Statistics]: done creating report.')
    }
}

module.exports = new Statistics;
