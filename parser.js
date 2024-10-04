class XpathEvaluator {

    constructor(doc) {
        this.doc = doc;
    }

    nodeExists(xpathExpression) {
        let xpathResult = this.doc.evaluate(
            xpathExpression,
            this.doc,
            null,
            XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
            null
        );
        if (xpathResult.resultType === XPathResult.ORDERED_NODE_SNAPSHOT_TYPE) {
            return xpathResult.snapshotLength > 0;
        } else {
            throw new Error(`Invalid xpathResult.resultType = ${xpathResult.resultType}`);
        }
    }

    getString(xpathExpression) {
        let xpathResult = this.doc.evaluate(
            xpathExpression,
            this.doc,
            null,
            XPathResult.STRING_TYPE,
            null
        );
        if (xpathResult.resultType === XPathResult.STRING_TYPE) {
            return xpathResult.stringValue;
        } else {
            throw new Error(`Invalid xpathResult.resultType = ${xpathResult.resultType}`);
        }
    }

    getUnorderedText(xpathExpression) {
        let xpathResult = this.doc.evaluate(
            xpathExpression,
            this.doc,
            null,
            XPathResult.UNORDERED_NODE_ITERATOR_TYPE,
            null
        );
        if (xpathResult.resultType === XPathResult.UNORDERED_NODE_ITERATOR_TYPE) {
            let result = [];
            let thisNode = xpathResult.iterateNext();
            while (thisNode) {
                let s = thisNode.textContent.trim();
                if (s !== '') {
                    result.push(s);
                }
                thisNode = xpathResult.iterateNext();
            }
            return result;
        } else {
            throw new Error(`Invalid xpathResult.resultType = ${xpathResult.resultType}`);
        }
    }

    getUnorderedLines(xpathExpression) {
        let lines = this.getUnorderedText(xpathExpression);
        if (lines.length === 1) {
            lines = lines[0].split(/\r?\n|\r|\n/g);
        }
        for (let i = 0; i < lines.length; i++) {
            lines[i] = lines[i].trim();
        }
        return lines;
    }

}

class PsalmParser {

    psalmNumberRegex = /(\d+)$/;

    constructor(doc) {
        this.xpathEvaluator = new XpathEvaluator(doc);
        this.psalmNumber = 0;
        this.tableNumber = 0;
        this.lineDelta = 0;
    }

    parseTranslationOrder(translation) {
        let translationLines = [];
        for (let i = 0; i < translation.length; i++) {
            let line = translation[i];
            let lineNumberMatch = line.match(/^(\d+)/);
            if (lineNumberMatch === null || lineNumberMatch.length !== 2) {
                if (i === 0) {
                    translationLines.push([line]);
                } else {
                    translationLines[translationLines.length - 1].push(line);
                }
            } else {
                translationLines.push([line]);
            }
        }
        return translationLines;
    }


    getLineParts(line) {
        return line.split(/^(\d+\.*)/);
    }

    concatenateTranslationOrder(translationLines) {
        let translation = [];
        for (let i = 0; i < translationLines.length; i++) {
            let line = translationLines[i].join('');
            let lineParts = this.getLineParts(line);
            if (lineParts.length !== 3) {
                throw new Error(`Parsed line ${line} has no number, expected line number=${i + 1}`);
            }
            let lineNumberMatch = lineParts[1].match(/^(\d+)/);
            let sourceLineNumber = i + 1 + this.lineDelta;
            if (Number(lineNumberMatch[1]) !== sourceLineNumber) {
                throw new Error(`Source line number=${sourceLineNumber} is not equal to parsed lineNumber=${lineNumberMatch[1]} for line=${line}`);
            }
            translation.push(lineParts[2]);
        }
        return translation;
    }

    setTranslationOrder(translation) {
        let translationLines = this.parseTranslationOrder(translation);
        return this.concatenateTranslationOrder(translationLines);
    }

    getTransliterationLines(xpathExpression) {
        let lines = this.xpathEvaluator.getUnorderedLines(xpathExpression);
        lines = this.parseTranslationOrder(lines);
        return this.concatenateTranslationOrder(lines);
    }

