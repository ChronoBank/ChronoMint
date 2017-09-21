import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { MenuItem, SelectField } from 'material-ui'
import networkService, { clearErrors } from 'Login/redux/network/actions'
import { Translate } from 'react-redux-i18n'
import styles from 'Login/components/stylesLoginPage'

const mapStateToProps = (state) => {
  const network = state.get('network')
  return {
    selectedProviderId: network.selectedProviderId,
    providers: network.providers,
    isLoading: network.isLoading
  }
}

const mapDispatchToProps = (dispatch) => ({
  selectProvider: (providerId) => networkService.selectProvider(providerId),
  clearErrors: () => dispatch(clearErrors())
})

@connect(mapStateToProps, mapDispatchToProps)
class ProviderSelector extends Component {
  static propTypes = {
    clearErrors: PropTypes.func,
    selectProvider: PropTypes.func,
    selectedProviderId: PropTypes.number,
    providers: PropTypes.array,
    isLoading: PropTypes.bool
  }

  handleChange = (event, index, value) => {
    this.props.clearErrors()
    this.props.selectProvider(value)
  }

  render () {
    const {selectedProviderId, providers, isLoading} = this.props

    return (
      <SelectField
        floatingLabelText={<Translate value='ProviderSelector.provider'/>}
        onChange={this.handleChange}
        value={selectedProviderId}
        fullWidth
        disabled={isLoading}
        {...styles.selectField}>
        {providers && providers.map(p => (
          <MenuItem
            key={p.id}
            value={p.id}
            primaryText={p.name}
            disabled={p.disabled}
          />
        ))}
      </SelectField>
    )
  }
}

export default ProviderSelector
