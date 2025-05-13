const path = require('path');
const fse = require('fs-extra');

const usage = "USAGE: node extract_sections.js <source>";

if (process.argv.length !== 3) {
    console.log(usage);
    process.exit(1);
}

const sourceJson = fse.readJsonSync(process.argv[2]);
console.log(
    JSON.stringify(
        Object.keys(sourceJson),
        null,
        2
    )
)