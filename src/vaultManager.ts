import { ethers } from "ethers";
import * as fs from 'fs';

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
}
