const fs = require('fs');

try {
    if (process.argv.length !== 3) {
        console.error('Please provide one publication file');
        process.exit(1);
    }

    const publicationFile = process.argv[2];
    fs.readFile(publicationFile, (err, data) => {
        if (err) throw err;

        const publicationConfig = JSON.parse(data.toString());

        for (let element of publicationConfig) {
            const repository = element.repository;

            if (!GitManager.repositoryAlreadyProcessed(repository)) {
                GitManager.fetchRepository(repository);
            } else {
                console.log(repository + " is already been processed!");
            }

        }


    })


} catch (e) {
    console.error(e);
}
