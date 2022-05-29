import { Knex } from "knex";
import Balance from "../models/Balance";

let balance:Balance[] = []

let max:number = 100
let min:number = 1

for(let i = 0; i < 100; i++){
  balance.push({
    total_balance: Number((Math.random()*(20000-1200)+1200).toFixed(2)),
    total_income: Number((Math.random()*(20000-1200)+1200).toFixed(2)),
    total_expense: Number((Math.random()*(20000-1200)+1200).toFixed(2)),
    date: new Date(),
    profile_id: Number(Math.round(Math.random() * (max - min) + min))
  })
}

exports.seed = function(knex:Knex) {
  // Deletes ALL existing entries
  return knex('balance').del()
    .then(function () {
      // Inserts seed entries
      return knex('balance').insert(balance);
    });
};
