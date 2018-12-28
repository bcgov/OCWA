#!/bin/bash

for i in {1..30}; do
  RESULT=$(docker inspect --format='{{json .State.Health.Status}}' $1)
  if [ $RESULT == "\"healthy\"" ]; then
    echo "Waiting COMPLETE.. $1 HEALTHY"
    exit 0;
  else
    echo "Waiting.. $RESULT"
  fi
  sleep 5
done

exit 1;
