#!/bin/sh

curl -H "Content-Type: application/json" -X POST -d '{"licht":1 }' http://localhost:3000/licht
