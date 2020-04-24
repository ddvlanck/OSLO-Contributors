#!/bin/bash

ROOTDIR=$1
curl - o '$ROOTDIR/publication.json' https://raw.githubusercontent.com/Informatievlaanderen/Data.Vlaanderen.be/test/config/publication.json

if cat "$ROOTDIR/publication.json" | jq -e . >/dev/null 2>&1; then
  # Only iterate over those that have a repository
  for row in $(jq -r '.[] | select(.repository)  | @base64 ' "$ROOTDIR/changedstandards.json"); do
    _jq() {
      echo "${row}" | base64 --decode | jq -r "${1}"
    }

    TYPE=$(_jq '.type')

    if [ "$TYPE" == "raw" ]; then
      echo 'ok'
    fi


  done
else
  echo "Problem processing following file: $ROOTDIR/publication.json"
fi
