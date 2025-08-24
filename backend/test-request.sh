#!/bin/bash

echo "Testando criação de usuário via GraphQL..."

curl --location 'http://localhost:3000/graphql' \
--header 'Content-Type: application/json' \
--data-raw '{
    "query": "mutation CreateUser($input: CreateUserInput!) { createUser(input: $input) { id email name lastname role status createdAt } }",
    "variables": {
        "input": {
            "email": "joao.silva@example.com",
            "name": "João",
            "lastname": "Silva",
            "birthdate": "1990-01-15",
            "role": "USER",
            "genderId": "550e8400-e29b-41d4-a716-446655440001",
            "professionId": "660e8400-e29b-41d4-a716-446655440001",
            "password": "senha123456"
        }
    }
}'

echo -e "\n\nTeste concluído!"
