export default function userModel(sequelize, DataTypes) {
  return sequelize.define('user', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    username: {
      allowNull: false,
      type: DataTypes.STRING(64),
      unique: true,
    },
    realName: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING,
      is: /^[0-9a-f]{64}$/i,
    },
    profileImg: {
      type: DataTypes.STRING(64),
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,

    },
  }, { underscored: true });
}
