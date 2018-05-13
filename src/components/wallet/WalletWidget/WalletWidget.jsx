/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import TokenModel from 'models/tokens/TokenModel'
import { Link } from 'react-router'
import MultisigWalletModel from 'models/wallet/MultisigWalletModel'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { selectWallet } from 'redux/wallet/actions'
import { modalsOpen } from 'redux/modals/actions'
import { Translate } from 'react-redux-i18n'
import { walletInfoSelector } from 'redux/wallet/selectors'
import { TOKEN_ICONS } from 'assets'
import { DUCK_TOKENS } from 'redux/tokens/actions'
import Button from 'components/common/ui/Button/Button'
import IPFSImage from 'components/common/IPFSImage/IPFSImage'
import { integerWithDelimiter } from 'utils/formatter'
import ReceiveTokenModal from 'components/dashboard/ReceiveTokenModal/ReceiveTokenModal'
import TokensCollection from 'models/tokens/TokensCollection'
import MainWalletModel from 'models/wallet/MainWalletModel'
import { getMainTokenForWalletByBlockchain } from 'redux/tokens/selectors'
import { BLOCKCHAIN_ETHEREUM } from 'dao/EthereumDAO'
import SendTokens from 'components/dashboard/SendTokens/SendTokens'
import DepositTokensModal from 'components/dashboard/DepositTokens/DepositTokensModal'
import { ETH } from 'redux/mainWallet/actions'

import './WalletWidget.scss'
import { prefix } from './lang'
import Moment from '../../common/Moment'
import SubIconForWallet from '../SubIconForWallet/SubIconForWallet'

