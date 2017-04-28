import { Connect, QRUtil } from 'uport-connect'

const customOpenQr = (data, cancel) => {
  console.log('--UportProvider#customOpenQr', data)
  QRUtil.openQr(data, cancel)
}

const uportProvider = new Connect('ChronoBank', {
  uriHandler: customOpenQr,
  closeUriHandler: QRUtil.closeQr
})

export default uportProvider
