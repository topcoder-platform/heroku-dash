sed -i '.bak' 's/30153848/30171936/g' *.sql
sed -i '.bak' 's/REPLACEME/""$1""/g' ../*.html


heroku open
  ../../../../../Applications/DbVisualizer.app/Contents/Resources/app/dbviscmd.sh -connection Prod -catalog InformixOLTP -sqlfile ScorecardSQL-JSON.sql
#clean ukp submissions
#
#cd ..
#git add .
#git commit -m "adding source files to github"
#git push github master
#cd data
cp challenge-participants.mess challenge-participants.json
cp challenge-submissions.mess challenge-submissions.json
cp geo-data.mess geo-data.json
cp graph-data.mess graph-data.json

./awkSwapCountries.sh challenge-participants.json
./awkSwapCountries.sh challenge-submissions.json
./awkSwapCountries.sh geo-data.json

./fixGeoJson.sh geo-data.json


#echo "cleaning up submission links"
#tr -d '\n' < challenge-submission-text.csv | tr -d '\r' | tr '|' '\n' > challenge-submission-text-formatted.csv
#sed -ie "1d" challenge-submission-text-formatted.csv
#ruby findSubmission.rb
#echo "Finished formatting"

echo "formatting challenge stats"
sed -ie "1d" challenge-status.csv
ruby convertStats.rb

echo "formatting graph data"
sed -ie "1d" graph-data.csv
ruby convertGraphDataCSV.rb
echo "adding url for topcoder images for graph data"
sed -ie 's/\/i\/m/https:\/\/www.topcoder.com\/i\/m/g' graph-data.json
echo "adding files to git"
git add .
git commit -m "updated most recent files"
echo "ready for deploy"
cd ..
git push heroku master
echo "deployed"
heroku open
echo "opened site for testing"
cd data
echo "posting update to slack"

#curl -X POST --data-urlencode 'payload={"channel": "#data-sci-dashboard", "username": "data-sci-dashboard",          "text": "New data-sci-dashboard has been posted https://spacesuit-dash.herokuapp.com/ ", "icon_emoji": ":chart_with_upwards_trend:"}' https://hooks.slack.com/services/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
#curl -X POST --data-urlencode 'payload={"channel": "#nnsa-threat-detection", "username": "data-sci-dashboard",          "text": "New data-sci-dashboard has been posted http://radiological.topcoder.com ", "icon_emoji": ":chart_with_upwards_trend:"}' https://hooks.slack.com/services/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
