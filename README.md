# start
npm install
npm run start
# localhost:3000/vaults

# back up snapshot to ipfs
## make sure the server is running and ipfs is installed
## this will automatically run every 24 hours
chmod +x ./backup_snapshot_script.sh
./backup_snapshot_script.sh

# architecture desgin trade-offs
cache is used instead of db because we might wanna flush the cache daily to fix events are missed case
