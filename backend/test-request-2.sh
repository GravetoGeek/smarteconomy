#!/bin/bash

echo "Testando criação de usuário via GraphQL (email diferente)..."

curl --location 'http://localhost:3000/graphql' \
--header 'Content-Type: application/json' \
--data-raw '{
    "query": "mutation CreateUser($input: CreateUserInput!) { createUser(input: $input) { id email name lastname role status createdAt } }",
    "variables": {
        "input": {
            "email": "maria.silva@example.com",
            "name": "Maria",
            "lastname": "Silva",
            "birthdate": "1992-05-20",
            "role": "USER",
            "genderId": "550e8400-e29b-41d4-a716-446655440002",
            "professionId": "660e8400-e29b-41d4-a716-446655440002",
            "password": "senha123456"
        }
    }
}'

echo -e "\n\nTeste concluído!"
