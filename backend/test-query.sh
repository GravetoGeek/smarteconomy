#!/bin/bash

echo "Testando query userByEmail..."

curl --location 'http://localhost:3000/graphql' \
--header 'Content-Type: application/json' \
--data-raw '{
    "query": "query { userByEmail(email: \"edusrm11@gmail.com\") { id name role } }",
    "variables": {}
}'

echo -e "\n\nTeste concluído!"
