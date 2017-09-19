import * as user from '../dao/UserManagerDAO'
import * as voting from '../dao/VotingDAO'
import * as erc20 from '../dao/ERC20DAO'
import * as eth from 'dao/EthereumDAO'
import * as erc20Manager from 'dao/ERC20ManagerDAO'
import * as operations from '../dao/PendingManagerDAO'
import * as time from '../dao/TIMEHolderDAO'
import * as rewards from '../dao/RewardsDAO'
import * as loc from '../dao/LOCManagerDAO'
import * as assetDonator from '../dao/AssetDonatorDAO'
import * as exchange from '../dao/ExchangeDAO'
import { ru as LoginPage } from 'pages/LoginPage/lang'
import { ru as components } from 'components/lang'

export default {
  title: 'Рус',
  LoginPage,
  ...components,
  global: {
    about: 'О Проекте',
    labourHours: 'Labour—Hours',
    laborx: 'LaborX',
    team: 'Команда',
    faq: 'Q&A',
    blog: 'Блог'
  },
  nav: {
    project: 'ChronoMint',
    dashboard: 'Панель пользователя',
    cbeDashboard: 'Панель CBE',
    locs: 'Управление LOC',
    lhOperations: 'LH операции',
    operations: 'Операции',
    settings: 'Настройки',
    wallet: 'Кошелёк',
    exchange: 'Обмен (demo)',
    voting: 'Голосование',
    rewards: 'Награды',
    profile: 'Профайл',
    signOut: 'Выйти',
    search: 'Искать...',
    actions: 'Действия',
    loadMore: 'Загрузить еще',
    markupDashboard: 'Панель управления',
    markupWallet: 'Новый Кошелёк',
    newRewards: 'Новые Награды',
    pageNotFound: 'Страница не найдена',
    backToMain: 'Вернуться на главную'
  },
  common: {
    name: 'Имя',
    address: 'Адрес',
    ethAddress: 'Ethereum Адрес'
  },
  wallet: {
    sendTokens: 'Отправить токены',
    recipientAddress: 'Адрес получателя',
    selectTokenIcon: 'Пожалуйста выберите файл иконки',
    multisignature: 'Мультиподпись',
    mainWallet: 'Основной кошелёк',
    owners: 'владельцев',
    youHave: 'Вы имеете',
    multisignatureWallets: 'Мульти кошельков',
    switchMultisignatureWallet: 'Переключить мульти кошелёк',
    switchToMainWallet: 'Переключить на основной кошелёк',
    pendingTransfers: 'Проводимые переводы (demo)',
    to: 'Кому',
    value: 'Сумма',
    revoke: 'ОТОЗВАТЬ',
    sign: 'ПОДПИСАТЬ',
    walletSelectDialog: {
      multisignatureWallets: 'Мульти кошельки',
      addWallet: 'Добавить кошелёк',
      yourWallets: 'Ваши кошельки',
      youHaveNoWallets: 'У вас нет кошельков',
      howToAddMultisignatureWallet: "Как добавить мульти кошелёк? Это легко!",
      toCreateAMultisigWallet: 'Для создания мультиподписного кошелька',
      clickPlusButtonAtTheTop: 'Кликните кнопку плюс вверху',
      selectOwnersAtLeastTwo: 'Выбирите владельцев, минимум двух',
      selectRequiredNumberOfSignaturesFromOwners: 'Выбирите необходимое число подписей от владельцев',
      owners: 'владельцев'
    },
    walletAddEditDialog: {
      newWallet: 'Новый кошелёк',
      editWallet: 'Редактировать кошелёк',
      walletName: 'Название кошелька',
      dayLimit: 'Суточный лимит',
      requiredSignatures: 'Необходимо подписей',
      walletOwners: 'Владельцев',
      addOwner: 'Добавить владельца',
      addWallet: 'Добавить кошелёк',
      save: 'Сохранить',
      ownerAddress: 'Адрес владельца'
    }
  },
  exchange: {
    tokens: 'Обмен токенов',
    rates: 'Обменные курсы',
    exchange: 'Обменять',
    buyPrice: 'Цена покупки',
    sellPrice: 'Цена продажи',
    limits: 'Ограничения на обмен'
  },
  // common one-word terms
  terms: {
    account: 'Аккаунт',
    amount: 'Количество',
    currency: 'Валюта',
    asset: 'Актив',
    hash: 'Хэш',
    time: 'Время',
    value: 'Объем',
    buying: 'Купить',
    selling: 'Продать',
    block: 'Блок',
    action: 'Действие',
    balances: 'Счета',
    fee: 'Комиссия',
    send: 'Отправить',
    search: 'Поиск',
    status: 'Статус',
    website: 'Веб-сайт',
    cancel: 'Отменить',
    sendS: 'Отправить %{s}',
    close: 'Закрыть',
    confirm: 'Подтвердить',
    save: 'Сохранить',
    view: 'Просмотр',
    error: 'Ошибка',
    pending: 'В ожидании',
    failed: 'Не выполнено',
    remove: 'Удалить',
    modify: 'Изменить'
  },
  locs: {
    entries: '%{number} записей',
    sendToExchange: 'Отправить на обмен',
    recent: 'Последние LOC',
    insuranceFee: 'Insurance fee',
    allowedToBeIssued: 'Ограничение на выпуск',
    expirationDate: 'Дата экспирации',
    issuanceParameters: 'Параметры выпуска',
    sendLHToExchange: 'Отправит LH на обмен',
    uploadedFile: 'Загруженный файл',
    issueLHT: 'Выпустить LHT',
    issueS: 'Выпустить %{asset}',
    issueLimit: 'Ограничение выпуска',
    issued: 'Выпущено',
    // TODO @dkchv, @vlad: avoid LHT in tokens
    redeemLHT: 'Списать LHT',
    redeemS: 'Списать %{asset}',
    title: 'Название LOC',
    edit: 'Редактировать LOC',
    new: 'Новый LOC',
    delete: 'Удалить LOC',
    save: 'Сохранить изменения',
    create: 'Создать LOC',
    viewContract: 'Просмотреть контракт',
    editInfo: 'Редактировать LOC',
    daysLeft: 'дней осталось',
    daysLeft_1: 'день остался',
    daysLeft_2: 'дня осталось',
    daysLeft_3: 'дня осталось',
    daysLeft_4: 'дня осталось',
    updateStatus: 'Обновить статус',
    addedOn: 'Добавлен %{date}',
    forms: {
      amountToBeS: 'Значение на %{action}',
      allowedToBeS: 'Ограничение на %{action} от лица %{name}: %{limit} %{currency}',
      actions: {
        issued: 'выпуск',
        redeemed: 'списание'
      }
    },
    status: {
      maintenance: 'В разработке',
      active: 'Активный',
      suspended: 'Приостановлен',
      bankrupt: 'Банкрот',
      inactive: 'Неактивный'
    },
    notice: {
      added: 'Добавлен',
      removed: 'Удален',
      updated: 'Обновлен',
      statusUpdated: 'Статус обновлен',
      issued: 'Issued',
      revoked: 'Отозван'
    }
  },
  operations: {
    completed: 'Завершенные операции с последних 6000 блоков',
    settings: 'Настройки операций',
    desc: 'Описание',
    signs: 'Осталось подписать',
    sign: 'Подписать',
    revoke: 'Отозвать',
    emptyPendingList: 'Нет операций, ожидающих подписи.',
    emptyCompletedList: 'Нет завершенных операций.',
    adminCount: 'Кол-во CBE',
    requiredSigns: 'Необходимо подписей',
    errors: {
      // TODO @bshevchenko: move this duplicate error to the common tx errors list
      duplicate: 'Эта транзакция уже добавлена в список операций, требующих мультиподпись.',
      requiredSigns: 'Кол-во необходимых подписей не должно превышать кол-во CBE.'
    }
  },
  settings: {
    user: {
      title: 'Пользователь',
      cbeAddresses: {
        title: 'CBE Адреса'
      }
    },
    erc20: {
      title: 'ERC20 токены',
      tokens: {
        title: 'Токены',
        add: 'Добавить Токен',
        modify: 'Изменить Токен',
        symbol: 'Символ',
        url: 'URL проекта',
        decimals: 'Десятичные',
        icon: 'Иконка (TODO)',
        errors: {
          invalidAddress: 'Не могу найти валидный ERC20 контракт по этому адресу',
          symbolInUse: 'Этот символ уже используется',
          invalidSymbol: 'Символ может содержать только от 2 до 4 букв A-Z'
        }
      }
    }
  },
  notices: require('./ru-notices'),
  tx: {
    transactions: 'Транзакции',
    blockNumber: 'Номер блока',
    noTransactions: 'Нет транзакций',
    confirm: 'Подтвердить транзакцию',
    fee: 'Комиссия',
    balanceAfter: 'Баланс после',
    feeLeft: 'Комиссия оставшихся транзакций',
    UserManager: {
      [user.TX_ADD_CBE]: {
        title: 'Добавить CBE',
        name: 'Имя',
        address: 'Адрес'
      },
      [user.TX_REVOKE_CBE]: {
        title: 'Отозвать CBE',
        name: 'Имя',
        address: 'Адрес'
      },
      [user.TX_SET_REQUIRED_SIGNS]: {
        title: 'Мультиподпись',
        _required: 'Кол-во'
      },
      [user.TX_SET_OWN_HASH]: {
        title: 'Обновить свой профиль',
        name: 'Имя',
        email: 'E-mail',
        company: 'Компания',
        tokens: 'Токены'
      },
      [user.TX_SET_MEMBER_HASH]: {
        title: 'Обновить профиль',
        address: 'Адрес',
        name: 'Имя',
        email: 'E-mail',
        company: 'Компания'
      }
    },
    Ethereum: {
      [eth.TX_TRANSFER]: {
        title: 'Перевод ETH'
      }
    },
    ContractsManager: {},
    Vote: {
      [voting.TX_ADMIN_END_POLL]: {
        title: 'Окончить Опрос',
        id: 'Id'
      },
      [voting.TX_ACTIVATE_POLL]: {
        title: 'Активировать Опрос',
        id: 'Id'
      }
    },
    ChronoBankAssetProxy: {
      [erc20.TX_APPROVE]: {
        title: 'Одобить TIME',
        account: 'Аккаунт',
        amount: 'Объем'
      },
      [erc20.TX_TRANSFER]: {
        title: 'Перевести TIME',
        recipient: 'Получатель',
        amount: 'Объем'
      }
    },
    ChronoBankAssetWithFeeProxy: {
      [erc20.TX_APPROVE]: {
        title: 'Одобрить LHT',
        account: 'Аккаунт',
        amount: 'Объем'
      },
      [erc20.TX_TRANSFER]: {
        title: 'Перевести LHT',
        recipient: 'Получатель',
        amount: 'Объем'
      }
    },
    PendingManager: {
      [operations.TX_CONFIRM]: {
        title: 'Подтвердить Операцию'
      },
      [operations.TX_REVOKE]: {
        title: 'Отозвать Операцию'
      }
    },
    TimeHolder: {
      [time.TX_DEPOSIT]: {
        title: 'Внести TIME',
        amount: 'Объем'
      },
      [time.TX_WITHDRAW_SHARES]: {
        title: 'Вывести TIME',
        amount: 'Объем'
      }
    },
    Rewards: {
      [rewards.TX_WITHDRAW_REWARD]: {
        title: 'Вывести Вознаграждение',
        amount: 'Объем'
      },
      [rewards.TX_CLOSE_PERIOD]: {
        title: 'Закрыть Период Вознаграждений'
      }
    },
    AssetDonator: {
      [assetDonator.TX_REQUIRE_TIME]: {
        title: 'Требуется TIME'
      }
    },
    LOCManager: {
      [loc.standardFuncs.ADD_LOC]: {
        title: 'Добавить LOC',
        name: 'Имя',
        website: 'Вебсайт',
        issueLimit: 'Лимит выпуска',
        publishedHash: 'Published Hash',
        expDate: 'Дата экспирации',
        currency: 'Валюта'
      },
      [loc.standardFuncs.SET_LOC]: {
        title: 'Обновить LOC',
        name: 'Имя',
        website: 'Вебсайт',
        issueLimit: 'Лимит выпуска',
        publishedHash: 'Published Hash',
        expDate: 'Дата экспирации'
      },
      [loc.multisigFuncs.REMOVE_LOC]: {
        title: 'Удалить LOC',
        name: 'Имя'
      },
      [loc.multisigFuncs.REISSUE_ASSET]: {
        title: 'Выпустить актив',
        amount: 'Объем',
        name: 'Имя'
      },
      [loc.multisigFuncs.REVOKE_ASSET]: {
        title: 'Отозвать актив',
        amount: 'Объем',
        name: 'Имя'
      },
      [loc.multisigFuncs.UPDATE_LOC_STATUS]: {
        title: 'Обновить статус LOC',
        name: 'Имя',
        status: 'Статус'
      },
      [loc.multisigFuncs.SEND_ASSET]: {
        title: 'Отправить Ассет'
      }
    },
    ERC20Manager: {
      [erc20Manager.TX_MODIFY_TOKEN]: {
        title: 'Изменить Токен'
      },
      [erc20Manager.TX_REMOVE_TOKEN]: {
        title: 'Удаленный Токен'
      },
      [erc20Manager.TX_ADD_TOKEN]: {
        title: 'Добавить Токен'
      }
    },
    ERC20Interface: {
      [erc20.TX_APPROVE]: {
        title: 'Рдрбрить списание TIME',
        account: 'Аккаунт',
        amount: 'Колическтво'
      },
      [erc20.TX_TRANSFER]: {
        title: 'Перевести токены',
        account: 'Аккаунт',
        amount: 'Сумма'
      }
    },
    Exchange: {
      [exchange.TX_BUY]: {
        title: 'Buy LHT for ETH'
      },
      [exchange.TX_SELL]: {
        title: 'Sell LHT for ETH'
      }
    }
  },
  errors: {
    required: 'Обязательное поле',
    invalidPositiveInt: 'Должно быть положительным целым числом',
    invalidPositiveNumber: 'Должно быть положительным числом',
    invalidPositiveNumberOrZero: 'Должно быть положительным числом или нулем',
    invalidURL: 'Некорректный адрес',
    invalidEmail: 'Некорректный е-майл',
    invalidLength: 'Не меньше 3-х символов',
    invalidAddress: 'Некорректный Ethereum адрес',
    validIpfsFileList: 'Некорректный список файлов',
    between: 'Должно быть между %{min} и %{max}',
    lowerThan: 'Должно быть меньше чем %{limit}',
    limitDepositOnMainnet: 'В сети mainnet депозит TIME временно ограничен в размере 1 TIME',

    // TODO @bshevchenko: errors domain only for common cases. Move out entries below to the appropriate domains
    cantSentToYourself: 'Невозможно отправить токены самому себе',
    notEnoughTokens: 'Недостаточно токенов',
    platformNotEnoughTokens: 'Недостаточно для продажи',
    invalidCurrencyNumber: 'Должен иметь максимум %{decimals} знаков после запятой',
    greaterThanAllowed: 'Значение больше допустимого',
    greaterOrEqualBuyPrice: 'Должно быть больше или равно цены покупки',
    fileUploadingError: 'Невозможно загрузить файл',
    alreadyExist: '%{what} уже существует',
    transactionErrorTitle: 'Ошибка транзакции',
    transactionErrorMessage: 'Произошла ошибка во время транзакции для %{item}. Ошибка [%{code}]: %{message}',
    wallet: {
      walletName: {
        haveToBeString: 'Должно быть строкой'
      },
      dayLimit: {
        haveToBeNumber: 'Должно быть числом'
      },
      requiredSignatures: {
        haveToBeMoreThanTwoOrEqual: 'Должно быть больше или равно двум'
      },
      ownersCount: {
        haveToBeMoreThanTwoOrEqual: 'Должно быть больше или равно двум'
      }
    }
  },
  forms: {
    selectFile: 'Пожалуйста выберите файл',
    fileUploading: 'Файл загружается',
    mustBeCoSigned: 'This operation must be co-signed by other CBE key holders before it is executed.',
    correspondingFee: 'Corresponding fees will be deducted from this amount'
  },
  dialogs: {
    copyAddress: {
      title: 'Копирование адреса',
      controlTitle: 'Адрес',
      description: 'Нажмите CTRL + C или ⌘ + C чтобы скопировать адрес'
    }
  },
  poll: {
    new: 'Новое Голосование',
    create: 'Создать Голосование'
  },
  otherContract: {
    add: 'Добавить другой контракт'
  },
  errorCodes: {
    MODIFIER_STOPPED: 'Auth error',
    OK: 'OK',
    UNDEFINED: 'Undefined',

    FRONTEND_UNKNOWN: 'Неизвестная ошибка транзакции.',
    FRONTEND_OUT_OF_GAS: 'Недостаточно газа для транзакции.',
    FRONTEND_WEB3_FILTER_FAILED: 'Неизвестный результат транзакции изза ошибки фильтра web3.',
    FRONTEND_RESULT_FALSE: 'Неудача транзакции с результатом false.',
    FRONTEND_RESULT_TRUE: 'Неудача транзакции с результатом true.',
    FRONTEND_INVALID_RESULT: 'Неправильный результат транзакции.',

    LOC_NOT_FOUND: 'LOC не найдена',
    LOC_EXISTS: 'LOC существует',
    LOC_INACTIVE: 'LOC неактивна',
    LOC_SHOULD_NO_BE_ACTIVE: 'LOC Должна быть активна',
    LOC_INVALID_PARAMETER: 'LOC неправильный параметр',
    LOC_INVALID_INVOCATION: 'LOC неправильный вызов',
    LOC_ADD_CONTRACT: 'LOC добавить контракт',
    LOC_SEND_ASSET: 'LOC отправить ассет',
    LOC_REQUESTED_ISSUE_VALUE_EXCEEDED: 'LOC запрашиваемый объем выпуска превышен',
    LOC_REISSUING_ASSET_FAILED: 'LOC неудачный перевыпуск ассета',
    LOC_REQUESTED_REVOKE_VALUE_EXCEEDED: 'LOC запрашиваемый обхем возврата превышен',
    LOC_REVOKING_ASSET_FAILED: 'LOC неудача возврата ассета',

    USER_NOT_FOUND: 'Пользователь не найден',
    USER_INVALID_PARAMETER: 'Пользователь: неправильный параметры запроса',
    USER_ALREADY_CBE: 'Пользователь уже является CBE',
    USER_NOT_CBE: 'Пользователь не является CBE',
    USER_SAME_HASH: 'User has the same hash',
    USER_INVALID_REQURED: 'Пользователь: Неправильный требуется',  // TODO: @vlad: what is it?
    USER_INVALID_STATE: 'Пользователь: Неправильное состояние',

    CROWDFUNDING_INVALID_INVOCATION: 'Краудфандинг: Неправильный вызов',
    CROWDFUNDING_ADD_CONTRACT: 'Краудфандинг: добавить контракт',
    CROWDFUNDING_NOT_ASSET_OWNER: 'Краудфандинг: Пользователь не является владельцем ассета',

    PENDING_NOT_FOUND: 'Проводимые не найдены',
    PENDING_INVALID_INVOCATION: 'Проводимые Операции: Неправильный вызов',
    PENDING_ADD_CONTRACT: 'Проводимые добавить контракт',
    PENDING_DUPLICATE_TX: 'Дубль транзации',
    PENDING_CANNOT_CONFIRM: 'Не могу подтвердить запрос',
    PENDING_PREVIOUSLY_CONFIRMED: 'Операция уже подтверждена',
    PENDING_NOT_ENOUGH_CONFIRMED: 'Операция не достаточно подтверждена',

    STORAGE_INVALID_INVOCATION: 'Неправильный вызов хранилища',

    EXCHANGE_INVALID_PARAMETER: 'Обмен: Неверный параметр запроса',
    EXCHANGE_INVALID_INVOCATION: 'Обмен: Неверный вызов',
    EXCHANGE_INVALID_FEE_PERCENT: 'Обмен: неверный процент комиссии',
    EXCHANGE_INVALID_PRICE: 'Обмен: неправильная цена',
    EXCHANGE_MAINTENANCE_MODE: 'Обмен: режим поддержки',
    EXCHANGE_TOO_HIGH_PRICE: 'Обмен: слишком высокая цена',
    EXCHANGE_TOO_LOW_PRICE: 'Обмен: слишком низкая цена',
    EXCHANGE_INSUFFICIENT_BALANCE: 'Обмен: недостаточно средств',
    EXCHANGE_INSUFFICIENT_ETHER_SUPPLY: 'Обмен: недостаточно ether',
    EXCHANGE_PAYMENT_FAILED: 'Обмен: неудача платежа',
    EXCHANGE_TRANSFER_FAILED: 'Обмен: неудача трансфера',
    EXCHANGE_FEE_TRANSFER_FAILED: 'Обмен: неудача трансфера комиссии',

    EXCHANGE_STOCK_NOT_FOUND: 'Обмен: не найдено',
    EXCHANGE_STOCK_INVALID_PARAMETER: 'Обмен: неправильный параметр позиции',
    EXCHANGE_STOCK_INVALID_INVOCATION: 'Обмен: неправильный вызов позиции',
    EXCHANGE_STOCK_ADD_CONTRACT: 'Обмен: добавить контракт позиции',
    EXCHANGE_STOCK_UNABLE_CREATE_EXCHANGE: 'Обмен: позиция не может создать обмен',

    VOTE_INVALID_PARAMETER: 'Голос: неправильный параметр',
    VOTE_INVALID_INVOCATION: 'Голос: неправильный вызов',
    VOTE_ADD_CONTRACT: 'Голос: добавить контракт',
    VOTE_LIMIT_EXCEEDED: 'Голос: лимит превышен',
    VOTE_POLL_LIMIT_REACHED: 'Голос: лимит голосования достигнут',
    VOTE_POLL_WRONG_STATUS: 'Голос: неправильный статус голосования',
    VOTE_POLL_INACTIVE: 'Голос: голосование не активно',
    VOTE_POLL_NO_SHARES: 'Голос: голосование не имеет долей',
    VOTE_POLL_ALREADY_VOTED: 'Голос: голосование уже проголосовано',
    VOTE_ACTIVE_POLL_LIMIT_REACHED: 'Голос: лимит активного голосования достигнут',
    VOTE_UNABLE_TO_ACTIVATE_POLL: 'Голос: не могу активировать голосование',

    REWARD_NOT_FOUND: 'Награда: не найдена',
    REWARD_INVALID_PARAMETER: 'Награда: неправильный параметр запроса',
    REWARD_INVALID_INVOCATION: 'Награда: неправильный вызов',
    REWARD_INVALID_STATE: 'Награда: неправильное состояние',
    REWARD_INVALID_PERIOD: 'Награда: неправильный период',
    REWARD_NO_REWARDS_LEFT: 'Награда: не осталось наград',
    REWARD_ASSET_TRANSFER_FAILED: 'Награда: неудача трансфера ассета',
    REWARD_ALREADY_CALCULATED: 'Награда: уже посчитана',
    REWARD_CALCULATION_FAILED: 'Награда: неудача подсчета',
    REWARD_CANNOT_CLOSE_PERIOD: 'Награда: не могу закрыть период',
    REWARD_ASSET_ALREADY_REGISTERED: 'Награда: ассет уже зарегистрирован',

    CONTRACT_EXISTS: 'Контракт уже существует',
    CONTRACT_NOT_EXISTS: 'Контракт не существует',

    TIMEHOLDER_ALREADY_ADDED: 'Времядержатель уже добавлен',
    TIMEHOLDER_INVALID_INVOCATION: 'Времядержатель: неправильный вызов',
    TIMEHOLDER_INVALID_STATE: 'Времядержатель: invalid state',
    TIMEHOLDER_TRANSFER_FAILED: 'Времядержатель: transfer failed',
    TIMEHOLDER_WITHDRAWN_FAILED: 'Времядержатель: withdrawn failed',
    TIMEHOLDER_DEPOSIT_FAILED: 'Времядержатель: deposit failed',
    TIMEHOLDER_INSUFFICIENT_BALANCE: 'Времядержатель: insufficient balance',

    ERCMANAGER_INVALID_INVOCATION: 'ERC20 Менеджер: неправильный вызов',
    ERCMANAGER_INVALID_STATE: 'ERC20 Менеджер: неправильное состояние',
    ERCMANAGER_TOKEN_SYMBOL_NOT_EXISTS: 'ERC20 Менеджер: символ токена не существует',
    ERCMANAGER_TOKEN_NOT_EXISTS: 'ERC20 Менеджер: токен не существует',
    ERCMANAGER_TOKEN_SYMBOL_ALREADY_EXISTS: 'ERC20 Менеджер: символ токена уже существует',
    ERCMANAGER_TOKEN_ALREADY_EXISTS: 'ERC20 Менеджер: токен уже существует',
    ERCMANAGER_TOKEN_UNCHANGED: 'ERC20 Менеджер: токен не изменен',

    ASSETS_INVALID_INVOCATION: 'Ассеты: неправильный вызов',
    ASSETS_EXISTS: 'Ассеты уже существуют',
    ASSETS_TOKEN_EXISTS: 'Ассеты: токен уже существует',
    ASSETS_CANNON_CLAIM_PLATFORM_OWNERSHIP: 'Ассеты: не могу претендовать на владение платформой',
    ASSETS_WRONG_PLATFORM: 'Ассеты: неправильная платформа',
    ASSETS_NOT_A_PROXY: 'Ассеты: не является прокси',
    ASSETS_OWNER_ONLY: 'Ассеты: только владелец',
    ASSETS_CANNOT_ADD_TO_REGISTRY: 'Ассеты: не могу добавить в реестр',
  },
  materialUi: {
    DatePicker: {
      cancelLabel: 'Отмена',
      okLabel: 'OK'
    }
  },
  layouts: {
    partials: {
      FooterPartial: {
        download: 'Скачать',
        subscribe: 'Подписаться',
        enterEmailForNews: 'Введите email для новостей',
        newsletter: 'Новостная рассылка (скоро)',
        contactUs: 'Свяжитесь с нами',
        technicalSupport: 'Техническая поддержка',
        generalInquiries: 'Общие вопросы',
        menu: 'Меню',
        socialNetwork: 'Социальные Сети'
      },
      WalletContent: {
        youCanUseTheMultisignatureWallets: 'Вы можете использовать кошельки с мультиподписью',
        walletsAreSmartContractsWhichManageAssets: 'Кошельки это смартконтракты которые управляют ассетами и могут принадлежать нескольким аккаунтам. В отличие от аккаунтов, контракты кошельков управляются кодом, что означает возможность кастомизации их поведения. Наиболее распространенное использование это мультиподписные кошельки, которые позволяют выполнять логгирование транзакций, устанавливать лимиты выдачи, и наборы правил о необходимом количестве подписей.',
        depositTimeIsTemporarilyLimited: 'Депозит TIME временно ограничен до 1 TIME на сети main.',
        toUseStakeholders: 'Для использование возможностей акционеров таких как Награды и Голосования, вы должны вложить TIME токены.',
        enterTheAmount: 'Введите сумму которую вы хотите вложить. Вы можете запросить TIME единожды в целях тестирования.',
        checkValueAndPress: 'Проверьте значение и нажмите ПОДТВЕРДИТЬ чтобы разрешить TIME holder контракту внести ваши токены. Это для вашей безопастности.',
        waitUntilAllowance: 'Подождите пока allowance не будет обновлено и нажмите LOCK. Для изъятия введите сумму и нажмите ИЗЪЯТЬ.',
        howToMakeTime: 'Как внести TIME токены?',
        depositTime: 'Внести TIME',
        sendTokens: 'Отправить токены',
        howToMakeATransfer: 'Как сделать перевод?',
        ifYouPlanToMoveALargeAmountOfEther: 'Если вы планируете переслать большую сумму эфира, вам сначала следует протестировать отправку малого количества на ваш кошелек чтобы убедится что все проходит как запланировано.',
        enterTheAddressYouWouldLikeToSendTo: 'Введите адрес на который вы хотите осуществить перевод в поле "Адрес получателя".',
        enterTheAmountYouWouldLikeToSend: 'Введите сумму кооторую вы хотели бы отправить.',
        checkValuesAndPressSend: 'Проверьте значения и нажмите ОТПРАВИТЬ.',
        ifYouWantToAllowAContract: 'Если вы хотите разрешить контракту отправлять ваши токены (не ETH) - повторите тоже самое, но нажмите ПОДТВЕРДИТЬ.'
      },
      InfoPartial: {
        addToken: 'Добавить Токен'
      },
      OperationsContent: {
        pendingOperations: 'Проводимые операции',
        completedOperations: 'Завершенные операции'
      },
      RewardsContent: {
        rewards: 'Награды',
        rewardsSmartContractAddress: 'Адреса смарт контракта вознаграждения',
        currentRewardsPeriod: 'Текущий период наград',
        periodLength: 'Длина периода',
        daysDays: '%{days} дней',
        rewardsForYourAccountIs: 'Награды для вашего аккаунта',
        enabled: 'Включено',
        youHaveNoTimeDeposit: 'У вас нет депозита TIME.',
        pleaseDepositTimeTokens: 'Пожалуйста внесите TIME токены чтобы разблокировать страницу наград.',
        disabled: 'Отключено',
        depositOfWithdrawTime: 'Внести Или Вывысни Time',
        withdrawRevenue: 'Вывести Доход',
        closePeriod: 'Закрыть период'
      },
      VotingContent: {
        voting: 'Голосования',
        allPolls: 'Все голосования',
        completedPolls: 'Завершенные голосования',
        outdatedPolls: 'Устаревшие голосования',
        inactivePolls: 'Неактивные голосования',
        pollsOngoing: 'Идущие голосования',
        newPoll: 'Новое Голосование'
      }
    }
  },
  components: {
    dashboard: {
      TransactionsTable: {
        latestTransactions: 'Последние транзакции',
        time: 'Время',
        block: 'Блок',
        type: 'Тип',
        hash: 'Хеш',
        from: 'От',
        to: 'На',
        value: 'Сумма'
      },
      DepositTokens: {
        amount: 'Сумма',
        yourSymbolBalance: 'Ваш баланс %{symbol}',
        yourSymbolDeposit: 'Ваш депозит %{symbol}',
        symbolHolderAllowance: '%{symbol} allowance держателя',
        requireTime: 'Запросить TIME',
        withdraw: 'Вывести'
      },
      SendTokens: {
        balance: 'Баланс',
        recipientAddress: 'Адрес получателя',
        amount: 'Сумма',
        approve: 'Подтвердить',
        send: 'Отправить'
      },
      RewardsPeriod: {
        rewardsPeriodIndex: 'Наградной период #%{index}',
        ongoing: 'Продолжается',
        closed: 'Закрыт',
        startDate: 'Дата начала',
        inDaysDays: 'через %{days} дней',
        endDate: 'Дата окончания',
        totalTimeTokensDeposited: 'Всего внесено TIME токенов',
        percentOfTotalCount: '%{percent}% то общего числа',
        uniqueShareholders: 'Уникальные акционеры',
        yourTimeTokensEligible: 'Ваши TIME токены претендующие на вознаграждение за период',
        percentOfTotalDepositedAmount: '%{percent}% от общей суммы депозита',
        dividendsAccumulatedForPeriod: 'Дивиденды собранные за период',
        yourApproximateRevenueForPeriod: 'Ваша приблизительная прибыль за период'
      },
      ExchangeWidget: {
        exchange: 'Обмен',
        search: 'Поиск',
        currency: 'Валюта',
        buy: 'Купить',
        sell: 'Продать'
      },
      OrdersTable: {
        orderBook: 'Книга Ордеров',
        trader: 'Трейдер',
        paymentDescription: 'Описание платежа',
        limits: 'Лимиты'
      },
      Poll: {
        new: 'Новое',
        ongoing: 'Идет',
        daysLeft: 'дней осталось',
        daysLeft_1: 'день остался',
        daysLeft_2: 'дня осталось',
        daysLeft_3: 'дня осталось',
        daysLeft_4: 'дня осталось',
        finished: 'Окончено',
        timeHoldersAlreadyVoted: 'Держателей TIME проголосовало',
        no: 'Нет',
        requiredVotes: 'Требуется Голосов',
        receivedVotes: 'Получено голосов',
        variants: 'Варианты',
        documents: 'Документы',
        remove: 'Удалить',
        details: 'Детали',
        endPoll: 'Завершить Голосование',
        activate: 'Активировать',
        vote: 'Проголосовать',
        published: 'Опубликовано',
        endDate: 'Дата Окончания'
      }
    },
    locs: {
      PageTitle: {
        labourOfferingCompanies: 'Компании Предлагающие Труд (LOC)'
      }
    },
    operations: {
      Operations: {
        settings: 'Настройки',
        description: 'Описание',
        signatures: 'Подписи',
        actions: 'Действия'
      }
    },
    settings: {
      Tokens: {
        tokens: 'Токены',
        name: 'Имя',
        smartContractAddress: 'Адрес Смарт Контракта',
        actions: 'Действия',
        addToken: 'Добавить Токен'
      },
      CBEAddresses: {
        cbeAddresses: 'Адреса CBE',
        addCbe: 'Добавить CBE',
        name: 'Имя',
        smartContractAddress: 'Адрес Смарт Контракта',
        actions: 'Действия',
        remove: 'Удалить'
      }
    },
    dialogs: {
      OperationsSettingsDialog: {
        operationsSettings: 'Настройки Операций',
        cancel: 'Отмена',
        save: 'Сохранить'
      },
      CBEAddressDialog: {
        addCbeAddress: 'Добавить адрес CBE',
        cancel: 'Отмена',
        addAddress: 'Добавить Адрес'
      },
      PollDialog: {
        editPoll: 'Редактировать Голосование',
        newPoll: 'Новое Голосование',
        pollTitle: 'Название голосования',
        pollDescriptions: 'Описание голосования',
        voteLimit: 'Лимит голосов',
        finishedDate: 'Дата окончания',
        addAttachments: 'Добавить Вложения',
        option: 'Вариант',
        optionIndex: 'Вариант #%{index}',
        updatePoll: 'Обновить Голосование',
        createPoll: 'Создать Голосование',
        addOption: 'Добавить Вариант'
      },
      PollDetailsDialog: {
        published: 'Опубликовано',
        finished: 'Окончено',
        no: 'Нет',
        endDate: 'Дата окончания',
        requiredVotes: 'Требуется голосов',
        receivedVotes: 'Получено голосов',
        variants: 'Варианты',
        documents: 'Документы',
        ongoing: 'Идет',
        new: 'Новое',
        timeHoldersAlreadyVoted: 'Деражателей TIME проголосовало',
        optionNumber: 'Вариант №%{number}',
        numberVotes: '%{number} голосов',
        numberVotes_1: '%{number} голос',
        numberVotes_2: '%{number} голоса',
        numberVotes_3: '%{number} голоса',
        numberVotes_4: '%{number} голоса',
        pollOptions: 'Варианты голосования',
        idxNumber: '№%{number}'
      },
      AddCurrencyDialog: {
        addToken: 'Добавить Токен',
        howToAddYourToken: "Как добавить свой токен? Это легко!",
        youCanConnectToYourPersonalWallet: 'Вы можете подсоединить к вашему личному кошельку один из уже добавленых токенов или добавить любой другой ERC20 токен.',
        clickOnThePlusButtonAbove: 'Нажмите кнопку + вверху.',
        fillTheForm: 'Заполните форму, проверьте значения и нажмите СОХРАНИТЬ.',
        waitUntilYourToken: 'Подождите пока ваш токен не будет добавлен (смайнен), выберите его в списке слева и нажмите СОХРАНИТЬ.',
        allTokens: 'Все токены',
        save: 'Сохранить',
        close: 'Закрыть',
        tokens: 'Токены'
      },
      AddTokenDialog: {
        tokenContractAddress: 'Адрес контракта токена',
        tokenName: 'Название токена',
        tokenSymbol: 'Символ токена',
        decimalsPlacesOfSmallestUnit: 'Количество десятичных знаков',
        tokenNameHead: 'Название токена',
        tokenAddressHead: 'Адрес токена',
        projectURL: 'URL проекта',
        save: 'Сохранить',
        cancel: 'Отменить'
      },
      VoteDialog: {
        chooseOption: 'Выберите вариант',
        ongoing: 'Идет',
        timeHoldersAlreadyVoted: 'Держателей TIME проголосовало',
        published: 'Опубликовано',
        endDate: 'Дата окончания',
        requiredVotes: 'Требуется голосов',
        receivedVotes: 'Полученные голоса',
        variants: 'Варианты',
        documents: 'Документы',
        no: 'Нет',
        daysLeft: 'дней осталось',
        daysLeft_1: 'день остался',
        daysLeft_2: 'дня осталось',
        daysLeft_3: 'дня осталось',
        daysLeft_4: 'дня осталось',
        vote: 'Проголосовать'
      }
    }
  }
}
