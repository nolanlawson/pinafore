export default {
  // Home page, basic <title> and <description>
  appName: 'Semaphore',
  appDescription: 'Альтернативный веб-клиент для Mastodon, ориентированный на скорость и простоту.',
  homeDescription: `
    <p>
    Semaphore — веб-клиент для
      <a rel="noopener" target="_blank" href="https://joinmastodon.org">Mastodon</a>,
      разработан для скорости и простоты.
    </p>
    <p>
    Прочитайте
      <a rel="noopener" target="_blank"
         href="https://nolanlawson.com/2018/04/09/introducing-pinafore-for-mastodon/">вводную запись в блоге</a>,
         или начните работу, войдя в инстанс:
    </p>`,
  logIn: 'Войти',
  footer: `
    <p>
      Semaphore — это
      <a rel="noopener" target="_blank" href="https://github.com/NickColley/semaphore">программное обеспечение с открытым исходным кодом</a>
      поддерживается <a rel="noopener" target="_blank" href="https://nickcolley.co.uk">Nick Colley/a>.
      и распространяемое под лицензией
      <a rel="noopener" target="_blank"
         href="https://github.com/NickColley/semaphore/blob/main/LICENSE">AGPL License</a>.
      Здесь <a href="/settings/about#privacy-policy" rel="prefetch">политика конфиденциальности</a>.
      Это продолжение проекта Pinafore, созданного <a rel="noopener" target="_blank" href="https://nolanlawson.com">Ноланом Лоусоном</a>.
    </p>
  `,
  // Manifest
  longAppName: 'Semaphore для Mastodon',
  newStatus: 'Новая запись',
  // Generic UI
  loading: 'Загрузка',
  okay: 'OK',
  cancel: 'Отмена',
  alert: 'Оповещение',
  close: 'Закрыть',
  error: 'Ошибка: {error}',
  errorShort: 'Ошибка:',
  // Relative timestamps
  justNow: 'только что',
  // Navigation, page titles
  navItemLabel: `
    {label} {selected, select,
      true {(current page)}
      other {}
    } {name, select,
      notifications {{count, plural,
        =0 {}
        one {(1 notification)}
        other {({count} notifications)}
      }}
      community {{count, plural,
        =0 {}
        one {(1 follow request)}
        other {({count} follow requests)}
      }}
      other {}
    }
  `,
  blockedUsers: 'Заблокированные пользователи',
  bookmarks: 'Закладки',
  directMessages: 'Личные сообщения',
  favorites: 'Избранное',
  federated: 'Федеративное',
  home: 'Главная',
  local: 'Локальная',
  notifications: 'Уведомления',
  mutedUsers: 'Игнорируемые пользователи',
  pinnedStatuses: 'Закрепленные записи',
  followRequests: 'Запросы на подписку',
  followRequestsLabel: `Запросы на подписку {hasFollowRequests, select,
    true {({count})}
    other {}
  }`,
  list: 'Список',
  search: 'Поиск',
  pageHeader: 'Заголовок страницы',
  goBack: 'Вернуться назад',
  back: 'Назад',
  profile: 'Профиль',
  federatedTimeline: 'Глобальная лента',
  localTimeline: 'Локальная лента',
  // community page
  community: 'Сообщество',
  pinnableTimelines: 'Закрепляемые ленты',
  timelines: 'Ленты',
  lists: 'Списки',
  instanceSettings: 'Настройки инстанса',
  notificationMentions: 'Уведомление упоминаний',
  profileWithMedia: 'Профиль с медиа',
  profileWithReplies: 'Профиль с ответами',
  hashtag: 'Хэштег',
  // not logged in
  profileNotLoggedIn: 'При входе в систему здесь появится лента пользователя.',
  bookmarksNotLoggedIn: 'Ваши закладки появятся здесь после входа в систему.',
  directMessagesNotLoggedIn: 'Ваши личные сообщения будут отображаться здесь после входа в систему.',
  favoritesNotLoggedIn: 'Ваше избранное появится здесь после входа в систему.',
  federatedTimelineNotLoggedIn: 'Ваша глобальная лента появится здесь после входа в систему.',
  localTimelineNotLoggedIn: 'Ваша локальная лента появится здесь после входа в систему.',
  searchNotLoggedIn: 'Вы можете выполнять поиск после входа в инстанс.',
  communityNotLoggedIn: 'Параметры сообщества появится здесь при входе в систему.',
  listNotLoggedIn: 'Список появится здесь после входа в систему.',
  notificationsNotLoggedIn: 'Ваши уведомления будут отображаться здесь после входа в систему.',
  notificationMentionsNotLoggedIn: 'Ваши уведомления с упоминаниями будут отображаться здесь после входа в систему.',
  statusNotLoggedIn: 'При входе в систему здесь появится тред сообщений.',
  tagNotLoggedIn: 'При входе в систему здесь появится лента с хэштегом.',
  // Notification subpages
  filters: 'Фильтры',
  all: 'Все',
  mentions: 'Упоминания',
  // Follow requests
  approve: 'Одобрить',
  reject: 'Отклонить',
  // Hotkeys
  hotkeys: 'Горячие клавиши',
  global: 'Глобальная',
  timeline: 'Лента',
  media: 'Медиа',
  globalHotkeys: `
    {leftRightChangesFocus, select,
      true {
        <li><kbd>→</kbd> перейти к следующему элементу</li>
        <li><kbd>←</kbd> перейти к предыдущему элементу</li>
      }
      other {}
    }
    <li>
      <kbd>1</kbd> - <kbd>6</kbd>
      {leftRightChangesFocus, select,
        true {}
        other {или <kbd>←</kbd>/<kbd>→</kbd>}
      }
      переключение столбцов
    </li>
    <li><kbd>7</kbd> или <kbd>c</kbd> создать запись</li>
    <li><kbd>s</kbd> или <kbd>/</kbd> искать</li>
    <li><kbd>g</kbd> + <kbd>h</kbd> главная</li>
    <li><kbd>g</kbd> + <kbd>n</kbd> уведомления</li>
    <li><kbd>g</kbd> + <kbd>l</kbd> локальная лента</li>
    <li><kbd>g</kbd> + <kbd>t</kbd> глобальная лента</li>
    <li><kbd>g</kbd> + <kbd>c</kbd> сообщество</li>
    <li><kbd>g</kbd> + <kbd>d</kbd> личные сообщения</li>
    <li><kbd>h</kbd> или <kbd>?</kbd> диалог справки</li>
    <li><kbd>Backspace</kbd> закрыть диалог, чтобы вернуться назад</li>
  `,
  timelineHotkeys: `
    <li><kbd>j</kbd> или <kbd>↓</kbd> следующая запись</li>
    <li><kbd>k</kbd> или <kbd>↑</kbd> предыдущая запись</li>
    <li><kbd>.</kbd> показать больше и прокрутить вверх</li>
    <li><kbd>o</kbd> открыть</li>
    <li><kbd>f</kbd> в избранное</li>
    <li><kbd>b</kbd> продвинуть</li>
    <li><kbd>r</kbd> ответить</li>
    <li><kbd>i</kbd> открыть изображения, видео или аудио</li>
    <li><kbd>y</kbd> показать или скрыть деликатное медиа</li>
    <li><kbd>m</kbd> упомянуть автора</li>
    <li><kbd>p</kbd> открыть профиль автора</li>
    <li><kbd>l</kbd> открыть ссылку карточки в новой вкладке</li>
    <li><kbd>x</kbd> показать или скрыть текст за предупреждением о содержимом</li>
    <li><kbd>z</kbd> показать или скрыть все предупреждения о содержимом в треде</li>
  `,
  mediaHotkeys: `
    <li><kbd>←</kbd> / <kbd>→</kbd> перейти к следующему или предыдущему</li>
  `,
  // Community page, tabs
  tabLabel: `{label} {current, select,
    true {(Current)}
    other {}
  }`,
  pageTitle: `
    {hasNotifications, select,
      true {({count})}
      other {}
    }
    {showInstanceName, select,
      true {{instanceName}}
      other {Semaphore}
    }
    ·
    {name}
  `,
  pinLabel: `{label} {pinnable, select,
    true {
      {pinned, select,
        true {(Pinned page)}
        other {(Unpinned page)}
      }
    }
    other {}
  }`,
  pinPage: 'Закрепить {label}',
  // Status composition
  composeStatus: 'Создать запись',
  postStatus: 'Опубликовать!',
  contentWarning: 'Предупреждение о содержимом',
  dropToUpload: 'Перетащите для загрузки',
  invalidFileType: 'Неверный тип файла',
  composeLabel: "О чем Вы думаете?",
  autocompleteDescription: 'Когда результаты автозаполнения доступны, нажмите стрелки вверх или вниз и нажмите Enter, чтобы выбрать.',
  mediaUploads: 'Загрузка медиа',
  edit: 'Редактировать',
  delete: 'Удалить',
  description: 'Описание',
  descriptionLabel: 'Добавьте описание для слабовидящих (изображение, видео) или слабослышащих (аудио, видео)',
  markAsSensitive: 'Отметить медиа как деликатное',
  // Polls
  createPoll: 'Создать опрос',
  removePollChoice: 'Удалить вариант {index}',
  pollChoiceLabel: 'Вариант {index}',
  multipleChoice: 'Несколько вариантов',
  pollDuration: 'Продолжительность опроса',
  fiveMinutes: '5 минут',
  thirtyMinutes: '30 минут',
  oneHour: '1 час',
  sixHours: '6 часов',
  twelveHours: '12 часов',
  oneDay: '1 день',
  threeDays: '3 дня',
  sevenDays: '7 дней',
  never: 'Никогда',
  addEmoji: 'Вставить эмодзи',
  addMedia: 'Добавить медиа (изображения, видео, аудио)',
  addPoll: 'Добавить опрос',
  removePoll: 'Удалить опрос',
  postPrivacyLabel: 'Настройка конфиденциальности (на данный момент {label})',
  addContentWarning: 'Добавить предупреждение о содержимом',
  removeContentWarning: 'Удалить предупреждение о содержимом',
  altLabel: 'Описание для слабовидящих',
  extractText: 'Извлечь текст из изображения',
  extractingText: 'Извлечение текста…',
  extractingTextCompletion: 'Извлечение текста ({percent}% завершено)…',
  unableToExtractText: 'Не удалось извлечь текст.',
  // Account options
  followAccount: 'Подписаться на {account}',
  unfollowAccount: 'Отписаться от {account}',
  blockAccount: 'Заблокировать {account}',
  unblockAccount: 'Разблокировать {account}',
  muteAccount: 'Игнорировать {account}',
  unmuteAccount: 'Не игнорировать {account}',
  showReblogsFromAccount: 'Показывать продвижения от {account}',
  hideReblogsFromAccount: 'Скрыть продвижения от {account}',
  showDomain: 'Показать {domain}',
  hideDomain: 'Скрыть домен {domain}',
  reportAccount: 'Пожаловаться на {account}',
  mentionAccount: 'Упомянуть {account}',
  copyLinkToAccount: 'Копировать ссылку на аккаунт',
  copiedToClipboard: 'Скопировано в буфер обмена',
  // Media dialog
  navigateMedia: 'Навигация по элементам мультимедиа',
  showPreviousMedia: 'Показать предыдущие медиа',
  showNextMedia: 'Показать следующее медиа',
  enterPinchZoom: 'Режим масштабирования щипком',
  exitPinchZoom: 'Выйти из режима щипкового масштабирования.',
  showMedia: `Показать {index, select,
    1 {first}
    2 {second}
    3 {third}
    other {fourth}
  } медиа {current, select,
    true {(current)}
    other {}
  }`,
  previewFocalPoint: 'Предварительный просмотр (фокус)',
  enterFocalPoint: 'Введите точку фокусировки (X, Y) для этого медиа',
  muteNotifications: 'Отключить уведомления',
  muteAccountConfirm: 'Игнорировать {account}?',
  mute: 'Игнорировать',
  unmute: 'Не игнорировать',
  zoomOut: 'Уменьшить',
  zoomIn: 'Увеличить',
  // Reporting
  reportingLabel: 'Вы отправляете жалобу на {account} модератору {instance}.',
  additionalComments: 'Дополнительные комментарии',
  forwardDescription: 'Переслать также модераторам {instance}?',
  forwardLabel: 'Переслать {instance}',
  unableToLoadStatuses: 'Не удалось загрузить последние записи: {error}',
  report: 'Жалоба',
  noContent: '(Без содержания)',
  noStatuses: 'Нет записей для жалобы',
  // Status options
  unpinFromProfile: 'Открепить от профиля',
  pinToProfile: 'Закрепить в профиле',
  muteConversation: 'Игнорировать обсуждение',
  unmuteConversation: 'Не игнорировать обсуждение',
  bookmarkStatus: 'Добавить в закладки',
  unbookmarkStatus: 'Удалить закладку',
  deleteAndRedraft: 'Удалить и исправить',
  reportStatus: 'Пожаловаться на запись',
  shareStatus: 'Поделиться записью',
  copyLinkToStatus: 'Копировать ссылку на запись',
  // Account profile
  profileForAccount: 'Профиль для {account}',
  statisticsAndMoreOptions: 'Статистика и другие параметры',
  statuses: 'Записи',
  follows: 'Подписки',
  followers: 'Подписчики',
  moreOptions: 'Больше опций',
  followersLabel: 'Подписчиков {count}',
  followingLabel: 'Пописок {count}',
  followLabel: `Подписаться {requested, select,
    true {(follow requested)}
    other {}
  }`,
  unfollowLabel: `Отписаться {requested, select,
    true {(follow requested)}
    other {}
  }`,
  notify: 'Подписаться на {account}',
  denotify: 'Отписаться от {account}',
  subscribedAccount: 'Подписан на аккаунт',
  unsubscribedAccount: 'Отписаться от аккаунта',
  unblock: 'Разблокировать',
  nameAndFollowing: 'Имя и подписка',
  clickToSeeAvatar: 'Нажмите, чтобы увидеть аватар',
  opensInNewWindow: '{label} (открывается в новом окне)',
  blocked: 'Заблокирован',
  domainHidden: 'Домен скрыт',
  muted: 'Игнорирован',
  followsYou: 'Подписан на вас',
  avatarForAccount: 'Аватар для {account}',
  fields: 'Поля',
  accountHasMoved: '{account} переехал:',
  profilePageForAccount: 'Страница профиля для {account}',
  verified: 'Verified',
  // About page
  about: 'О нас',
  aboutApp: 'О Semaphore',
  aboutAppDescription: `
  <p>
    Semaphore — это
    <a rel="noopener" target="_blank" href="https://github.com/NickColley/semaphore">программное обеспечение с открытым исходным кодом</a>
    поддерживается <a rel="noopener" target="_blank" href="https://nickcolley.co.uk">Nick Colley/a>.
    и распространяемое под лицензией
    <a rel="noopener" target="_blank"
      href="https://github.com/NickColley/semaphore/blob/main/LICENSE">AGPL License</a>.
    Это продолжение проекта Pinafore, созданного <a rel="noopener" target="_blank" href="https://nolanlawson.com">Ноланом Лоусоном</a>.
  </p>

  <h2 id="privacy-policy">Политика конфиденциальности</h2>

  <p>
    Semaphore не хранит никакой личной информации на своих серверах,
    включая, помимо прочего, имена, адреса электронной почты,
    IP-адреса, сообщения и фотографии.
  </p>

  <p>
  Semaphore — это статический сайт. Все данные хранятся локально в вашем браузере и передаются через Федиверс
    инстансы, к которым вы подключаетесь.
  </p>

  <h2>Кредиты</h2>

  <p>
  Иконки предоставлены <a rel="noopener" target="_blank" href="http://fontawesome.io/">Font Awesome</a>.
  </p>

  <p>
    Logo thanks to "Flag" by AFY Studio from
    <a rel="noopener" target="_blank" href="https://thenounproject.com/">the Noun Project</a>.
  </p>`,
  // Settings
  settings: 'Настройки',
  general: 'Общие',
  generalSettings: 'Общие настройки',
  showSensitive: 'Показывать деликатные медиа по умолчанию',
  showPlain: 'Показать простой серый цвет для деликатного медиа',
  allSensitive: 'Относиться ко всем медиа как к деликатным',
  largeMedia: 'Показывать большие изображения и видео',
  autoplayGifs: 'Автовоспроизведение анимированных GIF-файлов',
  hideCards: 'Скрыть предварительный просмотр ссылок',
  underlineLinks: 'Подчеркивание ссылок в записях и профилях',
  accessibility: 'Специальные возможности',
  reduceMotion: 'Уменьшить анимацию интерфейса',
  disableTappable: 'Отключить нажимаемую область на записи.',
  removeEmoji: 'Удалить эмодзи из имен пользователей',
  shortAria: 'Использовать метки ARIA для коротких статей',
  theme: 'Тема',
  themeForInstance: 'Тема для {instance}',
  disableCustomScrollbars: 'Отключить пользовательские полосы прокрутки',
  bottomNav: 'Поместите панель навигации в нижнюю часть экрана',
  centerNav: 'Центрировать панель навигации',
  preferences: 'Предпочтения',
  hotkeySettings: 'Настройки горячих клавиш',
  disableHotkeys: 'Отключить все горячие клавиши',
  leftRightArrows: 'Клавиши со стрелками влево/вправо изменяют фокус, а не столбцы/медиа',
  guide: 'Руководство',
  reload: 'Перезагрузить',
  // Wellness settings
  wellness: 'Здоровье',
  wellnessSettings: 'Настройки здоровья',
  wellnessDescription: `Настройки здоровья предназначены для уменьшения вызывающих привыкание или тревогу аспектов социальных сетей.
    Выберите любые варианты, которые вам подходят.`,
  enableAll: 'Включить все',
  metrics: 'Метрики',
  hideFollowerCount: 'Скрыть количество подписчиков (до 10)',
  hideReblogCount: 'Скрыть количество продижений',
  hideFavoriteCount: 'Скрыть количество избранных',
  hideUnread: 'Скрыть количество непрочитанных уведомлений (например, красную точку)',
  // The quality that makes something seem important or interesting because it seems to be happening now
  immediacy: 'Оперативность',
  showAbsoluteTimestamps: 'Показывать абсолютные метки времени (например, «3-е марта») вместо относительных меток времени (например, «5 минут назад»)',
  ui: 'Интерфейс',
  grayscaleMode: 'Режим оттенков серого',
  wellnessFooter: `Эти настройки частично основаны на рекомендациях
    <a rel="noopener" target="_blank" href="https://humanetech.com">Центра гуманитарных технологий</a>.`,
  // This is a link: "You can filter or disable notifications in the _instance settings_"
  filterNotificationsPre: 'Вы можете фильтровать или отключать уведомления в',
  filterNotificationsText: 'настройках инстанса',
  filterNotificationsPost: '',
  // Custom tooltips, like "Disable _infinite scroll_", where you can click _infinite scroll_
  // to see a description. It's hard to properly internationalize, so we just break up the strings.
  disableInfiniteScrollPre: 'Отключить',
  disableInfiniteScrollText: 'бесконечную прокрутку',
  disableInfiniteScrollDescription: `Когда бесконечная прокрутка отключена, новые записи не будут автоматически появляться в
             внизу или вверху ленты. Вместо этого кнопки позволят вам
             загружать больше контента по запросу.`,
  disableInfiniteScrollPost: '',
  // Instance settings
  loggedInAs: 'Вы вошли как',
  homeTimelineFilters: 'Фильтры главной ленты',
  notificationFilters: 'Фильтры уведомлений',
  pushNotifications: 'Всплывающее уведомление',
  // Add instance page
  storageError: `Похоже, Semaphore не может хранить данные локально. Ваш браузер находится в приватном режиме
          или блокирует файлов cookie? Semaphore хранит все данные локально, и для этого требуется LocalStorage и
          IndexedDB для корректной работы.`,
  javaScriptError: 'Вы должны включить JavaScript, чтобы войти в систему.',
  enterInstanceName: 'Введите имя инстанса',
  instanceColon: 'Инстанс:',
  // Custom tooltip, concatenated together
  getAnInstancePre: "У вас нет",
  getAnInstanceText: 'инстанса',
  getAnInstanceDescription: 'Инстанс — это ваш домашний сервер Mastodon, например, mastodon.social или cybre.space.',
  getAnInstancePost: '?',
  joinMastodon: 'Присоединяйтесь к Mastodon!',
  instancesYouveLoggedInTo: "Инстансы, в которые вы вошли:",
  addAnotherInstance: 'Добавить другой инстанс',
  youreNotLoggedIn: "Вы не вошли ни в один инстанс.",
  currentInstanceLabel: `{instance} {current, select,
    true {(current instance)}
    other {}
  }`,
  // Link text
  logInToAnInstancePre: '',
  logInToAnInstanceText: 'Войти в инстанс',
  logInToAnInstancePost: 'чтобы начать использовать Semaphore.',
  // Another custom tooltip
  showRingPre: 'Всегда показывать',
  showRingText: 'кольцо фокусировки',
  showRingDescription: `TКольцо фокусировки — это контур, показывающий элемент, на котором в данный момент установлен фокус. По умолчанию отображается
    только при использовании клавиатуры (не мыши или сенсорного экрана), но вы можете выбрать, чтобы он отображался всегда.`,
  showRingPost: '',
  instances: 'Инстансы',
  addInstance: 'Добавить инстанс',
  homeTimelineFilterSettings: 'Настройки фильтров главной ленты',
  showReblogs: 'Показать продвижения',
  showReplies: 'Показывать ответы',
  switchOrLogOut: 'Переключитесь или выйдите из этого инстанса',
  switchTo: 'Переключиться на этот инстанс',
  switchToInstance: 'Переключиться на инстанс',
  switchToNameOfInstance: 'Переключиться на {instance}',
  logOut: 'Выйти',
  logOutOfInstanceConfirm: 'Выйти из {instance}?',
  notificationFilterSettings: 'Настройки фильтра уведомлений',
  // Push notifications
  browserDoesNotSupportPush: "Ваш браузер не поддерживает push-уведомления.",
  deniedPush: 'Вы запретили показывать уведомления.',
  pushNotificationsNote: 'Обратите внимание, что вы можете получать push-уведомления только для одного инстанса за раз.',
  pushSettings: 'Настройки push-уведомлений',
  newFollowers: 'Новые подписчики',
  reblogs: 'Продвижения',
  pollResults: 'Результаты опроса',
  subscriptions: 'Подписка на записи',
  needToReauthenticate: 'Вам необходимо пройти повторную аутентификацию, чтобы включить push-уведомления. Выйти из {instance}?',
  failedToUpdatePush: 'Не удалось обновить настройки push-уведомлений: {error}',
  // Themes
  chooseTheme: 'Выберите тему',
  darkBackground: 'Темный фон',
  lightBackground: 'Светлый фон',
  themeLabel: `{label} {default, select,
    true {(default)}
    other {}
  }`,
  animatedImage: 'Анимированное изображение: {description}',
  showImage: `Показывать {animated, select,
    true {animated}
    other {}
  } image: {description}`,
  playVideoOrAudio: `Воспроизводить {audio, select,
    true {audio}
    other {video}
  }: {description}`,
  accountFollowedYou: '{name} подписался на вас, {account}',
  accountSignedUp: '{name} зарегистрировался, {account}',
  reblogCountsHidden: 'Количество продвижений скрыто',
  favoriteCountsHidden: 'Количество избранного скрыто',
  rebloggedTimes: `Продвинуто {count, plural,
    one {1 time}
    other {{count} times}
  }`,
  favoritedTimes: `Добавлено в избранное {count, plural,
    one {1 time}
    other {{count} times}
  }`,
  pinnedStatus: 'Закрепленная запись',
  rebloggedYou: 'продвинул вашу запись',
  favoritedYou: 'добавил(-а) в избранное вашу запись',
  followedYou: 'подписался на вас',
  signedUp: 'зарегистрировался',
  posted: 'опубликовал',
  pollYouCreatedEnded: 'Созданный вами опрос завершен',
  pollYouVotedEnded: 'Опрос, в котором вы голосовали, завершен',
  reblogged: 'продвинул(-а)',
  favorited: 'добавил(-а) в избранное',
  unreblogged: 'отменил(-а) продвижение',
  unfavorited: 'удалил(-а) из избранного',
  showSensitiveMedia: 'Показать деликатное медиа',
  hideSensitiveMedia: 'Скрыть деликатное медиа',
  clickToShowSensitive: 'Деликатное содержимое. Нажмите, чтобы показать.',
  longPost: 'Длинная запись',
  // Accessible status labels
  accountRebloggedYou: '{account} продвинул(-а) вашу запись',
  accountFavoritedYou: '{account} добавил(-а) в избранное вашу запись',
  rebloggedByAccount: 'Продвинул(-а) {account}',
  contentWarningContent: 'Предупреждение о содержимом: {spoiler}',
  hasMedia: 'имеет медия',
  hasPoll: 'имеет опрос',
  shortStatusLabel: '{privacy} запись от {account}',
  // Privacy types
  public: 'Публичный',
  unlisted: 'Открытый',
  followersOnly: 'Только для подписчиков',
  direct: 'Личное сообщение',
  // Themes
  themeRoyal: 'Light',
  themeScarlet: 'Scarlet',
  themeSeafoam: 'Seafoam',
  themeHotpants: 'Hotpants',
  themeOaken: 'Oaken',
  themeMajesty: 'Majesty',
  themeGecko: 'Gecko',
  themeGrayscale: 'Grayscale',
  themeDark: 'Dark',
  themeCobalt: 'Cobalt',
  themeSorcery: 'Sorcery',
  themePunk: 'Punk',
  themeRiot: 'Riot',
  themeHacker: 'Hacker',
  themeMastodon: 'Mastodon',
  themePitchBlack: 'Pitch Black',
  themeDarkGrayscale: 'Dark Grayscale',
  // Polls
  voteOnPoll: 'Голосовать в опросе',
  pollChoices: 'Варианты опроса',
  vote: 'Голосовать',
  pollDetails: 'Детали опроса',
  refresh: 'Обновить',
  expires: 'Завершается',
  expired: 'Завершено',
  voteCount: `{count, plural,
    one {1 vote}
    other {{count} голосов}
  }`,
  // Status interactions
  clickToShowThread: '{time} - нажмите, чтобы показать тред',
  showMore: 'Показать больше',
  showLess: 'Показать меньше',
  closeReply: 'Закрыть ответ',
  cannotReblogFollowersOnly: 'Невозможно продвинуть, потому что это только для подписчиков',
  cannotReblogDirectMessage: 'Невозможно продвинуть, потому что это личное сообщение',
  reblog: 'Продвинуть',
  reply: 'Ответить',
  replyToThread: 'Ответить в треде',
  favorite: 'Добавить в избранное',
  unfavorite: 'Удалить из избранного',
  // timeline
  loadingMore: 'Загружается ещё…',
  loadMore: 'Загрузить ещё',
  showCountMore: 'Показать ещё {count}',
  nothingToShow: 'Нечего показывать.',
  // status thread page
  statusThreadPage: 'Страница треда записи',
  status: 'Запись',
  // toast messages
  blockedAccount: 'Аккаунт заблокирован',
  unblockedAccount: 'Аккаунт разблокирован',
  unableToBlock: 'Не удалось заблокировать аккаунт: {error}',
  unableToUnblock: 'Не удалось разблокировать аккаунт: {error}',
  bookmarkedStatus: 'Запись добавлена в закладки',
  unbookmarkedStatus: 'Запись удалена из закладок',
  unableToBookmark: 'Не удалось добавить в закладки: {error}',
  unableToUnbookmark: 'Не удалось удалить из закладок: {error}',
  cannotPostOffline: 'Вы не можете публиковать записи в офлайн-режиме',
  unableToPost: 'Не удалось опубликовать запись: {error}',
  statusDeleted: 'Запись удалена',
  unableToDelete: 'Не удалось удалить запись: {error}',
  cannotFavoriteOffline: 'Вы не можете добавлять в избранное в офлайн-режиме режиме',
  cannotUnfavoriteOffline: 'Вы не можете удалять из избранного в офлайн-режиме режиме',
  unableToFavorite: 'Не удалось добавить в избранное: {error}',
  unableToUnfavorite: 'Не удалось удалить из избранного: {error}',
  followedAccount: 'Подписан(-на) на аккаунт',
  unfollowedAccount: 'Отписан(-на) от аккаунта',
  unableToFollow: 'Не удалось подписаться на аккаунт: {error}',
  unableToUnfollow: 'Не удалось отписаться от аккаунта: {error}',
  accessTokenRevoked: 'Токен доступа был отозван, выполнен выход из {instance}',
  loggedOutOfInstance: 'Выполнен выход из {instance}',
  failedToUploadMedia: 'Не удалось загрузить мультимедиа: {error}',
  mutedAccount: 'Аккаунт игнорируется',
  unmutedAccount: 'Аккаунт не игнорируется',
  unableToMute: 'Не удалось добавить аккаунт в игнорируемые: {error}',
  unableToUnmute: 'Не удалось удалить аккаунт из игнорируемых: {error}',
  mutedConversation: 'Обсуждение добавлено в игнорируемые',
  unmutedConversation: 'Обсуждение удалено из игнорируемых',
  unableToMuteConversation: 'Не удалось добавить обсуждение в игнорируемые: {error}',
  unableToUnmuteConversation: 'Не удалось удалить обсуждение из игнорируемых: {error}',
  unpinnedStatus: 'Запись откреплена',
  unableToPinStatus: 'Не удалось закрепить запись: {error}',
  unableToUnpinStatus: 'Не удалось открепить запись: {error}',
  unableToRefreshPoll: 'Не удалось обновить опрос: {error}',
  unableToVoteInPoll: 'Не удалось проголосовать в опросе: {error}',
  cannotReblogOffline: 'Вы не можете продвигать в оффлайн-режиме.',
  cannotUnreblogOffline: 'Вы не можете отменить продвижение в оффлайн-режиме.',
  failedToReblog: 'Не удалось продвинуть: {error}',
  failedToUnreblog: 'Не удалось отменить продвижение: {error}',
  submittedReport: 'Жалоба отправлена',
  failedToReport: 'Не удалось отправить жалобу: {error}',
  approvedFollowRequest: 'Запрос на подписку одобрен',
  rejectedFollowRequest: 'Запрос на подписку отклонен',
  unableToApproveFollowRequest: 'Не удалось одобрить запрос на подписку: {error}',
  unableToRejectFollowRequest: 'Не удалось отклонить запрос на подписку: {error}',
  searchError: 'Ошибка во время поиска: {error}',
  hidDomain: 'Домен скрыт',
  unhidDomain: 'Домен удален из скрытых',
  unableToHideDomain: 'Не удалось скрыть домен: {error}',
  unableToUnhideDomain: 'Не удалось удалить домен из скрытых: {error}',
  showingReblogs: 'Показывать продвижения',
  hidingReblogs: 'Скрывать продвижения',
  unableToShowReblogs: 'Не удалось показать продвижения: {error}',
  unableToHideReblogs: 'Не удалось скрыть продвижения: {error}',
  unableToShare: 'Не удалось поделиться: {error}',
  unableToSubscribe: 'Не удалось подписаться: {error}',
  unableToUnsubscribe: 'Не удалось отписаться: {error}',
  showingOfflineContent: 'Интернет-запрос не выполнен. Отображается офлайн-содержимое.',
  youAreOffline: 'Похоже, вы не в сети. Вы по-прежнему можете читать записи в офлайн-режиме.',
  // Snackbar UI
  updateAvailable: 'Доступно обновление приложения.',
  // Word/phrase filters
  wordFilters: 'Фильтры слов',
  noFilters: 'У вас нет фильтров слов.',
  wordOrPhrase: 'Слово или фраза',
  contexts: 'Контексты',
  addFilter: 'Добавить фильтр',
  editFilter: 'Редактировать фильтр',
  filterHome: 'Главная и списки',
  filterNotifications: 'Уведомления',
  filterPublic: 'Публичные ленты',
  filterThread: 'Обсуждения',
  filterAccount: 'Профили',
  filterUnknown: 'Неизвестный',
  expireAfter: 'Истекает через',
  whereToFilter: 'Где фильтровать',
  irreversible: 'Необратимый',
  wholeWord: 'Целое слово',
  save: 'Сохранить',
  updatedFilter: 'Фильтр обновлён',
  createdFilter: 'Фильтр создан',
  failedToModifyFilter: 'Не удалось изменить фильтр: {error}',
  deletedFilter: 'Фильтр удалён',
  required: 'Требуется',
  // Dialogs
  profileOptions: 'Параметры профиля',
  copyLink: 'Копировать ссылку',
  emoji: 'Эмодзи',
  editMedia: 'Редактировать медиа',
  shortcutHelp: 'Быстрая помощь',
  statusOptions: 'Параметры статуса',
  confirm: 'Подтвердить',
  closeDialog: 'Закрыть диалог',
  postPrivacy: 'Конфиденциальность записи',
  homeOnInstance: 'Главная на {instance}',
  statusesTimelineOnInstance: 'Записи: {timeline} лента на {instance}',
  statusesHashtag: 'Записи: #{hashtag} хэштег',
  statusesThread: 'Записи: треды',
  statusesAccountTimeline: 'Записи: лента аккаунта',
  statusesList: 'Записи: список',
  notificationsOnInstance: 'Уведомления на {instance}',
  // Details
  statusEdited: 'Edited'
}
