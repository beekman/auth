const CharacterClass = require('../lib/models/CharacterClass');

describe('CharacterClass Model', () => {
  describe('name', () => {

    it('requires a name', () => {
      const cc = new CharacterClass({
        hp: 50,
        mana: 50,
        speed: 10,
        strength: 15,
        intelligence: 20,
        agility: 5
      });

      const { errors } = cc.validateSync();
      expect(errors.name.message).toEqual('Path `name` is required.');
    });
  });

  describe('hp', () => {
    it('requires a number', () => {
      const cc = new CharacterClass({
        name: 'Monk',
        mana: 50,
        speed: 10,
        strength: 15,
        intelligence: 20,
        agility: 5
      });
      const { errors } = cc.validateSync();
      expect(errors.hp.message).toEqual('Path `hp` is required.');
    });

    it('is greater than 0', () => {
      const cc = new CharacterClass({
        name: 'Jill',
        mana: 50,
        hp: 0,
        speed: 10,
        strength: 15,
        intelligence: 20,
        agility: 5
      });
      const { errors } = cc.validateSync();
      expect(errors.hp.message).toEqual('Path `hp` (0) is less than minimum allowed value (1).');
    });
  });

  describe('mana', () => {

    it('requires a number', () => {
      const cc = new CharacterClass({
        name: 'Knight',
        speed: 10,
        strength: 15,
        intelligence: 20,
        agility: 5
      });
      const { errors } = cc.validateSync();

      expect(errors.mana.message).toEqual('Path `mana` is required.');
    });

    it('is at least 0', () => {
      const cc5 = new CharacterClass({
        name: 'Jill',
        mana: -1,
        hp: 2,
        speed: 10,
        strength: 15,
        intelligence: 20,
        agility: 5
      });
      const { errors } = cc5.validateSync();
      expect(errors.mana.message).toEqual('Path `mana` (-1) is less than minimum allowed value (0).');
    });
  });

  describe('speed', () => {
    it('requires a number', () => {
      const cc = new CharacterClass({
        name: 'Knight',
        mana: 10,
        strength: 15,
        intelligence: 20,
        agility: 5
      });
      const { errors } = cc.validateSync();
      expect(errors.speed.message).toEqual('Path `speed` is required.');
    });
    it('is at least 0', () => {
      const cc = new CharacterClass({
        name: 'Jill',
        mana: 1,
        hp: 2,
        speed: -1,
        strength: 15,
        intelligence: 20,
        agility: 5
      });
      const { errors } = cc.validateSync();
      expect(errors.speed.message).toEqual('Path `speed` (-1) is less than minimum allowed value (1).');
    });
  });

  describe('strength', () => {
    it('requires a number', () => {
      const cc = new CharacterClass({
        name: 'Knight',
        mana: 10,
        speed: 15,
        intelligence: 20,
        agility: 5
      });
      const { errors } = cc.validateSync();
      expect(errors.strength.message).toEqual('Path `strength` is required.');
    });
    it('is at least 0', () => {
      const cc = new CharacterClass({
        name: 'Jill',
        mana: 1,
        hp: 2,
        strength: -1,
        speed: 15,
        intelligence: 20,
        agility: 5
      });
      const { errors } = cc.validateSync();
      expect(errors.strength.message).toEqual('Path `strength` (-1) is less than minimum allowed value (1).');
    });
  });

  describe('intelligence', () => {
    it('requires a number', () => {
      const cc = new CharacterClass({
        name: 'Barbarian',
        mana: 10,
        speed: 15,
        strength: 20,
        agility: 5
      });
      const { errors } = cc.validateSync();
      expect(errors.intelligence.message).toEqual('Path `intelligence` is required.');
    });
    it('is at least 0', () => {
      const cc = new CharacterClass({
        name: 'Barbarian',
        mana: 1,
        hp: 2,
        intelligence: -1,
        speed: 15,
        strength: 20,
        agility: 5
      });
      const { errors } = cc.validateSync();
      expect(errors.intelligence.message).toEqual('Path `intelligence` (-1) is less than minimum allowed value (1).');
    });
  });

  describe('agility', () => {
    it('requires a number', () => {
      const cc = new CharacterClass({
        name: 'Klutz',
        mana: 10,
        speed: 15,
        strength: 20,
        intelligence: 5
      });
      const { errors } = cc.validateSync();
      expect(errors.agility.message).toEqual('Path `agility` is required.');
    });
    it('is at least 0', () => {
      const cc = new CharacterClass({
        name: 'Klutz',
        mana: 1,
        hp: 2,
        intelligence: 8,
        speed: 15,
        strength: 20,
        agility: -99
      });
      const { errors } = cc.validateSync();
      expect(errors.agility.message).toEqual('Path `agility` (-99) is less than minimum allowed value (1).');
    });
  });

});
