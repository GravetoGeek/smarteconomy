#!/bin/bash

echo "Testando criação de usuário via GraphQL (novo email)..."

curl --location 'http://localhost:3000/graphql' \
--header 'Content-Type: application/json' \
--data-raw '{
    "query": "mutation CreateUser($input: CreateUserInput!) { createUser(input: $input) { id email name lastname role status createdAt } }",
    "variables": {
        "input": {
            "email": "pedro.oliveira@example.com",
            "name": "Pedro",
            "lastname": "Oliveira",
            "birthdate": "1988-12-10",
            "role": "USER",
            "genderId": "550e8400-e29b-41d4-a716-446655440001",
            "professionId": "660e8400-e29b-41d4-a716-446655440003",
            "password": "minhasenha123"
        }
    }
}'

echo -e "\n\nTeste concluído!"
