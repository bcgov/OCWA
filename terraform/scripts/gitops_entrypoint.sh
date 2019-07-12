#!/bin/sh

cd /tmp
npm install express body-parser

cp /app/gitops_simulator.js .

node ./gitops_simulator
