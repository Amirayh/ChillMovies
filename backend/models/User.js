import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define('User', {
    user_id: {
      type:         DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey:   true,
    },
    username: {
      type:      DataTypes.STRING(50),
      allowNull: false,
      unique:    true,
    },
    email: {
      type:      DataTypes.STRING(255),
      allowNull: false,
      unique:    true,
    },
    password_hash: {
      type:      DataTypes.CHAR(60),
      allowNull: false,
    },
    avatar_url: {
      type:      DataTypes.STRING(512),
      allowNull: true,
    },
    is_active: {
      type:         DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }, {
    tableName:  'users',
    timestamps: true,
    createdAt:  'created_at',
    updatedAt:  'updated_at',
  });
};