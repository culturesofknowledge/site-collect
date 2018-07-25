#!/usr/bin/env bash

echo
echo "Setting up PRODUCTION copy of EMLO-EDIT..."
echo
echo

# Build, run, in background.
docker-compose up -d --build --remove-orphans
sleep 5
docker-compose ps