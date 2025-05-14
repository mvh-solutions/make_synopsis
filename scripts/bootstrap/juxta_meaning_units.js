const path = require('path');
const fse = require('fs-extra');

const cvForSentence = (sentence, punctuation) => {
    const referencePunctuation =
        punctuation ||
        {
            "bookChapter": " ",
            "chapterVerse": ":",
            "verseRange": "-"
        }
    const cvSet = new Set([]);
    sentence.chunks.forEach(c => c.source.forEach(se => cvSet.add(se.cv)));
    const cvValues = Array.from(cvSet);
    const cv1 = cvValues[0];
    const cv2 = cvValues[cvValues.length - 1];
    if (cv1 === cv2) {
        return cv1;
    }
    const [c1, v1] = cv1.split(':');
    const [c2, v2] = cv2.split(':');
    if (c1 === c2) {
        return `${c1}${referencePunctuation.chapterVerse}${v1}${referencePunctuation.verseRange}${v2}`;
    }
    return `${c1}${referencePunctuation.chapterVerse}${v1}${referencePunctuation.verseRange}${c2}referencePunctuation.chapterVerse}${v2}`
};

const calculateMerges = sentences => {
    const sentenceMerges = []; // True means "merge with next sentence"
    let sentenceN = 0;
    for (const sentence of sentences) {
        const cv4Sentence = cvForSentence(sentence);
        let sentenceLastV = cv4Sentence
            .split(":")[1]
            .split("-")
            .reverse()[0];
        let nextSentenceFirstV = (sentenceN + 1) === jxlJson.length ?
            999 :
            cvForSentence(jxlJson[sentenceN + 1])
                .split(":")[1]
                .split('-')[0];
        sentenceMerges.push(sentenceLastV === nextSentenceFirstV);
        sentenceN++;
    }
    return sentenceMerges;
}

const mergeCvs = (cvs) => {
    const chapter = cvs[0]
        .split(":")[0];
    const firstCvFirstV = cvs[0]
        .split(":")[1]
        .split('-')[0];
    const lastCvLastV = cvs.reverse()[0]
        .split(":")[1]
        .split('-').reverse()[0];
    const chapterVerseSeparator = ":";
    const verseRangeSeparator = "-";
    return `${chapter}${chapterVerseSeparator}${firstCvFirstV}${firstCvFirstV === lastCvLastV ? "" : `${verseRangeSeparator}${lastCvLastV}`}`;
}

const currentUnitModel = () => {
    return {
        sentences: [],
        cvs: []
    }
};

const usage = "USAGE: node juxta_meaning_units.js <source>";

if (process.argv.length !== 3) {
    console.log(usage);
    process.exit(1);
}

const sourceJson = fse.readJsonSync(process.argv[2]);
const jxlJson = sourceJson.bookCode ? sourceJson.sentences : sourceJson;

const merges = calculateMerges(jxlJson);
let currentUnit = currentUnitModel();
let units = [];
for (const [sentenceN, sentence] of jxlJson.entries()) {
    currentUnit.sentences.push(sentenceN);
    currentUnit.cvs.push(cvForSentence(sentence));
    if (!merges[sentenceN]) {
        units.push(currentUnit);
        currentUnit = currentUnitModel();
    }
}

console.log(
    JSON.stringify(
        units.map(
            u => {
                return {
                    firstSentence: u.sentences[0],
                    lastSentence: u.sentences[u.sentences.length - 1],
                    cv: mergeCvs(u.cvs)
                }
            }
        ),
        null,
        2
    )
)
