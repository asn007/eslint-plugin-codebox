"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isAbsolute = isAbsolute;
exports.isBuiltIn = isBuiltIn;
exports.isExternalModuleMain = isExternalModuleMain;
exports.isScopedMain = isScopedMain;
exports.default = getImportGroup;

var _cond = _interopRequireDefault(require("lodash/cond"));

var _builtinModules = _interopRequireDefault(require("builtin-modules"));

var _path = require("path");

var _resolve = _interopRequireDefault(require("eslint-module-utils/resolve"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _slicedToArray(arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return _sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }

function constant(value) {
  return () => value;
}

function baseModule(name) {
  if (isScoped(name)) {
    const _name$split = name.split('/'),
          _name$split2 = _slicedToArray(_name$split, 2),
          scope = _name$split2[0],
          pkg = _name$split2[1];

    return `${scope}/${pkg}`;
  }

  const _name$split3 = name.split('/'),
        _name$split4 = _slicedToArray(_name$split3, 1),
        pkg = _name$split4[0];

  return pkg;
}

function isAbsolute(name) {
  return name.indexOf('/') === 0;
}

function isBuiltIn(name, settings) {
  const base = baseModule(name);
  const extras = settings && settings['codebox/core-modules'] || [];
  return _builtinModules.default.indexOf(base) !== -1 || extras.indexOf(base) > -1;
}

function isExternalPath(path, name, settings) {
  const folders = settings && settings['codebox/external-module-folders'] || ['node_modules'];
  return !path || folders.some(folder => path.indexOf((0, _path.join)(folder, name)) > -1);
}

const externalModuleRegExp = /^\w/;

function isExternalModule(name, settings, path) {
  return externalModuleRegExp.test(name) && isExternalPath(path, name, settings);
}

const externalModuleMainRegExp = /^[\w]((?!\/).)*$/;

function isExternalModuleMain(name, settings, path) {
  return externalModuleMainRegExp.test(name) && isExternalPath(path, name, settings);
}

const scopedRegExp = /^@[^/]+\/[^/]+/;

function isScoped(name) {
  return scopedRegExp.test(name);
}

const scopedMainRegExp = /^@[^/]+\/?[^/]+$/;

function isScopedMain(name) {
  return scopedMainRegExp.test(name);
}

function isInternalModule(name, settings, path) {
  return externalModuleRegExp.test(name) && !isExternalPath(path, name, settings);
}

function isRelativeToParent(name) {
  return name.indexOf('../') === 0;
}

const indexFiles = ['.', './', './index', './index.js'];

function isIndex(name) {
  return indexFiles.indexOf(name) !== -1;
}

function isRelativeToSibling(name) {
  return name.indexOf('./') === 0;
}

const typeTest = (0, _cond.default)([[isAbsolute, constant('absolute')], [isBuiltIn, constant('builtin')], [isExternalModule, constant('external')], [isScoped, constant('external')], [isInternalModule, constant('internal')], [isRelativeToParent, constant('parent')], [isIndex, constant('index')], [isRelativeToSibling, constant('sibling')], [constant(true), constant('unknown')]]);

function getImportGroup(name, context) {
  return typeTest(name, context.settings, (0, _resolve.default)(name, context));
}