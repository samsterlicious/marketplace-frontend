#!/usr/bin/env bash

pushd angular
npx ng build
popd
cdk deploy -c config=dev