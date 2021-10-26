export default function messageModel(sequelize, DataTypes) {
  return sequelize.define('message', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'id',
      },
    },
    worldId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'world',
        key: 'id',
      },
    },
    message: {
      allowNull: false,
      type: DataTypes.TEXT,
      validate: {
        len: [1, 640],
      },
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
