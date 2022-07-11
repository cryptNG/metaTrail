import Service from '@ember/service';
import WalletConnect from "@walletconnect/client";
import { convertUtf8ToHex } from "@walletconnect/utils";
import { IInternalEvent } from "@walletconnect/types";
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import QRCodeModal from "@walletconnect/qrcode-modal";
import {providers, utils, Contract} from "ethers";

export default class WalletConnectService extends Service {
    
    _abi = [
        {
          "inputs": [],
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "approved",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
            }
          ],
          "name": "Approval",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "operator",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "bool",
              "name": "approved",
              "type": "bool"
            }
          ],
          "name": "ApprovalForAll",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "address",
              "name": "sender",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "address",
              "name": "addressToAllow",
              "type": "address"
            }
          ],
          "name": "AssignedAllowedServiceEvent",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "address",
              "name": "creator",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "fromHash",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "toHash",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
            }
          ],
          "name": "MintedHashMapEvidence",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "address",
              "name": "sender",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint64",
              "name": "spotId",
              "type": "uint64"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "messageTokenId",
              "type": "uint256"
            }
          ],
          "name": "MintedMessage",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "previousOwner",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "newOwner",
              "type": "address"
            }
          ],
          "name": "OwnershipTransferred",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "address",
              "name": "sender",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "uint64",
              "name": "spotId",
              "type": "uint64"
            }
          ],
          "name": "SpotClaimed",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "from",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "to",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
            }
          ],
          "name": "Transfer",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "address",
              "name": "sender",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "address",
              "name": "addressToUnassign",
              "type": "address"
            }
          ],
          "name": "UnassignedAllowedServiceEvent",
          "type": "event"
        },
        {
          "inputs": [],
          "name": "owner",
          "outputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "renounceOwnership",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "newOwner",
              "type": "address"
            }
          ],
          "name": "transferOwnership",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "uri",
              "type": "string"
            }
          ],
          "name": "setBaseURI",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "getIsMintingActive",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "setIsMintingActive",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "setIsMintingInactive",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "uniCodeMessage",
              "type": "string"
            },
            {
              "internalType": "uint32",
              "name": "longitude",
              "type": "uint32"
            },
            {
              "internalType": "uint32",
              "name": "latitude",
              "type": "uint32"
            },
            {
              "internalType": "bool",
              "name": "autoConvertFame",
              "type": "bool"
            }
          ],
          "name": "mintMessage",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint32",
              "name": "longitude",
              "type": "uint32"
            },
            {
              "internalType": "uint32",
              "name": "latitude",
              "type": "uint32"
            }
          ],
          "name": "getTeasedMessagesForSpot",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "string",
                  "name": "message",
                  "type": "string"
                },
                {
                  "internalType": "uint128",
                  "name": "tokenId",
                  "type": "uint128"
                }
              ],
              "internalType": "struct MetaTrailToken.MessageContainer[]",
              "name": "",
              "type": "tuple[]"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint128",
              "name": "messageTokenId",
              "type": "uint128"
            }
          ],
          "name": "unlockMessage",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint128",
              "name": "messageTokenId",
              "type": "uint128"
            }
          ],
          "name": "getUnlockedMessage",
          "outputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint128",
              "name": "messageTokenId",
              "type": "uint128"
            }
          ],
          "name": "upvoteMessage",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint32",
              "name": "longitude",
              "type": "uint32"
            },
            {
              "internalType": "uint32",
              "name": "latitude",
              "type": "uint32"
            }
          ],
          "name": "convertFameToMessageCoin",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint32",
              "name": "longitude",
              "type": "uint32"
            },
            {
              "internalType": "uint32",
              "name": "latitude",
              "type": "uint32"
            }
          ],
          "name": "getMessageCoinBalanceForSpot",
          "outputs": [
            {
              "internalType": "uint16",
              "name": "",
              "type": "uint16"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "getFameCoinBalance",
          "outputs": [
            {
              "internalType": "uint16",
              "name": "",
              "type": "uint16"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "str",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "startIndex",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "endIndex",
              "type": "uint256"
            }
          ],
          "name": "_substring",
          "outputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            }
          ],
          "stateMutability": "pure",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "totalSupply",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "bytes4",
              "name": "interfaceId",
              "type": "bytes4"
            }
          ],
          "name": "supportsInterface",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "owner",
              "type": "address"
            }
          ],
          "name": "balanceOf",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
            }
          ],
          "name": "ownerOf",
          "outputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "name",
          "outputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "symbol",
          "outputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
            }
          ],
          "name": "tokenURI",
          "outputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "to",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
            }
          ],
          "name": "approve",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
            }
          ],
          "name": "getApproved",
          "outputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "operator",
              "type": "address"
            },
            {
              "internalType": "bool",
              "name": "approved",
              "type": "bool"
            }
          ],
          "name": "setApprovalForAll",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "operator",
              "type": "address"
            }
          ],
          "name": "isApprovedForAll",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "from",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "to",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
            }
          ],
          "name": "transferFrom",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "from",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "to",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
            }
          ],
          "name": "safeTransferFrom",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "from",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "to",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
            },
            {
              "internalType": "bytes",
              "name": "_data",
              "type": "bytes"
            }
          ],
          "name": "safeTransferFrom",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        }
      ] //abi goes here

    _web3addr = 'https://testnet.cryptng.com:8545';
    //_web3addr = 'http://127.0.0.1:9545';
    _metatrail_contract_address = '0x24dFe081d6e0530E65Da7d94bD8E3D9f8955bb6D';
    _provider = new providers.JsonRpcProvider(this._web3addr)
    _directNetworkContract = new Contract(this._metatrail_contract_address,this._abi,this._provider);
  

    @tracked connector;
    provider;
    bridge = "https://bridge.walletconnect.org";
    hasWalletEventsSet = false;
    
    @tracked connectedAccount = null;
    @service router;
    @tracked _isMintingActive = false;

    constructor()
    {
        super(...arguments);

        this.connector = new WalletConnect({bridge: this.bridge, qrcodeModal: QRCodeModal});
       
        console.log('provider');
        console.log(this._provider);
        console.log('directNetworkContract');
        console.log(this._directNetworkContract);
        
    }

    get isConnected()
    {
        console.log(this.connector.connected);
        console.log(this.connectedAccount);
        return this.connector.connected;
    }

    async disconnect() 
    {
        await this.connector.killSession();
        
        await this.connector.createSession();
    }

    async registerHandlers(){
    
    
        if (this.hasWalletEventsSet) { 
            console.debug('wallet events are set');
            return; 
        }

        
     console.debug('registering web3 handlers');
     console.log(this.connector);
    
     this.connector.on("session_update", async (error, payload) => {
       console.log(`connector.on("session_update")`);
 
       if (error) {
         throw error;
       }
 
       const { chainId, accounts } = payload.params[0];

       this.connectedAccount = accounts[0];
       if(chainId != "1337") window.alert("incorrect chain");
     });
 
     this.connector.on("connect", (error, payload) => {
       console.log(`connector.on("connect")`);
 
       if (error) {
         throw error;
       }
       const { chainId, accounts } = payload.params[0];
       this.connectedAccount = accounts[0];
       if(chainId != "1337") window.alert("incorrect chain");
       
     });
 
     this.connector.on("disconnect", (error, payload) => {
       console.log(`connector.on("disconnect")`);
       this.connector.createSession();
       if (error) {
         throw error;
       }
 
     });
 
     if (this.connector.connected) {
       const { chainId, accounts } = this.connector;
       this.connectedAccount = accounts[0];
       if(chainId != "1337") window.alert("incorrect chain");
     }
     if (!this.connector.connected) {
        // create new session
        this.connector.createSession();
      }

      }

      async getIsMintingActive() {
        console.debug('asking contract if minting is active');
        let res = await this._directNetworkContract.getIsMintingActive();
        console.debug('result: ' + res);
        this._isMintingActive = res;
      }

      async mintMessage(message, lon, lat, autoconvert) {
       
        const iface = new utils.Interface(this._abi);
        const nonce = await this._provider.getTransactionCount(this.connectedAccount);
        const gasPrice = utils.hexlify(await this._provider.getGasPrice());
        const estimatedGasSpending = utils.hexlify(await this._directNetworkContract.estimateGas.mintMessage(message, lon, lat, autoconvert, {from: this.connectedAccount}) * 100000);
        console.log('gas estimate: ' + estimatedGasSpending);
        const gasLimit = utils.hexlify(300000);
        const value = utils.hexlify(0);
        const data = this._directNetworkContract.interface.encodeFunctionData("mintMessage", [ message, lon, lat, autoconvert ]);
      //     const tx = {
      //       from: this.connectedAccount,
      //       to: this._metatrail_contract_address,
      //       nonce: nonce,
      //       gasPrice: estimatedGasSpending,
      //       gasLimit: gasLimit,
      //       value: value,
      //       data: data,
      //     };
      //     const customRequest = {
      //       jsonrpc: "2.0",
      //       method: "eth_sendTransaction",
      //       params: [
      //           tx,
      //       ],
      //     };
      //  const result =  await this.connector.sendCustomRequest(customRequest);
      console.log('nonce: ' + nonce);
        const tx = {
            from: this.connectedAccount,
            to: this._metatrail_contract_address,
            nonce: nonce,
            gasPrice: estimatedGasSpending,
            gasLimit: gasLimit,
            value: value,
            data: data,
          };
       
         const result = await this.connector.sendTransaction(tx);
        console.log("res");
          console.log(result);
       
      }

        /*
   getMessageCoinBalanceForSpot(uint32 longitude, uint32 latitude)
   */
  async getMessageCoinBalanceForSpot(lon, lat) {
    const balance = await this._directNetworkContract.getMessageCoinBalanceForSpot( lon, lat, { from: this.connectedAccount });
    return balance;
  }
  /*
getTeasedMessagesForSpot(uint32 longitude, uint32 latitude)
*/
  async getTeasedMessagForSpot(lon, lat) {
    const teasedMessages = await this._directNetworkContract.getTeasedMessagesForSpot( lon, lat, { from: this.connectedAccount });
    return teasedMessages;
  }

  /*
getUnlockedMessage(uint128 messageTokenId)
*/
  async getUnlockedMessage(messageTokenId) {
    const message = await this._directNetworkContract.getUnlockedMessage(messageTokenId, { from: this.connectedAccount });
    return message;
  }
  /*
upvoteMessage(uint128 messageTokenId)
*/
  async upvoteMessage(messageTokenId) {

    return success;
  }
  /*
convertFameToMessageCoin(uint32 longitude, uint32 latitude)
*/
  async convertFameToMessageCoin(lon, lat) {

    return success;
  }
  /*
getFameCoinBalance()
*/
  async getFameCoinBalance() {
    const balance = await this._directNetworkContract.getFameCoinBalance({ from: this.connectedAccount });   
    return balance;
  }

  async getMessageCoinBalanceForSpot(lon, lat)
  {
    const balance = await this._directNetworkContract.getMessageCoinBalanceForSpot(lon, lat, { from: this.connectedAccount });   
    return balance;
  }

}
