#!/bin/bash

echo "Testando mutation updateUser com ID inexistente..."

curl --location 'http://localhost:3000/graphql' \
--header 'Content-Type: application/json' \
--data-raw '{
    "query": "mutation UpdateUser($id: String!, $input: UpdateUserInput!) { updateUser(id: $id, input: $input) { id name email } }",
    "variables": {
        "id": "12345678-1234-1234-1234-123456789012",
        "input": {
            "name": "Nome Atualizado"
        }
    }
}'

echo -e "\n\nTestando mutation deleteUser com ID inexistente..."

curl --location 'http://localhost:3000/graphql' \
--header 'Content-Type: application/json' \
--data-raw '{
    "query": "mutation DeleteUser($id: String!) { deleteUser(id: $id) { id name email } }",
    "variables": {
        "id": "12345678-1234-1234-1234-123456789012"
    }
}'

echo -e "\n\nTeste concluído!"
