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
            "internalType": "uint16",
            "name": "currentFameBalance",
            "type": "uint16"
          },
          {
            "indexed": false,
            "internalType": "uint16",
            "name": "currentSpotCacheCoinBalance",
            "type": "uint16"
          }
        ],
        "name": "ConvertedFameToCacheCoin",
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
            "name": "cacheTokenId",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint16",
            "name": "currentFameBalance",
            "type": "uint16"
          },
          {
            "indexed": false,
            "internalType": "uint16",
            "name": "currentSpotCacheCoinBalance",
            "type": "uint16"
          }
        ],
        "name": "MintedCache",
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
            "name": "cacheTokenId",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "bytes32",
            "name": "entryHash",
            "type": "bytes32"
          },
          {
            "indexed": false,
            "internalType": "uint16",
            "name": "currentFameBalance",
            "type": "uint16"
          }
        ],
        "name": "MintedEntry",
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
          },
          {
            "indexed": false,
            "internalType": "uint16",
            "name": "currentFameBalance",
            "type": "uint16"
          },
          {
            "indexed": false,
            "internalType": "uint16",
            "name": "currentSpotCacheCoinBalance",
            "type": "uint16"
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
            "internalType": "uint256",
            "name": "cacheTokenId",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint64",
            "name": "spotId",
            "type": "uint64"
          },
          {
            "indexed": false,
            "internalType": "uint16",
            "name": "currentFameBalance",
            "type": "uint16"
          },
          {
            "indexed": false,
            "internalType": "uint16",
            "name": "currentSpotCacheCoinBalance",
            "type": "uint16"
          }
        ],
        "name": "UnlockedCache",
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
        "inputs": [],
        "name": "getPossibleRevertMessages",
        "outputs": [
          {
            "internalType": "string[]",
            "name": "",
            "type": "string[]"
          }
        ],
        "stateMutability": "view",
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
        "name": "mintEntry",
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
        "name": "getCachesForSpot",
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
              },
              {
                "internalType": "address",
                "name": "author",
                "type": "address"
              }
            ],
            "internalType": "struct MetaTrail.CacheContainer[]",
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
            "name": "cacheTokenId",
            "type": "uint128"
          }
        ],
        "name": "unlockCache",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint128",
            "name": "cacheTokenId",
            "type": "uint128"
          }
        ],
        "name": "getUnlockedCacheMessages",
        "outputs": [
          {
            "internalType": "string[]",
            "name": "",
            "type": "string[]"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint128",
            "name": "cacheTokenId",
            "type": "uint128"
          }
        ],
        "name": "upvoteCache",
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
        "name": "convertFameToCacheCoin",
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
        "name": "getCacheCoinBalanceForSpot",
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
        "name": "getFameBalance",
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
        const estimatedGasSpending = utils.hexlify(await this._directNetworkContract.estimateGas.mintEntry(message, lon, lat, autoconvert, {from: this.connectedAccount}));console.log('gas estimate: ' + estimatedGasSpending);
        const feeData = await this._provider.getFeeData();
        const value = utils.hexlify(0);
        const data = this._directNetworkContract.interface.encodeFunctionData("mintEntry", [ message, lon, lat, autoconvert ]);
      
      console.log('nonce: ' + nonce);
        const tx = {
            from: this.connectedAccount,
            to: this._metatrail_contract_address,
            nonce: nonce,
            value: value,
            data: data,
          };
       
         const result = await this.connector.sendTransaction(tx);
        console.log("res");
          console.log(result);
       
      }

  
  /*
getTeasedMessagesForSpot(uint32 longitude, uint32 latitude)
*/
  async getCachesForSpot(lon, lat) {
    const spotCaches = await this._directNetworkContract.getCachesForSpot( lon, lat, { from: this.connectedAccount });
    return spotCaches;
  }

  /*
getUnlockedCacheEntries(uint128 messageTokenId)
*/
  async getUnlockedCacheEntries(cacheTokenId) {
    const message = await this._directNetworkContract.getUnlockedCacheEntries(cacheTokenId, { from: this.connectedAccount });
    return message;
  }

  
  async getFameBalance() {
    const balance = await this._directNetworkContract.getFameBalance({ from: this.connectedAccount });   
    return balance;
  }

}
