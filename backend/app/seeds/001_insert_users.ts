const faker = require('faker');
const bcrypt = require('bcryptjs')

let users = [];
for(let i = 0; i < 100; i++){
  users.push({
    email: faker.internet.email(),
    password: bcrypt.hashSync('12345678',10),
  });
  
}



exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert(users);
    });
};
