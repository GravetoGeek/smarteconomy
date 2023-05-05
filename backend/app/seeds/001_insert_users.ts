import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";
import { Knex } from "knex";
import User from "../models/User";

let users: User[] = [];
for (let i = 0; i < 100; i++) {
    users.push({
        email: faker.internet.email().toLowerCase(),
        password: bcrypt.hashSync("12345678", 10),
    });
}

exports.seed = function (knex: Knex) {
    // Deletes ALL existing entries
    return knex("users")
        .del()
        .then(function () {
            // Inserts seed entries
            return knex("users").insert(users);
        });
};
