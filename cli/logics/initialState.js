const _ = require('lodash');
const refactor = require('../refactor');
const CONSTANTS = require('../constants');

function add(feature, name, options, constantName) {
    if (!options.withReducer) {
        return;
    }

    const targetPath = refactor.getReduxFolder(feature) + '/initialState.js';
    const stateKeyName = `${constantName}_STATE_KEY`;

    if ('paginate' === options.type) {
        refactor.updateFile(targetPath, ast => [].concat(
            refactor.addImportFrom(ast, `./constants`, '', [stateKeyName]),
            refactor.addImportFrom(ast, `${CONSTANTS.PACKAGE_NAME}/api/paginate/reducer`, '', ['makeInitialState']),
            refactor.addObjectProperty(ast, 'initialState', '', `...makeInitialState(${stateKeyName})`)
        ));
    } else {
        refactor.updateFile(targetPath, ast => [].concat(
            refactor.addImportFrom(ast, `./constants`, '', [stateKeyName]),
            refactor.addObjectProperty(ast, 'initialState', `[${stateKeyName}]`, 'null')
        ));
    }

    refactor.success(`InitialState: "${stateKeyName}" created in "${targetPath}"`);
}

module.exports = {
    add,
};
