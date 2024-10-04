class Psalm {

    constructor() {
        this.psalmNumber = 0;
        this.psalmDescription = '';
        this.transliteration = [];
        this.translation = [];
        this.hebrew = [];
    }

    merge(partialPsalm) {
        this.psalmDescription += partialPsalm.psalmDescription;
        this.transliteration.push(...partialPsalm.transliteration);
        this.translation.push(...partialPsalm.translation);
        this.hebrew.push(...partialPsalm.hebrew);
    }

    validate() {
        if (this.transliteration.length !== this.translation.length) {
            throw new Error(`The count of transliteration lines ${this.transliteration.length} does not match the count of translation lines ${this.translation.length}`);
        }
    }

}

export { Psalm };
