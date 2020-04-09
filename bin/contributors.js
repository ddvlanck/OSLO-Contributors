const lineReader = require('line-reader');
const Processor = require('../lib/Processor');

try {
    if (process.argv.length !== 3) {
        console.error('Please provide one publication file');
        process.exit(1);
    }


    //TODO: process filesToProces.txt file

    const filesToProcessList = process.argv[2];
    loadComputingInterfaces();

    lineReader.eachLine(filesToProcessList, function(path, last) {
        if(last){
            Processor.processJSONFile(path, true)
        } else {
            Processor.processJSONFile(path, false);
        }
    });


} catch (e) {
    console.error(e);
}

function loadComputingInterfaces(){
    //let Interface = require('../lib/Interfaces/PeopleInterface');
    let Interface = require('../lib/Interfaces/StatisticsComputer');
    new Interface();
}
