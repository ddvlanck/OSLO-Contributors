const lineReader = require('line-reader');
const Processor = require('../lib/Processor');
const OldVersionProcessor = require('../lib/OldFileProcessor');

try {
    if (process.argv.length !== 3) {
        console.error('Please provide one publication file');
        process.exit(1);
    }


    //TODO: enable this when working normally
    const filesToProcessList = process.argv[2];
    loadComputingInterfaces();

    lineReader.eachLine(filesToProcessList, function(path, last) {
        //console.log('Processing this file:' + path);
        if(last){
            Processor.processJSONFile(path, true)
        } else {
            Processor.processJSONFile(path, false);
        }
    });

    //OldVersionProcessor.processFile('https://raw.githubusercontent.com/Informatievlaanderen/OSLOthema-gebouwEnAdres/adres/voc/adres.ttl');

} catch (e) {
    console.error(e);
}

function loadComputingInterfaces(){
    //let Interface = require('../lib/Interfaces/PeopleInterface');
    let Interface = require('../lib/Interfaces/StatisticsComputer');
    new Interface();
}
