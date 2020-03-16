#!/bin/bash

PUBLICATION_POINTS=$1
REPOSITORIES="repositories.txt"

#jq '.fruit as $f | {"name" : "apple"} | IN($f[])' "$PUBLICATION_POINTS"

for row in $(jq -r '.[] | select(.repository)  | @base64' "$PUBLICATION_POINTS"); do
  _jq() {
      echo "${row}" | base64 --decode | jq -r "${1}"
  }

  REPOSITORY=$(_jq '.repository')
  BRANCH=$(_jq '.branchtag')

  if [[ "$REPOSITORY" == *"https://github.com/Informatievlaanderen"* ]]; then
      cat "$REPOSITORIES" | grep "$REPOSITORY"
      if [ $? -ne 0 ]; then
        git clone "$REPOSITORY"
        cd "$REPOSITORY"
        git checkout "$BRANCH"
        if [ -f "stakeholders.csv" ]; then
          echo "OK"
        fi
      fi
  fi

done
