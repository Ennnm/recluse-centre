export default function sessionModel(sequelize, DataTypes) {
  return sequelize.define('session', {
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
    lastSeen: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    positionY: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    positionX: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    orientation: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        isIn: [['up', 'down', 'left', 'right']],
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
