'use strict';

const expect = require('chai').expect,
  fail = expect.fail,
  path = require('path'),
  JDLMicroserviceOption = require('../../../lib/core/jdl_microservice_option'),
  JDLEntity = require('../../../lib/core/jdl_entity'),
  BinaryOptions = require('../../../lib/core/jhipster/binary_options');

describe('JDLBinaryOption', () => {
  describe('::new', () => {
    describe('when passing no argument', () => {
      it('fails', () => {
        try {
          new JDLMicroserviceOption();
          fail();
        } catch (error) {
          expect(error.name).to.eq('IllegalArgumentException');
        }
      });
    });
    describe('when passing a value', () => {
      it('creates the option', () => {
        const option = new JDLMicroserviceOption({
          value: 'MyShinyMicroservice'
        });
        expect(option).not.to.be.null;
        expect(option.name).to.eq(BinaryOptions.BINARY_OPTIONS.MICROSERVICE);
        expect(option.value).to.eq('MyShinyMicroservice');
        expect(option.path).to.eq('.');
      });
    });
    describe('when passing a path', () => {
      it('adds it', () => {
        const option = new JDLMicroserviceOption({
          value: 'MyShinyMicroservice',
          path: 'MyShinyMicroservice'
        });
        expect(option).not.to.be.null;
        expect(option.name).to.eq(BinaryOptions.BINARY_OPTIONS.MICROSERVICE);
        expect(option.value).to.eq('MyShinyMicroservice');
        expect(option.path).to.eq('MyShinyMicroservice');
      });
    });
  });
  describe('#toString', () => {
    it('stringifies the option', () => {
      let option = new JDLMicroserviceOption({
        value: 'toto'
      });
      expect(option.toString()).to.eq(`${BinaryOptions.BINARY_OPTIONS.MICROSERVICE} * with toto`);
      option.addEntity(new JDLEntity({name: 'D'}));
      expect(option.toString()).to.eq(`${BinaryOptions.BINARY_OPTIONS.MICROSERVICE} D with toto`);
      option.addEntity(new JDLEntity({name: 'E'}));
      option.addEntity(new JDLEntity({name: 'F'}));
      expect(option.toString()).to.eq(`${BinaryOptions.BINARY_OPTIONS.MICROSERVICE} D, E, F with toto`);
      option.excludeEntity(new JDLEntity({name: 'A'}));
      expect(option.toString()).to.eq(`${BinaryOptions.BINARY_OPTIONS.MICROSERVICE} D, E, F with toto except A`);
      option.excludeEntity(new JDLEntity({name: 'B'}));
      option.excludeEntity(new JDLEntity({name: 'C'}));
      expect(option.toString()).to.eq(`${BinaryOptions.BINARY_OPTIONS.MICROSERVICE} D, E, F with toto except A, B, C`);
      option = new JDLMicroserviceOption({
        value: 'toto',
        path: '../titi/tata'
      });
      option.excludeEntity(new JDLEntity({name: 'A'}));
      expect(option.toString()).to.eq(`microservice * with toto (${path.join('..', 'titi', 'tata')}) except A`);
    });
  });
});
