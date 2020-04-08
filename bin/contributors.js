const lineReader = require('line-reader');
const Converter = require('../lib/Converter');

try {
    if (process.argv.length !== 3) {
        console.error('Please provide one publication file');
        process.exit(1);
    }

    const stakeholdersList = process.argv[2];
    loadComputingInterfaces();

    lineReader.eachLine(stakeholdersList, function(file) {
        const name = file.split('/')[4];
        Converter.processFile(file, name)
    });


} catch (e) {
    console.error(e);
}

function loadComputingInterfaces(){
    let Interface = require('../lib/Interfaces/PeopleInterface');
    new Interface();
}
