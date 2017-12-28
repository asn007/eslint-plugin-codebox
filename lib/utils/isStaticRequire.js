"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isStaticRequire;

function isStaticRequire(node) {
  return node && node.callee && node.callee.type === 'Identifier' && node.callee.name === 'require' && node.arguments.length === 1 && node.arguments[0].type === 'Literal' && typeof node.arguments[0].value === 'string';
}