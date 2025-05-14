const path = require('path');
const fse = require('fs-extra');

const usage = "USAGE: node rework_sections.js <source>";

if (process.argv.length !== 3) {
    console.log(usage);
    process.exit(1);
}

const cvForBookSection = ob => {
    let cvPunctuation = ":";
    let vvPunctuation = "-";
    let ccPunctuation = "-";
    let ret = [
        ob.fromChapter,
        cvPunctuation,
        ob.fromVerse
    ];
    if (ob.toChapter !== ob.fromChapter) {
        ret.push(ccPunctuation);
        ret.push(ob.toChapter);
        ret.push(cvPunctuation);
        ret.push(ob.toVerse);
    } else if (ob.toVerse !== ob.fromVerse) {
        ret.push(vvPunctuation);
        ret.push(ob.toVerse);
    }
    return ret.join('');
}

const sourceJson = fse.readJsonSync(process.argv[2]);
console.log(
    JSON.stringify(
        Object.fromEntries(
            Object.entries(sourceJson).map(
                kv => [
                    kv[0],
                    Object.fromEntries(
                        Object.entries(kv[1]).map(
                            kv2 => [
                                kv2[0],
                                kv2[1].fromJuxta ?
                                    {
                                        firstSentence: parseInt(kv2[1].fromJuxta) - 1,
                                        lastSentence: parseInt(kv2[1].toJuxta) - 1,
                                        cvs: cvForBookSection(kv2[1])
                                    } :
                                    {}
                            ]
                        )
                    )
                ]
            ),
        ),
        null,
        2
    )
)