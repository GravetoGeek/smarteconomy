const faker = require('faker');

let max = 3
let min = 1
let profiles = [];
for(let i = 0; i < 100; i++){
  profiles.push({
    name: faker.name.firstName(),
    lastname: faker.name.lastName(),
    birth: faker.date.past(),
    monthly_income: Number((Math.random()*(20000-1200)+1200).toFixed(2)),
    profession: faker.name.jobTitle(),
    gender: Math.round(Math.random() * (max - min) + min),
    user_id: i+1
  })
}






exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('profiles').del()
    .then(function () {
      // Inserts seed entries
      return knex('profiles').insert(profiles);
    });
};
