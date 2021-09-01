echo $1
sed -i '.bak' 's/REPLACEME/'"$1"'/g' ../*.html
