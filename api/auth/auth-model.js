const db = require('../../data/dbConfig');

module.exports = {
  async add(user) {
    const [id] = await db('users')
      .insert(user);
    return this.getById(id);
  },

  getById(id) {
    return db('users').where('id', id).first();
  }
}
