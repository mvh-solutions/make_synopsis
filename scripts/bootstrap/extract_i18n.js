const path = require('path');
const fse = require('fs-extra');

const usage = "USAGE: node extract_i18n.js <source>";

if (process.argv.length !== 3) {
    console.log(usage);
    process.exit(1);
}

const sourceJson = fse.readJsonSync(process.argv[2]);
console.log(
    JSON.stringify(
        Object.fromEntries(Object.entries(sourceJson)
            .map(
                kv => [
                    kv[0], {
                        title: kv[1].title
                    }
                ]
            ),
        ),
        null,
        2
    )
)