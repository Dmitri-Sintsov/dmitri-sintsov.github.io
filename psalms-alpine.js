// npx live-server

import { default as Alpine } from './alpine/module.esm.js';
import { getModel } from './getmodel.js';

var psalmViewer = document.getElementById('psalm_viewer');
let model = await getModel();

Alpine.data('psalmsData', function() {
    return model;
});
Alpine.initTree(psalmViewer);