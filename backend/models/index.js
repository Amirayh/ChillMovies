import { Sequelize } from 'sequelize';
import config        from '../config/database.js';

import defineUser     from './User.js';
import defineContent  from './Content.js';
import defineFavorite from './Favorite.js';

const sequelize = new Sequelize(config.development);

const User     = defineUser(sequelize);
const Content  = defineContent(sequelize);
const Favorite = defineFavorite(sequelize);

// User -> Content (created_by)
User.hasMany(Content,   { foreignKey: 'created_by', as: 'createdContents' });
Content.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

// N:N User <-> Content via Favorite
User.belongsToMany(Content, {
  through:    Favorite,
  foreignKey: 'user_id',
  otherKey:   'content_id',
  as:         'favorites',
});
Content.belongsToMany(User, {
  through:    Favorite,
  foreignKey: 'content_id',
  otherKey:   'user_id',
  as:         'favoritedBy',
});

// Accès direct à Favorite
User.hasMany(Favorite,    { foreignKey: 'user_id' });
Favorite.belongsTo(User,  { foreignKey: 'user_id' });

Content.hasMany(Favorite, { foreignKey: 'content_id' });
Favorite.belongsTo(Content, { foreignKey: 'content_id' });

export { sequelize, User, Content, Favorite };