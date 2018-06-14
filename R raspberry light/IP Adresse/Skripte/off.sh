#!/bin/sh

curl -H "Content-Type: application/json" -X POST -d '{"licht": 0 }' http://localhost:3000/licht
