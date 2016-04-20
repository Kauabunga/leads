#!/bin/bash


# Pre build script for greenhouseci.com
# Should be added as an environment script to the project build as the environment variable GH_POST_CLONE_SCRIPT


npm install

hash grunt &> /dev/null
if [ $? -eq 1 ]; then
    npm install -g grunt
    echo >&2 "missing grunt, installing grunt"
fi
hash bower &> /dev/null
if [ $? -eq 1 ]; then
    npm install -g bower
    echo >&2 "missing bower, installing bower"
fi

bower install
cordova prepare
grunt build
