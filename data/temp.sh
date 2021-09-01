#sed -i '.bak' 's/PATHREPLACE/'"${PWD}"'/g' *.sql 
sed -i '.bak' 's?PATHREPLACE?'"${PWD}"'?g' *.sql 

echo ${PWD}