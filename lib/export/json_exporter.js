'use strict';

const fs = require('fs'),
  path = require('path'),
  readEntityJSON = require('../reader/json_file_reader').readEntityJSON,
  toFilePath = require('../reader/json_file_reader').toFilePath,
  doesfileExist = require('../reader/json_file_reader').doesfileExist,
  areJHipsterEntitiesEqual = require('../utils/object_utils').areEntitiesEqual,
  buildException = require('../exceptions/exception_factory').buildException,
  exceptions = require('../exceptions/exception_factory').exceptions;

module.exports = {
  exportToJSON: exportToJSON,
  createJHipsterJSONFolder: createJHipsterJSONFolder
};

function exportToJSON(entities, forceNoFiltering) {
  if (!entities) {
    throw new buildException(
      exceptions.NullPointer,
      'Entities have to be passed to be exported.');
  }
  createJHipsterJSONFolder();
  if (!forceNoFiltering) {
    entities = filterOutUnchangedEntities(entities);
  }
  for (let i = 0, entityNames = Object.keys(entities); i < entityNames.length; i++) {
    let filePath = toFilePath(entityNames[i]);
    if (entities[entityNames[i]].microserviceName) {
      createJHipsterJSONFolder(entities[entityNames[i]].microserviceName);
      filePath = path.join(entities[entityNames[i]].microserviceName, filePath);
    }
    let entity = updateChangelogDate(filePath, entities[entityNames[i]]);
    fs.writeFileSync(filePath, JSON.stringify(entity, null, 4));
  }
}

function checkMicroserviceFolderExists(microserviceFolderName) {
  try {
    if (fs.statSync(microserviceFolderName).isDirectory()) {
      return true;
    }
  } catch (error) {
    return false;
  }
}

function createJHipsterJSONFolder(folderPrefix) {
  if (folderPrefix && !checkMicroserviceFolderExists(folderPrefix)) {
    throw new buildException(
      exceptions.WrongDir,
      `A microservice named '${folderPrefix}' must be created first.`);
  }
  let folderToCreateName = '.jhipster';
  if (folderPrefix) {
    folderToCreateName = path.join(folderPrefix, folderPrefix);
  }
  try {
    if (!fs.statSync(folderToCreateName).isDirectory()) {
      fs.mkdirSync(folderToCreateName);
    }
  } catch (error) {
    fs.mkdirSync(folderToCreateName);
  }
}

function updateChangelogDate(filePath, entity) {
  if (doesfileExist(filePath)) {
    let fileOnDisk = readEntityJSON(filePath);
    if (fileOnDisk && fileOnDisk.changelogDate) {
      entity.changelogDate = fileOnDisk.changelogDate;
    }
  }
  return entity;
}

function filterOutUnchangedEntities(entities) {
  const filtered = {};
  for (let i = 0, entityNames = Object.keys(entities); i < entityNames.length; i++) {
    let entityName = entityNames[i];
    let filePath = toFilePath(entityName);
    if (!(doesfileExist(filePath) && areJHipsterEntitiesEqual(readEntityJSON(filePath), entities[entityName]))) {
      filtered[entityName] = (entities[entityName]);
    }
  }
  return filtered;
}
