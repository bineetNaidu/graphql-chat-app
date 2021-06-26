'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Reaction }) {
      // define association here
      this.hasMany(Reaction, {
        as: 'reactions',
        foreignKey: 'messageId',
      });
    }
  }
  Message.init(
    {
      content: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      uuid: {
        allowNull: false,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      from: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      to: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: 'Message',
      tableName: 'messages',
    }
  );
  return Message;
};
