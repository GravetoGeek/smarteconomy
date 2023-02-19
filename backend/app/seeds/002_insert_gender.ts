import { Knex } from "knex";

exports.seed = function(knex: Knex) {
  // Deletes ALL existing entries
  return knex('genders').del()
    .then(function () {
      // Inserts seed entries
      return knex('genders').insert([
        {id: 1, gender: 'Female'},
        {id: 2, gender: 'Male'},
        {id: 3, gender: 'Fluid'}
      ]);
    });
};
