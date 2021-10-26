import { Sequelize } from 'sequelize';
import url from 'url';
import allConfig from '../config/config.js';

// no admin model, because it only contains foreign keys
import initUserModel from './user.mjs';
import initWorldModel from './world.mjs';
import initSessionModel from './session.mjs';
import initMessageModel from './message.mjs';

const env = process.env.NODE_ENV || 'development';

const config = allConfig[env];

const db = {};

let sequelize;

if (env === 'production') {
  // break apart the Heroku database url and rebuild the configs we need

  const { DATABASE_URL } = process.env;
  const dbUrl = url.parse(DATABASE_URL);
  const username = dbUrl.auth.substr(0, dbUrl.auth.indexOf(':'));
  const password = dbUrl.auth.substr(dbUrl.auth.indexOf(':') + 1, dbUrl.auth.length);
  const dbName = dbUrl.path.slice(1);

  const host = dbUrl.hostname;
  const { port } = dbUrl;

  config.host = host;
  config.port = port;

  sequelize = new Sequelize(dbName, username, password, config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

db.User = initUserModel(sequelize, Sequelize.DataTypes);
db.World = initWorldModel(sequelize, Sequelize.DataTypes);
db.Session = initSessionModel(sequelize, Sequelize.DataTypes);
db.Message = initMessageModel(sequelize, Sequelize.DataTypes);

db.User.hasMany(db.World);
db.World.belongsTo(db.User);

// creates a method in the
// user object with getSentMessages, etc.
// allows the use of include with sentMessages
db.User.hasMany(db.Message, {
  as: 'sentMessages',
  foreignKey: 'user_id',
});
// creates a method in the
// user object with getWorldMessages, etc.
// allows the use of include with worldMessages
db.World.hasMany(db.Message, {
  as: 'worldMessages',
  foreignKey: 'world_id',
});
db.Message.belongsTo(db.User, {
  as: 'messageSender',
  foreignKey: 'user_id',
});
db.Message.belongsTo(db.World, {
  as: 'messageWorld',
  foreignKey: 'world_id',
});

db.User.hasMany(db.Session, {
  as: 'userSessions',
  foreignKey: 'user_id',
});
db.World.hasMany(db.Session, {
  as: 'worldSessions',
  foreignKey: 'world_id',
});
db.Session.belongsTo(db.User, {
  as: 'sessionUser',
  foreignKey: 'user_id',
});
db.Session.belongsTo(db.World, {
  as: 'sessionWorld',
  foreignKey: 'world_id',
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
