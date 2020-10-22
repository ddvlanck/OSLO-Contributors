const Processor = require('../lib/Processor');
const program = require('commander');

try {
    program
        .version('1.0.0')
        .usage('calculates statistics for OSLO standards')
        .option('-f, --file <path>', 'file path of the JSON data')
        .option('-o, --output <path>', 'path to which result will be written');

    program.on('--help', () => {
        console.log('');
        console.log('This program is created for the Open Standards for Linked Organizations team.');
        console.log("It's used to calculate statistics for every OSLO standard, to display on our standards register");
        console.log("The program can be executed as follows:");
        console.log("node contributors.js -f <file> -o <output>");
        console.log("\t<file> can be the path of the JSON data");
        console.log("\t<output> can be the path to which the result will be written.");
    });

    program.parse(process.argv);

    const config = program.file ? require(program.file) : require('../config.json');
    const output = program.output ? program.output : './statistics.json';

    readConfig(config).then( () => {
        Processor.createReport(output);
    });

} catch (e) {
    console.error(e);
}

/*async function readConfig(json, path){
    await Promise.all(json.map(object => Processor.processJSONFile(object)));
    Processor.createReport(path);
}*/

function readConfig(json){
    return Promise.all(json.map(object => Processor.processJSONFile(object)));
}
