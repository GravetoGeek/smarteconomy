#!/bin/bash

echo "Testando query userById com ID inexistente..."

curl --location 'http://localhost:3000/graphql' \
--header 'Content-Type: application/json' \
--data-raw '{
    "query": "query { userById(id: \"12345678-1234-1234-1234-123456789012\") { id name email } }",
    "variables": {}
}'

echo -e "\n\nTeste concluído!"
