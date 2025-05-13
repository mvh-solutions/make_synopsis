const path = require('path');
const fse = require('fs-extra');

const usage = "USAGE: node create_sections.js <source> <bookCode>";

if (process.argv.length !== 4) {
    console.log(usage);
    process.exit(1);
}

const sourceJson = fse.readJsonSync(process.argv[2]);
const bookCode = process.argv[3];

// Sorted ids that contain bookCode
const matchingIds = Object.entries(sourceJson)
    .filter(kv => Object.keys(kv[1][bookCode]).length > 0)
    .sort((kva, kvb) =>
        (kva[1][bookCode].fromChapter - kvb[1][bookCode].fromChapter) ||
        (kva[1][bookCode].fromVerse - kvb[1][bookCode].fromVerse))
    .map(kv => kv[0])

const nonMatchingIds = Object.keys(sourceJson)
    .filter(k => !matchingIds.includes(k))

console.log(
    JSON.stringify(
        [
            matchingIds,
            nonMatchingIds
        ],
        null,
        2
    )
)