import { genGridArray, WorldState } from '../src/components/World/GridConstants.jsx';

const jssha = require('jssha');

const { SALT } = process.env;

function getHash(input) {
  // eslint-disable-next-line new-cap
  const shaObj = new jssha('SHA-512', 'TEXT', { encoding: 'UTF8' });
  const unhasedString = `${input}-${SALT}`;
  shaObj.update(unhasedString);

  return shaObj.getHash('HEX');
}

const blankWorld = new WorldState();
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('users', [{
      username: 'admin',
      real_name: 'plato',
      password: getHash('cave'),
      created_at: new Date(),
      updated_at: new Date(),

    }]);
    await queryInterface.bulkInsert('worlds', [{
      created_user_id: 1,
      name: 'plato\'s cave',
      world_state: JSON.stringify(blankWorld),
      created_at: new Date(),
      updated_at: new Date(),
    }]);
  },
  // to create default world json here
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('worlds', null, {});
    await queryInterface.bulkDelete('users', null, {});
  },
};