#!/bin/bash


echo Post clone script for greenhouseci.com
echo Should be added as an environment script to the project build as the environment variable GH_POST_CLONE_SCRIPT
ls -ltra

npm install

hash grunt &> /dev/null
if [ $? -eq 1 ]; then
    npm install -g grunt-cli grunt
    echo >&2 "missing grunt-cli grunt, installing grunt-cli grunt"
fi
hash bower &> /dev/null
if [ $? -eq 1 ]; then
    npm install -g bower
    echo >&2 "missing bower, installing bower"
fi
hash cordova &> /dev/null
if [ $? -eq 1 ]; then
    npm install -g cordova
    echo >&2 "missing cordova, installing cordova"
fi

bower install
grunt build

cordova info
cordova prepare

ls -ltra
ls -ltra ./platforms
ls -ltra ./platforms/ios
ls -ltra ./platforms/android
