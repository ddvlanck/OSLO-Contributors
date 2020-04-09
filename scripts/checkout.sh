#!/bin/bash

ROOTDIR=$1

git clone "https://github.com/Informatievlaanderen/OSLO-Generated" "$ROOTDIR"
cd "$ROOTDIR/OSLO-Generated"
git checkout test

## The commit.json file is only used to trigger the circle ci configuration in this repository
curl -o "$ROOTDIR/commit.json" https://raw.githubusercontent.com/ddvlanck/OSLO-Contributors/master/publication.json
sleep 5s
jq . "$ROOTDIR/commit.json"

## Previous commits were made
if [ $? -eq 0 ]; then
  PREV_COMMIT=$(git rev-parse "$CURR_COMMIT^1")
  changedFiles=$(git diff --name-only "$PREV_COMMIT")
  cat "$changedFiles" | grep "all-*" >"$ROOTDIR/filesToProcess.txt"
else
  # No previous commit, process all files
  ## Find all files with "all*-"
  find report/doc -type f -name "all-*" >"$ROOTDIR/filesToProcess.txt"
fi

## Remove all irrelevant files
sed -i '/martins-playground/d' "$ROOTDIR/filesToProcess.txt"
sed -i '/\/documentatie\//d' "$ROOTDIR/filesToProcess.txt"
