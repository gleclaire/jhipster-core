'use strict';

const fs = require('fs');

module.exports = {
  exists: exists,
  isDirectory: isDirectory
};

function isDirectory(path) {
  try {
    return fs.statSync(path).isDirectory();
  } catch (error) {
    return false;
  }
}

function exists(path) {
  try {
    return fs.accessSync(path) === undefined;
  } catch (error) {
    return false;
  }
}
