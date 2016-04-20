#!/bin/bash


echo Post build script for greenhouseci.com
echo Should be added as an environment script to the project build as the environment variable GH_POST_BUILD_SCRIPT
ls -ltra


cordova build android

echo Because we cannot get Greenhouse to detect the main andorid repo we can build it ourselves using cordova and copy it across to be detected under the CordovaLib project that is detected

mkdir ./platforms/android/CordovaLib/build/outputs/apk
cp ./platforms/android/build/outputs/apk/android-debug.apk ./platforms/android/CordovaLib/build/outputs/apk/android-debug.apk
