import {Map} from 'immutable'
import AbstractContractDAO from './AbstractContractDAO'
import OrbitDAO from './OrbitDAO'
import CBEModel from '../models/CBEModel'
import UserModel from '../models/UserModel'

class UserStorage extends AbstractContractDAO {
  constructor () {
    super(require('../contracts/UserStorage.json'))
  }
}

const storage = new UserStorage()

class UserDAO extends AbstractContractDAO {
  /**
   * @param account from
   * @param block number
   * @return {Promise.<bool>}
   */
  isCBE (account: string, block = 'latest') {
    return storage.contract.then(deployed => deployed.getCBE.call(account, {}, block))
  };

  countCBE () {
    return storage.contract.then(deployed => deployed.adminCount.call().then(r => r.toNumber()))
  };

  countUsers () {
    return storage.contract.then(deployed => deployed.userCount.call().then(r => r.toNumber() - 1))
  };

  /**
   * @param account for which you want to get profile
   * @param block
   * @return {Promise.<UserModel>}
   */
  getMemberProfile (account: string, block = 'latest') {
    return new Promise(resolve => {
      this.contract.then(deployed => {
        deployed.getMemberHash.call(account, {}, block).then(result => {
          OrbitDAO.get(this._bytes32ToIPFSHash(result)).then(data => {
            resolve(new UserModel(data))
          })
        })
      })
    })
  };

  /**
   * @param account
   * @param profile
   * @param own true to change own profile, false to change foreign profile
   * @param from account if own is false
   * @return {Promise.<bool>}
   */
  setMemberProfile (account: string, profile: UserModel, own: boolean = true, from: string = null) {
    return new Promise((resolve, reject) => {
      this.getMemberProfile(account).then(currentProfile => {
        if (JSON.stringify(currentProfile.toJS()) === JSON.stringify(profile.toJS())) {
          return resolve(true)
        }
        OrbitDAO.put(profile.toJS()).then(value => {
          const hash = this._IPFSHashToBytes32(value)
          this.contract.then(deployed => {
            const params = {from: own ? account : from, gas: 3000000}
            if (own) {
              deployed.setOwnHash(hash, params).then(r => resolve(r)).catch(e => reject(e))
            } else {
              deployed.setMemberHash(account, hash, params).then(r => resolve(r)).catch(e => reject(e))
            }
          })
        })
      })
    })
  };

  /** @return {Promise.<Map[string,CBEModel]>} associated with CBE account address */
  getCBEList () {
    return new Promise(resolve => {
      storage.contract.then(deployed => {
        deployed.getCBEMembers.call().then(result => {
          const addresses = result[0]
          const hashes = result[1]
          let map = new Map()
          const callback = (address, hash) => {
            OrbitDAO.get(hash).then(data => {
              const user = new UserModel(data)
              map = map.set(address, new CBEModel({
                address: address,
                name: user.name(),
                user
              }))
              if (map.size === addresses.length) {
                resolve(map)
              }
            })
          }
          for (let key in addresses) {
            if (addresses.hasOwnProperty(key) && hashes.hasOwnProperty(key)) {
              callback(
                addresses[key],
                this._bytes32ToIPFSHash(hashes[key])
              )
            }
          }
        })
      })
    })
  };

  /**
   * @param cbe
   * @param account from
   * @return {Promise.<bool>} result
   */
  treatCBE (cbe: CBEModel, account: string) {
    const updateProfile = new Promise((resolve, reject) => {
      this.getMemberProfile(cbe.address()).then(user => {
        if (cbe.name() === user.name()) {
          resolve(cbe)
        }
        user = user.set('name', cbe.name())
        this.setMemberProfile(cbe.address(), user, false, account).then(() => {
          resolve(cbe.set('user', user))
        }).catch(e => {
          reject(e)
        })
      })
    })
    return updateProfile.then(cbe => {
      return this.contract.then(deployed => {
        return this.isCBE(cbe.address()).then(isCBE => {
          return isCBE ? cbe : deployed.addKey(cbe.address(), {from: account, gas: 3000000})
        })
      })
    })
  };

  /**
   * @param cbe
   * @param account from
   * @return {Promise.<bool>} result
   */
  revokeCBE (cbe: CBEModel, account: string) {
    return new Promise((resolve, reject) => {
      this.contract.then(deployed => {
        deployed.revokeKey(cbe.address(), {from: account, gas: 3000000})
          .then(r => resolve(r.logs[0].args.hash))
          .catch(e => reject(e))
      })
    })
  };

  /**
   * @param callback will receive CBEModel, timestamp, isRevoked flag and flag isOld for old events
   * @see CBEModel updated/revoked element
   * @param account from
   */
  watchCBE (callback, account: string) {
    return this.contract.then(deployed => {
      return this._watch(deployed.cbeUpdate, (result, block, time, isOld) => {
        const address = result.args.key
        if (address === account) {
          return
        }
        this.isCBE(address, block).then(isNotRevoked => {
          this.getMemberProfile(address, block).then(user => {
            callback(new CBEModel({
              address,
              user,
              name: user.name()
            }), time, !isNotRevoked, isOld)
          })
        })
      }, 'cbeUpdate')
    })
  };

  signaturesRequired (account: string) {
    return this.contract
      .then(deployed => deployed.required.call({from: account}))
      .then(r => r.toNumber())
  };

  setRequiredSignatures (required: number, account: string) {
    return this.contract.then(deployed => deployed.setRequired(required, {from: account, gas: 3000000}))
  };
}

export default new UserDAO(require('../contracts/UserManager.json'))
