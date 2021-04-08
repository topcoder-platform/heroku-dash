#!/bin/sh
echo "fixing geo.json comma issue"
echo $1
sed -ie 's/,}/}/g' $1
sed -ie 's/:,/:/g' $1

echo "done with geo.json"
