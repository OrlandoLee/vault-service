## **start**

    npm install
    npm run start

go to 

    localhost:3000/vaults
response
    [{"owner":"0x0000000000000000000000000000000000000000","collateral":"0.0","debt":"0.0"},{"owner":"0x0cE03e8163B2a88106093F5F4e6f9eE3dA423997","collateral":"0.001","debt":"0.5"}]

## **back up snapshot to ipfs**

*make sure the server is running and ipfs is installed*
*this will automatically run everyday at 8:00 UTC*
to **manually** run backup

    chmod +x ./backup_snapshot_script.sh
    ./backup_snapshot_script.sh



## architecture design trade-offs

**memory cache vs db**
cache is used instead of db because we might wanna flush the cache daily to fix the cache when events are missed. Cache is set to be valid for 24 hours

**account level cache vs snapshot level cache**
account level cache is used in case we will need to access/update entry on account level

## tests

    npm test

test structure is set up, but mock is not set up yet.
