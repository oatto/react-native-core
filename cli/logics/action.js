const _ = require('lodash');
const refactor = require('../refactor');
const CONSTANTS = require('../constants');

function add(feature, name, options, constantName) {
    const actionName = _.camelCase(name);

    const targetPath = refactor.getReduxFolder(feature) + '/actions.js';
    const lines = refactor.getLines(targetPath);

    if(refactor.isStringMatch(lines.join(" "), new RegExp(`(.+)export const ${actionName}(.+)`))) {
        return actionName;
    }

    const i = refactor.lastLineIndex(lines, /(.+)/);
    lines.splice(i + 1, 0, `export const ${actionName} = ${_getFunc(options.type)}("${constantName}");`);
    refactor.save(targetPath, lines);

    refactor.updateFile(targetPath, ast => [].concat(
        refactor.addImportFrom(ast, `${CONSTANTS.PACKAGE_NAME}/api/submit/actions`, '', [_getFunc(options.type)]),
        refactor.addImportFrom(ast, `./constants`, '', [constantName])
    ));

    return actionName;
}

function _getFunc(actionType) {
    switch (actionType) {
        case 'request':
            return 'AbstractRequestAction';
        case 'submit':
            return 'AbstractSubmitAction';
        case 'paginate':
            return 'AbstractPaginateAction';
    }

    throw new Error(`Unexpected type ${actionType}`);
}

module.exports = {
    add,
};
