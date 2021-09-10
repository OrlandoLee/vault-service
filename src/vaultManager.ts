import { ethers } from "ethers";
import * as fs from 'fs';
import NodeCache from "node-cache";

export class VaultManager {
    // store this key as a secret in docker
readonly url = "https://eth-rinkeby.alchemyapi.io/v2/gqSNg4syRJReQ7KKtvNIPo8SLfD1ynVI";
readonly vaultAddress = "0x116ffe052ab4648F257eBE55c8eED0401c808022";
readonly provider = new ethers.providers.JsonRpcProvider(this.url);
readonly filter = {
  address: this.vaultAddress
}
// right now we don't have the event for updating a vault, when we have that I could update this
readonly topicSets = [
  ethers.utils.id("VaultCreated(address,uint256,uint256,uint256)")
]
readonly jsonAbi = JSON.parse(fs.readFileSync('./src/abi.json').toString());

readonly iface = new ethers.utils.Interface(this.jsonAbi);
readonly vaultAbi = this.iface.format(ethers.utils.FormatTypes.full);

// The Contract object
readonly valutContract = new ethers.Contract(this.vaultAddress, this.vaultAbi, this.provider);

// invalid cache every 24 hours
// update cache when an event is consumed
vaultCache = new NodeCache({ stdTTL: 3600*24});


public async getRawVaults () {
  const result = [];
  for (let i = 0; i < await this.valutContract.vaultsCount(); i++) {
    const currentValut = await this.valutContract.vaults(i);
    // refactor this
    result.push(
      {
        'owner': currentValut.owner,
        'collateral': ethers.utils.formatEther(currentValut.collateral),
        'debt': ethers.utils.formatEther(currentValut.debt)
      }
    )
  }
  return result;
}

public turnCallBackOn () {
    this.provider.on(this.topicSets, (log: { data: any; }) => {
    // this.provider.on([null], (log: { data: any; }) => {
        const resultData = log.data;
        // const resultData = "0x0000000000000000000000000ce03e8163b2a88106093f5f4e6f9ee3da423997000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000038d7ea4c6800000000000000000000000000000000000000000000000000006f05b59d3b20000";
        const parsedVaultCreated = this.iface.decodeEventLog("VaultCreated", resultData);
        const newVault = {
            'owner': parsedVaultCreated._user,
            'collateral': ethers.utils.formatEther(parsedVaultCreated._collateral),
            'debt': ethers.utils.formatEther(parsedVaultCreated._debt)
        };
        this.vaultCache.set(parsedVaultCreated._user, newVault);
        // tslint:disable-next-line:no-console
        console.log('vault updated: ', parsedVaultCreated._user);
        })
}


public async getVaults () {
  if(this.vaultCache.keys().length > 0){
    return this.vaultCache.keys().map((address: string) => this.vaultCache.get(address));
  } else {
    const result = await this.getRawVaults();
    result.forEach(vault => {
        this.vaultCache.set(vault.owner, vault)
    });
    return result;
  }
}

}


