
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('gender').del()
    .then(function () {
      // Inserts seed entries
      return knex('gender').insert([
        {id: 1, gender: 'Female'},
        {id: 2, gender: 'Male'},
        {id: 3, gender: 'Fluid'}
      ]);
    });
};
