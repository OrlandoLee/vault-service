#!/bin/sh
today=`date +%Y_%m_%d_%H_%M_%S`
curl -H "Accept: application/json" http://localhost:3000/vaults -o "$PWD/snapshots/${today}.json"
# write to ipfs
ipfs add "$PWD/snapshots/${today}.json" >> ipfs.txt