    parseTransliteration(psalmNumber) {
        let transliteration = [];
        if (this.xpathEvaluator.nodeExists(`/html/body/table[${this.tableNumber}]/tbody/tr[2]/td[1]/ol/li`)) {
            transliteration = this.xpathEvaluator.getUnorderedText(
                `/html/body/table[${this.tableNumber}]/tbody/tr[2]/td[1]/ol/li`
            );
        } else if (this.xpathEvaluator.nodeExists(`/html/body/table[${this.tableNumber}]/tbody/tr[2]/td[1]//span/em`)) {
            transliteration = this.getTransliterationLines(
                `/html/body/table[${this.tableNumber}]/tbody/tr[2]/td[1]//span/em`
            );
        } else if (this.xpathEvaluator.nodeExists(`/html/body/table[${this.tableNumber}]/tbody/tr[2]/td[1]//em/span`)) {
            transliteration = this.getTransliterationLines(
                `/html/body/table[${this.tableNumber}]/tbody/tr[2]/td[1]//em/span`
            );
        } else if (this.xpathEvaluator.nodeExists(`/html/body/table[${this.tableNumber}]/tbody/tr[2]/td[1]//em`)) {
            transliteration = this.getTransliterationLines(
                `/html/body/table[${this.tableNumber}]/tbody/tr[2]/td[1]//em`
            );
        } else {
            throw new Error(`Unknown type of transliteration source for psalm ${psalmNumber} tableNumber ${this.tableNumber}`);
        }
        return transliteration;
    }

    parseTranslation(psalmNumber) {
        let translation = [];
        let isMultiLine = false;
        if (this.xpathEvaluator.nodeExists(`/html/body/table[${this.tableNumber}]/tbody/tr[3]/td/p[2]`)) {
            translation = this.xpathEvaluator.getUnorderedText(
                `/html/body/table[${this.tableNumber}]/tbody/tr[3]/td/p[2]//text()`
            );
            isMultiLine = true;
        } else if (this.xpathEvaluator.nodeExists(`/html/body/table[${this.tableNumber}]/tbody/tr[3]/td/ol/li`)) {
            translation = this.xpathEvaluator.getUnorderedText(
                `/html/body/table[${this.tableNumber}]/tbody/tr[3]/td/ol/li`
            );
        } else {
            throw new Error(`Unknown type of translation source for psalm ${psalmNumber} tableNumber ${this.tableNumber}`);
        }
        return {
            'translation': translation,
            'isMultiLine': isMultiLine,
        };
    }

    parse(psalm, psalmNumber, tableDelta, lineDelta) {
        this.tableNumber = psalmNumber + tableDelta;
        if (lineDelta) {
            this.lineDelta = lineDelta;
        }
        if (this.lineDelta === 0) {
            let psalmHeader = this.xpathEvaluator.getString(
                `/html/body/table[${this.tableNumber}]/preceding-sibling::h2[1]//strong/text()`
            );
            psalm.psalmDescription = this.xpathEvaluator.getString(
                `normalize-space(/html/body/table[${this.tableNumber}]/preceding-sibling::h3[1])`
            );
            let psalmNumberMatch = psalmHeader.match(this.psalmNumberRegex);
            if (psalmNumberMatch === null || psalmNumberMatch.length !== 2) {
                throw new Error(`Cannot match psalm number for psalmHeader: ${psalmHeader}`);
            }
            if (Number(psalmNumberMatch[1]) !== psalmNumber) {
                throw new Error(`Source psalmNumber=${psalmNumber} is not equal to parsed psalmNumber=${psalmNumberMatch[1]}`);
            }
        }
        psalm.psalmNumber = psalmNumber;
        if (lineDelta) {
            // console.log(`debug psalm ${psalm.psalmNumber}.${tableDelta}.${lineDelta}`);
        } else {
            // console.log(`debug psalm ${psalm.psalmNumber}.${tableDelta}`);
        }
        psalm.transliteration = this.parseTransliteration(psalmNumber);
        psalm.hebrew = this.xpathEvaluator.getUnorderedText(
            `html/body/table[${this.tableNumber}]/tbody/tr[2]/td[2]/span/text()`
        );
        let translationResult = this.parseTranslation(psalmNumber);
        psalm.translation = translationResult.translation;
        if (translationResult.isMultiLine) {
            psalm.translation = this.setTranslationOrder(psalm.translation);
        }
        // console.log(psalm);
        return psalm;
    }

    parse119(psalm, tableDelta) {
        let lineDelta = psalm.transliteration.length;
        for (tableDelta = 1; tableDelta <= 21; tableDelta++) {
            let partPsalm = new psalm.constructor();
            partPsalm = this.parse(partPsalm, psalm.psalmNumber, tableDelta, lineDelta);
            psalm.merge(partPsalm);
            lineDelta += partPsalm.transliteration.length;
        }
        this.lineDelta = 0;
        return tableDelta - 1;
    }

}

export { XpathEvaluator, PsalmParser };