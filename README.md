# irccloud-headless
phantomjs script to login to irccloud in a headless environment.

## To Run
First, create the config file

    echo "{\"user\":\"<username>\",\"password\":\"<password>\"}" > config.json;

Then run the script

    phantomjs index.js

## Debug Page
Browse to [localhost:9006](http://localhost:9006/). It will update every 1 second with a screenshot of the currently rendered page.
