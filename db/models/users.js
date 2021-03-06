const db = require('../');
const Promise = require('bluebird');

const User = db.Model.extend({
  tableName: 'users',
  memberOfBoards: function() {
    return this.belongsToMany('Board');
  },
  ownedBoards: function() {
    return this.hasMany('Board', 'owner_id');
  },
  assignedTickets: function() {
    return this.hasMany('Ticket', 'assignee_id');
  },
  createdTickets: function() {
    return this.hasMany('Ticket', 'creator_id');
  }
});

module.exports = db.model('User', User);