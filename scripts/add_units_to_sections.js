const path = require('path');
const fse = require('fs-extra');

const usage = "USAGE: node add_units_to_sections.js <sections> <unitsDir>";

if (process.argv.length !== 4) {
    console.log(usage);
    process.exit(1);
}

const sectionsPath = path.resolve(process.argv[2]);
const unitsDir = path.resolve(process.argv[3]);

const sections = fse.readJsonSync(sectionsPath);
const units = {};
for (const bookCode of ["MAT", "MRK", "LUK", "JHN"]) {
    units[bookCode] = fse.readJsonSync(path.join(unitsDir, `${bookCode}.json`));
}

console.log(
    JSON.stringify(
        Object.fromEntries(
            Object.entries(sections)
                .map(
                    skv => [
                        skv[0],
                        Object.fromEntries(
                            Object.entries(skv[1])
                                .map(
                                    bkv => [
                                        bkv[0],
                                        bkv[1].firstSentence ?
                                            {
                                                ...bkv[1],
                                                units: units[bkv[0]]
                                                    .filter(
                                                        u => (u.firstSentence >= bkv[1].firstSentence) && (u.lastSentence <= bkv[1].lastSentence)
                                                    )
                                            } :
                                            bkv[1]
                                    ]
                                )
                        )
                    ]
                )
        ),
        null,
        2
    )
);