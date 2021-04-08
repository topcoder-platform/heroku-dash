#!/bin/sh
echo "removing header and adding surrounding [] and removing last comma "
echo $1
sed -ie "1d" $1
sed -ie '/^\s*$/d' $1
sed -ie '1s/^/[/g' $1
sed -ie  '$s/,$/]/' $1
echo "adding www.topcoder.com path for images"
sed -ie 's/"avatar":"\/i\/m/"avatar":"https:\/\/www.topcoder.com\/i\/m/g' $1

#sed -ie 's/"Poland","countryFlag":""/"Poland","countryFlag":".\/i\/pl-flag.png"/g' $1
#sed -ie 's/"China","countryFlag":""/"China","countryFlag":".\/i\/cn-flag.png"/g' $1
#sed -ie 's/"France","countryFlag":""/"France","countryFlag":".\/i\/fr-flag.png"/g' $1
#sed -ie 's/"Ukraine","countryFlag":""/"Ukraine","countryFlag":".\/i\/ua-flag.png"/g' $1
#sed -ie 's/"Slovakia","countryFlag":""/"Slovakia","countryFlag":".\/i\/sk-flag.png"/g' $1
#sed -ie 's/"Brazil","countryFlag":""/"Brazil","countryFlag":".\/i\/br-flag.png"/g' $1
#sed -ie 's/"United States","countryFlag":""/"United States","countryFlag":".\/i\/us-flag.png"/g' $1
#sed -ie 's/"Russia","countryFlag":""/"Russia","countryFlag":".\/i\/ru-flag.png"/g' $1
#sed -ie 's/"Switzerland","countryFlag":""/"Switzerland","countryFlag":".\/i\/ch-flag.png"/g' $1
#sed -ie 's/"Germany","countryFlag":""/"Germany","countryFlag":".\/i\/de-flag.png"/g' $1
#sed -ie 's/"Taiwan","countryFlag":""/"Taiwan","countryFlag":".\/i\/tw-flag.png"/g' $1
#sed -ie 's/"Netherlands","countryFlag":""/"Netherlands","countryFlag":".\/i\/nl-flag.png"/g' $1
#sed -ie 's/"Hungary","countryFlag":""/"Hungary","countryFlag":".\/i\/hu-flag.png"/g' $1
#sed -ie 's/"Italy","countryFlag":""/"Italy","countryFlag":".\/i\/it-flag.png"/g' $1
#sed -ie 's/"Japan","countryFlag":""/"Japan","countryFlag":".\/i\/jp-flag.png"/g' $1
#sed -ie 's/"Sri Lanka","countryFlag":""/"Sri Lanka","countryFlag":".\/i\/lk-flag.png"/g' $1
#sed -ie 's/"Spain","countryFlag":""/"Spain","countryFlag":".\/i\/es-flag.png"/g' $1
#sed -ie 's/"Singapore","countryFlag":""/"Singapore","countryFlag":".\/i\/sg-flag.png"/g' $1
#sed -ie 's/"Croatia","countryFlag":""/"Croatia","countryFlag":".\/i\/hr-flag.png"/g' $1
#sed -ie 's/"United Kingdom","countryFlag":""/"United Kingdom","countryFlag":".\/i\/gb-flag.png"/g' $1
#sed -ie 's/"Vietnam","countryFlag":""/"Vietnam","countryFlag":".\/i\/vn-flag.png"/g' $1
