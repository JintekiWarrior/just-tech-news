const User = require('./User')
const Post = require('./Post')

// create association where User has many posts
User.hasMany(Post, {
  foreignKey: 'user_id'
})

// create association where a Post can have only one user
Post.belongsTo(User, {
  foreignKey: 'user_id'
})

module.exports = { User, Post }