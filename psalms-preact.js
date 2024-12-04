// npx live-server
// https://gomakethings.com/a-mostly-vanilla-js-way-to-use-preact/
// import { html, render, signal, effect } from 'https://cdn.jsdelivr.net/npm/preact-htm-signals-standalone/dist/standalone.js';
// import { html, Component, render, signal } from https://npm.reversehttp.com/@preact/signals-core,@preact/signals,htm/preact,preact/hooks,preact

import { html, Component, render, signal } from './preact/standalone.js';
import { getModel } from './getmodel.js';

var psalmViewer = document.getElementById('psalm_viewer');
let model = await getModel();

let selectedPsalmSet = signal(model.selectedPsalmSet);
let showDescription = signal(model.showDescription);
let showTransliteration = signal(model.showTransliteration);
let showTranslation = signal(model.showTranslation);
let showInterlinear = signal(model.showInterlinear);

function PsalmLink(props) {
    return html`
        <a class="psalm-link" href="#psalm-${props['psalm-number']}">${props['psalm-number']}</a>
    `;
}

function Psalm(props) {
    let psalm = model.psalms[Number(props['psalm-number']) - 1];
    return html`
        <div>
            <h3 id="psalm-${psalm.psalmNumber}">Псалом ${psalm.psalmNumber}</h3>
            ${
                showDescription.value &&
                html`<h4>${psalm.psalmDescription}</h4>`
            }
            ${
                showTransliteration.value &&
                html`
                    <div class="transliteration">
                        ${psalm.transliteration.map(
                            (transliteration, idx) => {
                                return html`
                                    <div class="${showInterlinear.value && 'interlinear-block'}">
                                        <div>${idx + 1}. ${transliteration}</div>
                                        ${
                                            showInterlinear.value &&
                                            html`
                                                <div class="interlinear">${idx + 1}. ${psalm.translation[idx]}</div>
                                            `
                                        }
                                    </div>
                                `;
                            }
                        )}
                    </div>
                `
            }
            ${
                showTranslation.value &&
                html`
                    <div class="translation">
                        ${psalm.translation.map(
                            (translation, idx) => {
                                return html`
                                    <div>${idx + 1}. ${translation}</div>
                                `;
                            }
                        )}
                    </div>
                `
            }
        </div>
    `;
}

class Psalms extends Component {

    toggleShowDescription(ev) {
        showDescription.value = !showDescription.value;
    }

    toggleShowTransliteration(ev) {
        showTransliteration.value = !showTransliteration.value;
    }

    toggleShowTranslation(ev) {
        showTranslation.value = !showTranslation.value;
    }

    toggleShowInterlinear(ev) {
        showInterlinear.value = !showInterlinear.value;
    }

    onChangeSelectedPsalmSet(ev) {
        selectedPsalmSet.value = ev.currentTarget.value;
    }

    render(props, state) {
        let selectedPsalms = model.psalms.filter((psalm) => {
            return model.psalmSets.get(selectedPsalmSet.value)(psalm.psalmNumber)
        });
        return html`
            <div class="controls">
                <div>
                    <input id="show_description" type="checkbox" checked="${showDescription}" onClick="${this.toggleShowDescription}" />
                    <label for="show_description">Описание</label>
                </div>
                <div>
                    <input id="show_transliteration" type="checkbox" checked="${showTransliteration}" onClick="${this.toggleShowTransliteration}" />
                    <label for="show_transliteration">Транслитерация</label>
                </div>
                <div>
                    <input id="show_translation" type="checkbox" checked="${showTranslation}" onClick="${this.toggleShowTranslation}" />
                    <label for="show_translation">Перевод</label>
                </div>
                <div>
                    <input id="show_interlinear" type="checkbox" checked="${showInterlinear}" onClick="${this.toggleShowInterlinear}" />
                    <label for="show_interlinear">Подстрочник</label>
                </div>
                <div class="select-psalmset">
                    <select value="${selectedPsalmSet}" onChange="${this.onChangeSelectedPsalmSet}">
                        ${Array.from(model.psalmSets.keys()).map(
                            (psalmSet, idx) => {
                                return html`<option value="${psalmSet}">${psalmSet}</option>`;
                            })
                        }
                    </select>
                </div>
            </div>
            <div class="psalm-links">
                ${selectedPsalms.map(
                    (psalm, idx) => {
                        return html`<${PsalmLink} psalm-number="${psalm.psalmNumber}" />`;
                    })
                }
            </div>
            <div class="psalm-texts">
                ${selectedPsalms.map(
                    (psalm, idx) => {
                        return html`<${Psalm} psalm-number="${psalm.psalmNumber}" />`;
                    })
                }
            </div>
        `;
    }

}

// render(html`<${Psalm} psalm-number="1" />`, psalmViewer);
render(html`<${Psalms} />`, psalmViewer);