const fs = require('fs');
const excelReader = require('read-excel-file/node');

let themeMap = new Map();
let organizationMap = new Map();

try {
    readFiles();
    //readFile(__dirname + '/Data/OSLO Bedrijventerreinen 17-03-2020 14-24-50.xlsx',);
} catch (e) {

}


function readFiles() {

    let files = fs.readdirSync('Data');
    for (let file of files) {

        // We only reed the Excel files of an OSLO theme
        if (file.indexOf('OSLO') >= 0) {
            const filePath = __dirname + '/Data/' + file;
            readFile(filePath, file);
        }
    }
}

function readFile(file, fileName) {
    // Determine name of theme
    const theme = fileName.substring(fileName.indexOf('OSLO ') + 5, fileName.indexOf('.xlsx'));

    // Read Excel file
    excelReader(fs.createReadStream(file)).then(rows => {
        for (let row of rows) {
            const name = row[2] + " " + row[3];
            const org = row[4];

            // Add person to organizationMap
            if (org) {
                if (!organizationMap.get(org)) {
                    organizationMap.set(org, [name]);
                } else {
                    let names = organizationMap.get(org);
                    names.push(name);
                    organizationMap.set(org, names);
                }
            } else {
                if (!organizationMap.get('onbekend')) {
                    organizationMap.set('onbekend', [name]);
                } else {
                    let names = organizationMap.get('onbekend');
                    names.push(name);
                    organizationMap.set('onbekend', names);
                }
            }

            // Add person to themeMap
            if (!themeMap.get(theme)) {
                themeMap.set(theme, []);
            }

            if (org) {
                let organizationObjects = themeMap.get(theme);
                let added = false;
                for (let organizationObject of organizationObjects) {
                    if (organizationObject.name === org) {
                        if (!organizationObject.persons) {
                            organizationObject.persons = [];
                        }
                        added = true;
                        organizationObject.persons.push(name);
                    }
                }

                if (!added) {
                    organizationObjects.push({name: 'onbekend', persons: [name]});

                }

                themeMap.set(theme, organizationObjects);

            }
        }
    });
}

function calculatePerTheme(){
    
}

function calculatePerOrganization(){

}
