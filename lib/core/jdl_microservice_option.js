'use strict';

const JDLBinaryOption = require('./jdl_binary_option'),
  path = require('path'),
  merge = require('../utils/object_utils').merge;

class JDLMicroserviceOption extends JDLBinaryOption {
  constructor(args) {
    super(args);
    const merged = merge(defaults(), args);
    this.normalizedPath = path.normalize(merged.path);
  }

  get path() {
    return this.normalizedPath;
  }

  toString() {
    const entityNames = this.entityNames.join(', ');
    entityNames.slice(1, entityNames.length - 1);
    let microservice = `microservice ${entityNames} with ${this.value}`;
    if (this.normalizedPath !== '.') {
      microservice = `${microservice} (${this.normalizedPath})`;
    }
    if (this.excludedNames.size() === 0) {
      return microservice;
    }
    const excludedNames = this.excludedNames.join(', ');
    excludedNames.slice(1, this.excludedNames.length - 1);
    return `${microservice} except ${excludedNames}`;
  }
}

function defaults() {
  return {
    path: ''
  };
}

module.exports = JDLMicroserviceOption;
