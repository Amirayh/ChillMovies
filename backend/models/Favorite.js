import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define('Favorite', {
    user_id: {
      type:       DataTypes.UUID,
      primaryKey: true,
    },
    content_id: {
      type:       DataTypes.UUID,
      primaryKey: true,
    },
    added_at: {
      type:         DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    is_pinned: {
      type:         DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    tableName:  'favorites',
    timestamps: false,
  });
};