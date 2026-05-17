import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define('Content', {
    content_id: {
      type:         DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey:   true,
    },
    title: {
      type:      DataTypes.STRING(255),
      allowNull: false,
    },
    title_localized: {
      type:      DataTypes.STRING(255),
      allowNull: true,
    },
    content_type: {
      type:      DataTypes.ENUM('FILM', 'SERIES', 'DOCUMENTARY'),
      allowNull: false,
    },
    release_year: {
      type:      DataTypes.SMALLINT,
      allowNull: false,
    },
    duration_minutes: {
      type:      DataTypes.SMALLINT,
      allowNull: true,
    },
    seasons_count: {
      type:      DataTypes.SMALLINT,
      allowNull: true,
    },
    synopsis: {
      type:      DataTypes.TEXT,
      allowNull: true,
    },
    poster_url: {
      type:      DataTypes.STRING(512),
      allowNull: true,
    },
    director: {
      type:      DataTypes.STRING(150),
      allowNull: true,
    },
    genre: {
      type:      DataTypes.STRING(100),
      allowNull: true,
    },
    average_rating: {
      type:      DataTypes.DECIMAL(3, 2),
      allowNull: true,
    },
    external_api_id: {
      type:      DataTypes.STRING(50),
      allowNull: true,
      unique:    true,
    },
    created_by: {
      type:      DataTypes.UUID,
      allowNull: true,
    },
  }, {
    tableName:  'contents',
    timestamps: true,
    createdAt:  'created_at',
    updatedAt:  false,
  });
};