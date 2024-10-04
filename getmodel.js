import { XpathEvaluator, PsalmParser } from './parser.js';
import { Psalm } from './psalm.js';
import { psalmSets } from './psalmsets.js';

let psalms = [];

async function getModel() {
    let response = await fetch('./tehillim.html');
    if (!response.ok) {
        throw response;
    }
    let text = await response.text();
    let parser = new DOMParser();
    let doc = parser.parseFromString(text, 'text/html');
    let psalmParser = new PsalmParser(doc);
    psalms = [];
    let tableDelta = 0;
    for (let psalmNumber = 1; psalmNumber <= 150; psalmNumber++) {
        let psalm = new Psalm();
        psalm = psalmParser.parse(psalm, psalmNumber, tableDelta);
        if (psalmNumber === 119) {
            tableDelta = psalmParser.parse119(psalm, tableDelta);
        }
        psalm.validate();
        // console.log(psalm);
        // console.log(`debug psalm lines length ${psalm.translation.length}`);
        psalms.push(psalm);
    }
    return {
        'psalms': psalms,
        'psalmSets': psalmSets,
        'selectedPsalmSet': 'Все',
        'showDescription': true,
        'showTransliteration': true,
        'showTranslation': true,
        'showInterlinear': false,
    };
}

export { getModel };