function mapStateToProps (state, ownProps) {
  return {
    walletInfo: walletInfoSelector(ownProps.wallet, ownProps.blockchain, ownProps.address, state),
    token: getMainTokenForWalletByBlockchain(ownProps.blockchain)(state),
    tokens: state.get(DUCK_TOKENS),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    send: (tokenId, blockchain, address) => {
      dispatch(modalsOpen({
        component: SendTokens,
        props: {
          isModal: true,
          token: tokenId,
          blockchain,
          address,
        },
      }))
    },
    receive: (blockchain) => dispatch(modalsOpen({
      component: ReceiveTokenModal,
      props: {
        blockchain,
      },
    })),
    deposit: (props) => dispatch(modalsOpen({ component: DepositTokensModal, props })),
    selectWallet: (blockchain, address) => dispatch(selectWallet(blockchain, address)),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class WalletWidget extends PureComponent {
  static propTypes = {
    blockchain: PropTypes.string,
    wallet: PropTypes.oneOfType([
      PropTypes.instanceOf(MainWalletModel),
      PropTypes.instanceOf(MultisigWalletModel),
    ]),
    address: PropTypes.string,
    token: PropTypes.instanceOf(TokenModel),
    tokens: PropTypes.instanceOf(TokensCollection),
    walletInfo: PropTypes.shape({
      address: PropTypes.string,
      balance: PropTypes.number,
      tokens: PropTypes.array,
    }),
    send: PropTypes.func,
    receive: PropTypes.func,
    deposit: PropTypes.func,
    selectWallet: PropTypes.func,
    showGroupTitle: PropTypes.bool,
  }

  constructor (props) {
    super(props)

    this.state = {
      isShowAll: false,
    }
  }

  handleSend = () => {
    this.props.send(this.props.token.id(), this.props.blockchain, this.props.address)
  }

  handleReceive = () => {
    this.props.receive(this.props.blockchain)
  }

  handleDeposit = () => {
    this.props.deposit()
  }

  handleChangeShowAll = () => {
    this.setState({
      isShowAll: !this.state.isShowAll,
    })
  }

  handleSelectWallet = () => {
    const { address, blockchain } = this.props
    this.props.selectWallet(blockchain, address)
  }

  getTokensList = () => {
    return this.state.isShowAll ? this.props.walletInfo.tokens : this.props.walletInfo.tokens.slice(0, 2)
  }

  getOwnersList = () => {
    const ownersList = this.props.wallet.owners().items()

    if (ownersList.length <= 3) {
      return (
        <div styleName='owners-amount'>
          <div styleName='owners-list'>
            {ownersList.map((owner) => {
              return (
                <div styleName='owner-icon' key={owner.address()}>
                  <div styleName='owner' className='chronobank-icon' title={owner.address()}>profile</div>
                </div>
              )
            })
            }
          </div>
        </div>
      )
    }

    return (
      <div styleName='owners-amount'>
        <div styleName='owners-list'>
          {ownersList.slice(0, 2).map((owner) => {
            return (
              <div styleName='owner-icon'>
                <div styleName='owner' className='chronobank-icon' title={owner.address()}>profile</div>
              </div>
            )
          })
          }
          <div styleName='owner-counter'>
            <div styleName='counter'>+{ownersList.length - 2}</div>
          </div>
        </div>
      </div>
    )
  }

  getWalletName = () => {
    if (this.isMySharedWallet()) {
      return 'My Shared Wallet'
    } else if (this.isLockedWallet()) {
      return 'My Locked Wallet'
    }

    return 'My Wallet'
  }

  getAmountList = () => {
    const walletInfo = this.props.walletInfo

    if (walletInfo.tokens.length < 3) {
      return null
    }

    let ethToken = null

    walletInfo.tokens.some((token) => {
      if (token.symbol === ETH) {
        ethToken = token
        return true
      }
    })

    return (
      <div styleName='amount-list-container'>
        <div styleName='amount-list'>
          {ethToken && (
            <span styleName='amount-text'>
              {`${ethToken.symbol} ${ethToken.amount}`}, {`+ ${walletInfo.tokens.length - 1} more`}
            </span>
          )}
        </div>
        <div styleName='show-all'>
          <span styleName='show-all-a' onTouchTap={this.handleChangeShowAll}>{!this.state.isShowAll ? 'Show All' : 'Show less'}</span>
        </div>
      </div>
    )
  }

  isMySharedWallet = () => {
    return this.props.wallet.isMultisig() && !this.props.wallet.isTimeLocked()
  }

  isMainWallet = () => {
    return !this.props.wallet.isMultisig() && !this.props.wallet.isTimeLocked()
  }

  isLockedWallet = () => {
    return this.props.wallet.isMultisig() && this.props.wallet.isTimeLocked()
  }

  render () {
    const { address, token, blockchain, walletInfo, wallet, showGroupTitle } = this.props
    const firstToken = walletInfo.tokens[ 0 ]

    if (!walletInfo || walletInfo.balance === null || !walletInfo.tokens.length > 0) {
      return null
    }

    return (
      <div styleName='header-container'>
        {showGroupTitle && <h1 styleName='header-text' id={blockchain}><Translate value={`${prefix}.walletTitle`} title={blockchain} /></h1>}
        <div styleName='wallet-list-container'>

          <div styleName='wallet-container'>
            {/*<div styleName='settings-container'>*/}
            {/*<div styleName='settings-icon' className='chronobank-icon'>settings</div>*/}
            {/*</div>*/}
            <div styleName='token-container'>
              {blockchain === BLOCKCHAIN_ETHEREUM && <SubIconForWallet wallet={wallet} />}
              <div styleName='token-icon'>
                <IPFSImage styleName='image' multihash={token.icon()} fallback={TOKEN_ICONS[ token.symbol() ]} />
              </div>
            </div>
            <div styleName='content-container'>
              <Link styleName='addressWrapper' href='' to='/wallet' onTouchTap={this.handleSelectWallet}>
                <div styleName='address-title'>
                  <h3>{this.getWalletName()}</h3>
                  <span styleName='address-address'>{address}</span>
                </div>

                {this.isMainWallet() ? (
                  <div styleName='token-amount'>
                    <div styleName='crypto-amount'>
                      {firstToken.symbol} {integerWithDelimiter(firstToken.amount, true, null)}
                    </div>
                    <div styleName='usd-amount'>
                      USD {integerWithDelimiter(firstToken.amountPrice.toFixed(2), true)}
                    </div>
                  </div>
                ) : (
                  <div styleName='token-amount'>
                    <div styleName='crypto-amount'>
                      USD {integerWithDelimiter(walletInfo.balance.toFixed(2), true)}
                    </div>
                  </div>
                )}
              </Link>

              {this.isMySharedWallet() && this.getOwnersList()}

              {this.getAmountList()}

              {this.getTokensList().length > 1 && (
                <div styleName='tokens-list'>
                  <div styleName='tokens-list-table'>
                    {this.getTokensList().map((tokenMap) => {
                      const token = this.props.tokens.item(tokenMap.symbol)

                      if (!token.isFetched()) {
                        return null
                      }
                      return (
                        <div styleName='tokens-list-table-tr' key={token.id()}>
                          <div styleName='tokens-list-table-cell-icon'>
                            <IPFSImage styleName='table-image' multihash={token.icon()} fallback={TOKEN_ICONS[ token.symbol() ] || TOKEN_ICONS.DEFAULT} />
                          </div>
                          <div styleName='tokens-list-table-cell-amount'>
                            {tokenMap.symbol} {integerWithDelimiter(tokenMap.amount, true, null)}
                          </div>
                          <div styleName='tokens-list-table-cell-usd'>
                            USD {integerWithDelimiter(tokenMap.amountPrice.toFixed(2), true)}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {wallet.isTimeLocked() && (
                <div styleName='unlockDateWrapper'>
                  <Translate value={`${prefix}.unlockDate`} /> <Moment data={wallet.releaseTime()} format='HH:mm, Do MMMM YYYY' />
                </div>
              )}

              <div styleName='actions-container'>
                <div styleName='action'>
                  <Button
                    disabled={false}
                    type='submit'
                    label={<Translate value={`${prefix}.sendButton`} />}
                    onTouchTap={this.handleSend}
                  />
                </div>
                <div styleName='action'>
                  <Button
                    disabled={false}
                    type='submit'
                    label={<Translate value={`${prefix}.receiveButton`} />}
                    onTouchTap={this.handleReceive}
                  />
                </div>
                {/*blockchain === BLOCKCHAIN_ETHEREUM && (
                  <div styleName='action'>
                    <Button
                      disabled={false}
                      flat
                      type='submit'
                      label={<Translate value={`${prefix}.depositButton`} />}
                      onTouchTap={this.handleDeposit}
                    />
                  </div>
                )*/}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
