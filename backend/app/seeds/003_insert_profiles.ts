import {faker} from '@faker-js/faker';
import { Knex } from 'knex';
import Profile from '../models/Profile';

let max:number = 3
let min:number = 1
let profiles:Profile[] = [];


for(let i = 0; i < 100; i++){
  profiles.push({
    name: faker.name.firstName(),
    lastname: faker.name.lastName(),
    birthday: faker.date.birthdate({min:18,max:85,mode:'age'}),
    monthly_income: Number((Math.random()*(20000-1200)+1200).toFixed(2)),
    profession: faker.name.jobTitle(),
    gender_id: Math.round(Math.random() * (max - min) + min),
    user_id: i+1
  })
} 






exports.seed = function(knex: Knex) {
  // Deletes ALL existing entries
  return knex('profiles').del()
    .then(function () {
      // Inserts seed entries
      return knex('profiles').insert(profiles);
    });
};
