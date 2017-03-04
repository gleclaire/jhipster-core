'use strict';

const JDLBinaryOption = require('./jdl_binary_option'),
  BinaryOptions = require('../core/jhipster/binary_options'),
  path = require('path'),
  merge = require('../utils/object_utils').merge,
  buildException = require('../exceptions/exception_factory').buildException,
  exceptions = require('../exceptions/exception_factory').exceptions;

class JDLMicroserviceOption extends JDLBinaryOption {
  constructor(args) {
    const merged = merge(defaults(), args);
    if (!merged.value) {
      throw new buildException(
        exceptions.IllegalArgument,
        'A microservice must be passed.');
    }
    super(merged);
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
    name:  BinaryOptions.BINARY_OPTIONS.MICROSERVICE,
    path: ''
  };
}

module.exports = JDLMicroserviceOption;
