"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function swap(array, indexOne, indexTwo) {
  const a = array[indexOne];
  const b = array[indexTwo];
  array[indexTwo] = a; // eslint-disable-line

  array[indexOne] = b; // eslint-disable-line
}

class TranspositionManager {
  constructor(nodes) {
    this.nodes = nodes;
    this.workOn = nodes.length - 1;
    this.virtualTransposedState = nodes.slice();
  }

  canTranspose() {
    return this.workOn > 0;
  }

  transpose() {
    let workNode = this.virtualTransposedState[this.workOn].shouldBe;

    while (workNode === this.workOn && this.workOn > 0) workNode = this.virtualTransposedState[--this.workOn].shouldBe; // eslint-disable-line


    swap(this.virtualTransposedState, this.workOn, workNode);
    const result = [this.virtualTransposedState[workNode], this.virtualTransposedState[this.workOn]];
    if (this.workOn < workNode) result.reverse();
    return result;
  }

}

exports.default = TranspositionManager;