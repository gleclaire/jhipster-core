'use strict';

const _ = require('lodash'),
  IOUtils = require('../utils/io_utils'),
  exists = IOUtils.exists,
  isDirectory = IOUtils.isDirectory,
  fs = require('fs'),
  Parser = require('../parser/json_parser'),
  Reader = require('../reader/json_file_reader'),
  buildException = require('../exceptions/exception_factory').buildException,
  exceptions = require('../exceptions/exception_factory').exceptions;

module.exports = {
  parseFromDir: parseFromDir
};

/* Parse the given jhipster app dir and return a JDLObject */
function parseFromDir(dir) {
  if (!dir) {
    throw new buildException(
      exceptions.IllegalArgument, 'The app directory must be passed.');
  }
  if (!isDirectory(dir)) {
    throw new buildException(
      exceptions.WrongDir,
      `The passed dir must exist and must be a directory.`);
  }
  const jdl = Parser.parseServerOptions(Reader.readEntityJSON(`${dir}/.yo-rc.json`)['generator-jhipster']);
  const entityDir = `${dir}/.jhipster`;
  if (!exists(entityDir)) {
    return jdl;
  }
  if (!isDirectory(entityDir)) {
    throw new buildException(
      exceptions.WrongDir,
      `'${entityDir}' must be a directory.`);
  }
  const entities = {};
  _.forEach(fs.readdirSync(entityDir), (file) => {
    if (file.slice(file.length - 5, file.length) === '.json') {
      const entityName = file.slice(0, file.length - 5);
      try {
        entities[entityName] = Reader.readEntityJSON(`${entityDir}/${file}`);
      } catch (error) {
        // Not an entity file, not adding
      }
    }
  });
  Parser.parseEntities(entities, jdl);
  return jdl;
}
