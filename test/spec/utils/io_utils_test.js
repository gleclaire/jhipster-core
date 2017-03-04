'use strict';

const expect = require('chai').expect,
  fs = require('fs'),
  IOUtils = require('../../../lib/utils/io_utils'),
  exists = IOUtils.exists,
  isDirectory = IOUtils.isDirectory;

describe.only('IOUtils', () => {
  describe('::exists', () => {
    describe('when passing an invalid path', () => {
      it('returns false', () => {
        expect(exists('test_file')).to.be.false;
      });
    });
    describe('when passing a valid path', () => {
      it('returns true', () => {
        const filePath = 'test_file';
        fs.writeFileSync(filePath, '');
        expect(exists(filePath)).to.be.true;
        fs.unlinkSync(filePath);
      });
    });
  });
  describe('::isDirectory', () => {
    describe('when passing an invalid path', () => {
      it('returns false', () => {
        expect(isDirectory('test_file/')).to.be.false;
      });
    });
    describe('when passing a file', () => {
      it('returns false', () => {
        const filePath = 'test_file';
        fs.writeFileSync(filePath, '');
        expect(isDirectory(filePath)).to.be.false;
        fs.unlinkSync(filePath);
      });
    });
    describe('when passing a valid path', () => {
      it('returns true', () => {
        const dirPath = 'test_dir';
        fs.mkdirSync(dirPath);
        expect(isDirectory(dirPath)).to.be.true;
        fs.rmdirSync(dirPath);
      });
    });
  });
});
