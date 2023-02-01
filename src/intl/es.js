export default {
  // Home page, basic <title> and <description>
  appName: 'Semaphore',
  appDescription: 'Un cliente web alternativo para Mastodon, centrado en la velocidad y la sencillez.',
  homeDescription: `
    <p>
      Semaphore es un cliente web para
      <a rel="noopener" target="_blank" href="https://joinmastodon.org">Mastodon</a>,
      diseñado para ser rápido y sencillo.
    </p>
    <p>
      Comienza iniciando sesión en una instancia:
    </p>`,
  logIn: 'Iniciar sesión',
  footer: `
    <p>
      Semaphore es
      <a rel="noopener" target="_blank" href="https://github.com/NickColley/semaphore">software de código abierto</a>
      mantenido por
      <a rel="noopener" target="_blank" href="https://nickcolley.co.uk"Nick Colley</a>
      y distribuido bajo la
      <a rel="noopener" target="_blank"
         href="https://github.com/NickColley/semaphore/blob/main/LICENSE">Licencia AGPL</a>.
      Aquí está la <a href="/settings/about#privacy-policy" rel="prefetch">política de privacidad</a>.
      Es una continuación de Pinafore creado por
        <a rel="noopener" target="_blank" href="https://nolanlawson.com">Nolan Lawson</a>.
    </p>
  `,
  // Manifest
  longAppName: 'Semaphore para Mastodon',
  newStatus: 'Nuevo toot',
  // Generic UI
  loading: 'Cargando',
  okay: 'OK',
  cancel: 'Cancelar',
  alert: 'Alerta',
  close: 'Cerrar',
  error: 'Error: {error}',
  errorShort: 'Error:',
  // Relative timestamps
  justNow: 'ahora mismo',
  // Navigation, page titles
  navItemLabel: `
    {label} {selected, select,
      true {(página actual)}
      other {}
    } {name, select,
      notifications {{count, plural,
        =0 {}
        one {(1 notificación)}
        other {({count} notificaciones)}
      }}
      community {{count, plural,
        =0 {}
        one {(1 solicitud de seguimiento)}
        other {({count} solicitudes de seguimiento)}
      }}
      other {}
    }
  `,
  blockedUsers: 'Usuarios bloqueados',
  bookmarks: 'Marcadores',
  directMessages: 'Mensajes directos',
  favorites: 'Favoritos',
  federated: 'Federada',
  home: 'Inicio',
  local: 'Local',
  notifications: 'Notificaciones',
  mutedUsers: 'Usuarios silenciados',
  pinnedStatuses: 'Toots fijados',
  followRequests: 'Solicitudes de seguimiento',
  followRequestsLabel: `Solicitudes de seguimiento {hasFollowRequests, select,
    true {({count})}
    other {}
  }`,
  list: 'Lista',
  search: 'Buscar',
  pageHeader: 'Encabezado de página',
  goBack: 'Retroceder',
  back: 'Atrás',
  profile: 'Perfil',
  federatedTimeline: 'Cronología federada',
  localTimeline: 'Cronología local',
  // community page
  community: 'Comunidad',
  pinnableTimelines: 'Cronologías que puedes fijar',
  timelines: 'Cronologías',
  lists: 'Listas',
  instanceSettings: 'Opciones para instancia',
  notificationMentions: 'Notificación de menciones',
  profileWithMedia: 'Perfil con multimedia',
  profileWithReplies: 'Perfil con respuestas',
  hashtag: 'Hashtag',
  // not logged in
  profileNotLoggedIn: 'Aquí se mostrará una cronología de usuario cuando hayas iniciado sesión.',
  bookmarksNotLoggedIn: 'Tus marcadores se mostrarán aquí cuando hayas iniciado sesión.',
  directMessagesNotLoggedIn: 'Tus mensajes directos se mostrarán aquí cuando hayas iniciado sesión.',
  favoritesNotLoggedIn: 'Tus favoritos se mostrarán aquí cuando hayas iniciado sesión.',
  federatedTimelineNotLoggedIn: 'Tu cronología federada se mostrará aquí cuando hayas iniciado sesión.',
  localTimelineNotLoggedIn: 'Tu cronología localse mostrará aquí cuando hayas iniciado sesión.',
  searchNotLoggedIn: 'Puedes buscar una vez que inicias sesión en una instancia.',
  communityNotLoggedIn: 'Las opciones para comunidad se mostrarán aquí cuando hayas iniciado sesión.',
  listNotLoggedIn: 'Aquí se mostrará una lista cuando hayas iniciado sesión.',
  notificationsNotLoggedIn: 'Tus notificaciones se mostrarán aquí cuando hayas iniciado sesión.',
  notificationMentionsNotLoggedIn: 'Las notificaciones de tus menciones se mostrarán aquí cuando hayas iniciado sesión.',
  statusNotLoggedIn: 'Aquí se mostrará un hilo de toots cuando hayas iniciado sesión.',
  tagNotLoggedIn: 'Aquí se mostrará una cronología de hashtags cuando hayas iniciado sesión.',
  // Notification subpages
  filters: 'Filtros',
  all: 'Todo',
  mentions: 'Menciones',
  // Follow requests
  approve: 'Aceptar',
  reject: 'Rechazar',
  // Hotkeys
  hotkeys: 'Atajos de teclado',
  global: 'Globales',
  timeline: 'Cronología',
  media: 'Multimedia',
  globalHotkeys: `
    {leftRightChangesFocus, select,
      true {
        <li><kbd>→</kbd> para ir al elemento enfocable siguiente</li>
        <li><kbd>←</kbd> para ir al elemento enfocable anterior</li>
      }
      other {}
    }
    <li>
      <kbd>1</kbd> - <kbd>6</kbd>
      {leftRightChangesFocus, select,
        true {}
        other {o <kbd>←</kbd>/<kbd>→</kbd>}
      }
      para cambiar de columna
    </li>
    <li><kbd>7</kbd> o <kbd>c</kbd> para redactar un nuevo toot</li>
    <li><kbd>s</kbd> o <kbd>/</kbd> para buscar</li>
    <li><kbd>g</kbd> + <kbd>h</kbd> para ir a inicio</li>
    <li><kbd>g</kbd> + <kbd>n</kbd> para ir a notificaciones</li>
    <li><kbd>g</kbd> + <kbd>l</kbd> to para ir a la cronología local</li>
    <li><kbd>g</kbd> + <kbd>t</kbd> para ir a la cronología federada</li>
    <li><kbd>g</kbd> + <kbd>c</kbd> para ir a la página comunidad</li>
    <li><kbd>g</kbd> + <kbd>d</kbd> para ir a la página de mensajes directos</li>
    <li><kbd>h</kbd> o <kbd>?</kbd> para abrir o cerrar el diálogo de ayuda</li>
    <li><kbd>Backspace</kbd> para retroceder, cerrar diálogos</li>
  `,
  timelineHotkeys: `
    <li><kbd>j</kbd> o <kbd>↓</kbd> para activar el toot siguiente</li>
    <li><kbd>k</kbd> o <kbd>↑</kbd> para activar el toot anterior</li>
    <li><kbd>.</kbd> para mostrar más y desplazarse al principio</li>
    <li><kbd>o</kbd> para abrir</li>
    <li><kbd>f</kbd> para marcar como favorito</li>
    <li><kbd>b</kbd> para reenviar</li>
    <li><kbd>r</kbd> para responder</li>
    <li><kbd>Escape</kbd> para cerrar respuesta</li>
    <li><kbd>a</kbd> para marcador</li>
    <li><kbd>i</kbd> para abrir imágenes, vídeo o audio</li>
    <li><kbd>y</kbd> para mostrar u ocultar multimedia sensible</li>
    <li><kbd>m</kbd> para mencionar al autor</li>
    <li><kbd>p</kbd> para abrir el perfil del autor</li>
    <li><kbd>l</kbd> para abrir el enlace de la publicación en una nueva pestaña</li>
    <li><kbd>x</kbd> para mostrar u ocultar el texto tras una advertencia de contenido</li>
    <li><kbd>z</kbd> para mostrar u ocultar todas las advertencias de contenido en un hilo</li>
  `,
  mediaHotkeys: `
    <li><kbd>←</kbd> / <kbd>→</kbd> para ir a siguiente o anterior</li>
  `,
  // Community page, tabs
  tabLabel: `{label} {current, select,
    true {(Actual)}
    other {}
  }`,
  pageTitle: `
    {hasNotifications, select,
      true {({count})}
      other {}
    }
    {name}
    ·
    {showInstanceName, select,
      true {{instanceName}}
      other {Semaphore}
    }
  `,
  pinLabel: `{label} {pinnable, select,
    true {
      {pinned, select,
        true {(página fijada)}
        other {(Página no fijada)}
      }
    }
    other {}
  }`,
  pinPage: 'Fijar {label}',
  // Status composition
  composeStatus: 'Redactar toot',
  postStatus: 'Toot!',
  contentWarning: 'Advertencia de contenido',
  dropToUpload: 'Soltar para subir',
  invalidFileType: 'Tipo de fichero no válido',
  composeLabel: '¿En qué estás pensando?',
  autocompleteDescription: 'Cuando haya disponibles resultados de autocompletado, pulsa las flechas arriba o abajo y enter para seleccionar.',
  mediaUploads: 'Subidas multimedia',
  edit: 'Editar',
  delete: 'Borrar',
  description: 'Descripción',
  descriptionLabel: 'Describir para las personas con discapacidad visual (imagen, vídeo) o con discapacidad auditiva (audio, vídeo)',
  markAsSensitive: 'Marcar multimedia como sensible',
  // Polls
  createPoll: 'Crear encuesta',
  removePollChoice: 'Eliminar opción {index}',
  pollChoiceLabel: 'Opción {index}',
  multipleChoice: 'Selección múltiple',
  pollDuration: 'Duración de la encuesta',
  fiveMinutes: '5 minutos',
  thirtyMinutes: '30 minutos',
  oneHour: '1 hora',
  sixHours: '6 horas',
  twelveHours: '12 horas',
  oneDay: '1 día',
  threeDays: '3 días',
  sevenDays: '7 días',
  never: 'Nunca',
  addEmoji: 'Insertar emoji',
  addMedia: 'Añadir multimedia (imágenes, vídeo, audio)',
  addPoll: 'Añadir encuesta',
  removePoll: 'Eliminar encuesta',
  postPrivacyLabel: 'Ajustar privacidad (actualmente {label})',
  addContentWarning: 'Añadir advertencia de contenido',
  removeContentWarning: 'Eliminar advertencia de contenido',
  altLabel: 'Describir para las personas con discapacidad visual',
  extractText: 'Extraer texto de imagen',
  extractingText: 'Extrayendo texto…',
  extractingTextCompletion: 'Extrayendo texto ({percent}% completado)…',
  unableToExtractText: 'No se puede extraer texto.',
  // Account options
  followAccount: 'Seguir a {account}',
  unfollowAccount: 'Dejar de seguir a {account}',
  blockAccount: 'Bloquear a {account}',
  unblockAccount: 'Desbloquear a {account}',
  muteAccount: 'Silenciar a {account}',
  unmuteAccount: 'Dejar de silenciar a Unmute {account}',
  showReblogsFromAccount: 'Mostrar toots reenviados por {account}',
  hideReblogsFromAccount: 'Ocultar toots reenviados por {account}',
  showDomain: 'Dejar de ocultar {domain}',
  hideDomain: 'Ocultar {domain}',
  reportAccount: 'Denunciar a {account}',
  mentionAccount: 'Mencionar a {account}',
  copyLinkToAccount: 'Copiar enlace a cuenta',
  copiedToClipboard: 'Copiado al portapapeles',
  // Media dialog
  navigateMedia: 'Navegar por elementos multimedia',
  showPreviousMedia: 'Mostrar multimedia anterior',
  showNextMedia: 'Mostrar multimedia siguiente',
  enterPinchZoom: 'Modo pinch-zoom',
  exitPinchZoom: 'Salir del modo pinch-zoom',
  showMedia: `Mostrar {index, select,
    1 {primer}
    2 {segundo}
    3 {tercero}
    other {cuarto}
  } multimedia {current, select,
    true {(actual)}
    other {}
  }`,
  previewFocalPoint: 'Previsualizar (punto focal)',
  enterFocalPoint: 'Introducir el punto focal (X, Y) para este multimedia',
  muteNotifications: 'Silenciar también las notificaciones',
  muteAccountConfirm: '¿Silenciar a {account}?',
  mute: 'Silenciar',
  unmute: 'Dejar de silenciar',
  zoomOut: 'Alejar',
  zoomIn: 'Acercar',
  // Reporting
  reportingLabel: 'Estás denunciando a {account} a los moderadores de {instance}.',
  additionalComments: 'Comentarios adicionales',
  forwardDescription: '?Reenviar también a los moderadores de {instance}?',
  forwardLabel: 'Reenviar a {instance}',
  unableToLoadStatuses: 'No se pueden cargar los toots recientes: {error}',
  report: 'Denunciar',
  noContent: '(Sin contenido)',
  noStatuses: 'No hay toots para denunciar',
  // Status options
  unpinFromProfile: 'Dejar de fijar en el perfil',
  pinToProfile: 'Fijar en el perfil',
  muteConversation: 'Silenciar conversación',
  unmuteConversation: 'Dejar de silenciar conversación',
  bookmarkStatus: 'Poner marcador al toot',
  unbookmarkStatus: 'Quitar marcador al toot',
  deleteAndRedraft: 'Borrar y volver a redactar',
  reportStatus: 'Denunciar toot',
  shareStatus: 'Compartir toot',
  copyLinkToStatus: 'Copiar enlace al toot',
  // Account profile
  profileForAccount: 'Perfil para {account}',
  statisticsAndMoreOptions: 'Estadísticas y más opciones',
  statuses: 'Toots',
  follows: 'Siguiendo',
  followers: 'Seguidores',
  moreOptions: 'Más opciones',
  followersLabel: 'Te han seguido {count}',
  followingLabel: 'Has seguido a {count}',
  followLabel: `Seguimiento {requested, select,
    true {(solicitud de seguimiento)}
    other {}
  }`,
  unfollowLabel: `Dejar de seguir {requested, select,
    true {(solicitud de seguimiento)}
    other {}
  }`,
  notify: 'Suscribirse a {account}',
  denotify: 'Cancelar suscripción a {account}',
  subscribedAccount: 'Te has suscrito a la cuenta',
  unsubscribedAccount: 'Has cancelado tu suscripción a la cuenta',
  unblock: 'Desbloquear',
  nameAndFollowing: 'Nombre y seguimientos',
  clickToSeeAvatar: 'Haz clic para ver el avatar',
  opensInNewWindow: '{label} (Se abre en nueva ventana)',
  blocked: 'Bloqueado',
  domainHidden: 'Dominio oculto',
  muted: 'Silenciado',
  followsYou: 'Te está siguiendo',
  avatarForAccount: 'Avatar para {account}',
  fields: 'Campos',
  accountHasMoved: '{account} se ha trasladado:',
  profilePageForAccount: 'Página de perfil para {account}',
  verified: 'Verified',
  // About page
  about: 'Acerca de',
  aboutApp: 'Acerca de Semaphore',
  aboutAppDescription: `
  <p>
    Semaphore es
    <a rel="noopener" target="_blank"
      href="https://github.com/NickColley/semaphore">software de código abierto</a>
    mantenido por
    <a rel="noopener" target="_blank" href="https://nickcolley.co.uk"Nick Colley</a>
    y distribuido bajo la
    <a rel="noopener" target="_blank"
      href="https://github.com/NickColley/semaphore/blob/main/LICENSE">Licencia AGPL</a>.
    Aquí está la <a href="/settings/about#privacy-policy" rel="prefetch">política de privacidad</a>.
    Es una continuación de Pinafore creado por
      <a rel="noopener" target="_blank" href="https://nolanlawson.com">Nolan Lawson</a>.
  </p>

  <h2 id="privacy-policy">Política de privacidad</h2>

  <p>
    Semaphore no almacena ninguna información personal en sus servidores,
    incluyendo, pero no limitándose a nombres, direcciones de correo electrónico,
    direcciones IP, posts y fotos.
  </p>

  <p>
    Semaphore es un sitio estático. Todos los datos son almacenados en tu navegador y compartidos con las instancias del fediverso
    a las que te conectas.
  </p>

  <h2>Créditos</h2>

  <p>
    Iconos proporcionados por <a rel="noopener" target="_blank" href="http://fontawesome.io/">Font Awesome</a>.
  </p>

  <p>
    Logo gracias a "Flag" por AFY Studio, de
    <a rel="noopener" target="_blank" href="https://thenounproject.com/">the Noun Project</a>.
  </p>`,
  // Settings
  settings: 'Opciones de configuración',
  general: 'General',
  generalSettings: 'Opciones generales',
  showSensitive: 'Mostrar multimedia sensible por defecto',
  showPlain: 'Mostrar un color gris liso para multimedia sensible',
  allSensitive: 'Tratar todo multimedia como sensible',
  largeMedia: 'Mostrar imágenes y vídeos grandes incrustados',
  autoplayGifs: 'Reproducir automáticamente GIFs animados',
  hideCards: 'Ocultar paneles de previsualización de enlaces',
  underlineLinks: 'Subrayar enlaces en toots y perfiles',
  accessibility: 'Accesibilidad',
  reduceMotion: 'Reducir movimiento en animaciones de la interfaz',
  disableTappable: 'Deshabilitar área para tocar en todo el toot',
  removeEmoji: 'Eliminar emoji de nombres de usuario',
  shortAria: 'Usar etiquetas ARIA cortas para artículos',
  theme: 'Diseño visual',
  themeForInstance: 'Diseño visual para {instance}',
  disableCustomScrollbars: 'Deshabilitar barras deslizantes personalizadas',
  bottomNav: 'Situar la barra de navegación al final de la pantalla',
  centerNav: 'Centrar la barra de navegación',
  preferences: 'Preferencias',
  hotkeySettings: 'Opciones para atajos de teclado',
  disableHotkeys: 'Deshabilitar todos los atajos de teclado',
  leftRightArrows: 'Las flechas izquierda/derecha cambian el foco en vez de columnas/multimedia',
  guide: 'Guía',
  reload: 'Recargar',
  // Wellness settings
  wellness: 'Bienestar',
  wellnessSettings: 'Opciones para el bienestar',
  wellnessDescription: `Las opciones para el bienestar están diseñadas para reducir los aspectos que inducen adicción o ansiedad en las redes sociales.
    Elige cualquier opción que vaya bien para ti.`,
  enableAll: 'Habilitar todos',
  metrics: 'Métricas',
  hideFollowerCount: 'Ocultar recuento de seguidores (hasta 10)',
  hideReblogCount: 'Ocultar recuento de reenvíos',
  hideFavoriteCount: 'Ocultar recuento de favoritos',
  hideUnread: 'Ocultar recuento de notificaciones sin leer (es decir, el punto rojo)',
  // The quality that makes something seem important or interesting because it seems to be happening now
  immediacy: 'Inmediatez',
  showAbsoluteTimestamps: 'Mostrar marcas de tiempo absolutas (p.ej., "3 de marzo") en vez de marcas de tiempo relativas (p. ej., "hace 5 minutos")',
  ui: 'Interfaz',
  grayscaleMode: 'Modo escala de grises',
  wellnessFooter: `Estas opciones están parcialmente basadas en pautas del
    <a rel="noopener" target="_blank" href="https://humanetech.com">Center for Humane Technology</a>.`,
  // This is a link: "You can filter or disable notifications in the _instance settings_"
  filterNotificationsPre: 'Puedes filtrar o deshabilitar notificaciones en',
  filterNotificationsText: 'opciones para instancia',
  filterNotificationsPost: '',
  // Custom tooltips, like "Disable _infinite scroll_", where you can click _infinite scroll_
  // to see a description. It's hard to properly internationalize, so we just break up the strings.
  disableInfiniteScrollPre: 'Deshabilitar',
  disableInfiniteScrollText: 'desplazamiento infinito',
  disableInfiniteScrollDescription: `Cuando el desplazamiento infinito esté deshabilitado, los nuevos toots no se mostrarán automáticamente al final o al principio de la cronología. En vez de esto, habrá botones que te permitirán
             cargar más contenido a demanda.`,
  disableInfiniteScrollPost: '',
  // Instance settings
  loggedInAs: 'Iniciaste sesión como',
  homeTimelineFilters: 'Filtros para la cronología Inicio',
  notificationFilters: 'Filtros para notificaciones',
  pushNotifications: 'Notificaciones Push',
  // Add instance page
  storageError: `Parece que Semaphore no puede almacenar datos localmente. ¿Está tu navegador en modo privado
          o bloqueando las cookies? Semaphore almacena todos los datos localmente, y requiere LocalStorage e
          IndexedDB para funcionar correctamente.`,
  javaScriptError: 'Debes habilitar JavaScript para iniciar sesión.',
  enterInstanceName: 'Introducir nombre de instancia',
  instanceColon: 'Instancia:',
  // Custom tooltip, concatenated together
  getAnInstancePre: '¿No tienes una',
  getAnInstanceText: 'instancia',
  getAnInstanceDescription: 'Una instancia es tu servidor de inicio de Mastodon, por ejemplo, mastodon.social o cybre.space.',
  getAnInstancePost: '?',
  joinMastodon: '¡Unirse a Mastodon!',
  instancesYouveLoggedInTo: 'Instancias en las que has iniciado sesión:',
  addAnotherInstance: 'Añadir otra instancia',
  youreNotLoggedIn: 'No has iniciado sesión en ninguna instancia.',
  currentInstanceLabel: `{instance} {current, select,
    true {(instancia actual)}
    other {}
  }`,
  // Link text
  logInToAnInstancePre: '',
  logInToAnInstanceText: 'Inicia sesión en una instancia',
  logInToAnInstancePost: 'para empezar a usar Semaphore.',
  // Another custom tooltip
  showRingPre: 'Mostrar siempre',
  showRingText: 'anillo del foco',
  showRingDescription: 'El anillo del foco es el contorno que muestra el elemento que actualmente tiene el foco. Por defecto solo se muestra cuando se usa el teclado (no el ratón o un dispositivo táctil), pero puedes elegir mostrarlo siempre.',
  showRingPost: '',
  instances: 'Instancias',
  addInstance: 'Añadir instancia',
  homeTimelineFilterSettings: 'Opciones para filtros de la cronología Inicio',
  showReblogs: 'Mostrar reenvíos',
  showReplies: 'Mostrar respuestas',
  switchOrLogOut: 'Seleccionar o cerrar sesión en esta instancia',
  switchTo: 'Seleccionar esta instancia',
  switchToInstance: 'Seleccionar instancia',
  switchToNameOfInstance: 'Seleccionar {instance}',
  logOut: 'Cerrar sesión',
  logOutOfInstanceConfirm: '¿Cerrar sesión en {instance}?',
  notificationFilterSettings: 'Opciones para filtros de notificaciones',
  // Push notifications
  browserDoesNotSupportPush: 'Tu navegador no admite notificaciones Push.',
  deniedPush: 'Has denegado el permiso para mostrar notificaciones.',
  pushNotificationsNote: 'Observa que solo puedes recibir notificaciones Push para una instancia al mismo tiempo.',
  pushSettings: 'Opciones para notificaciones Push',
  newFollowers: 'Nuevos seguidores',
  reblogs: 'Reenvíos',
  pollResults: 'Resultados de encuesta',
  subscriptions: 'Suscripción a toots',
  needToReauthenticate: 'Tienes que volver a autenticarte para habilitar las notificaciones Push. ¿Cerrr sesión en {instance}?',
  failedToUpdatePush: 'Se ha producido un fallo al actualizar las opciones para notificaciones Push: {error}',
  // Themes
  chooseTheme: 'Elegir un diseño visual',
  darkBackground: 'Fondo oscuro',
  lightBackground: 'Fondo claro',
  themeLabel: `{label} {default, select,
    true {(por defecto)}
    other {}
  }`,
  animatedImage: 'Imagen animada: {description}',
  showImage: `Mostrar {animated, select,
    true {animated}
    other {}
  } imagen: {description}`,
  playVideoOrAudio: `Reproducir {audio, select,
    true {audio}
    other {vídeo}
  }: {description}`,
  accountFollowedYou: '{name} te siguió, {account}',
  accountSignedUp: '{name} inició sesión, {account}',
  accountRequestedFollow: '{name} solicitó seguirte, {account}',
  accountReported: '{name} creó una denuncia, {account}',
  reblogCountsHidden: 'Recuento de reenvíos oculto',
  favoriteCountsHidden: 'Recuento de favoritos oculto',
  rebloggedTimes: `Reenviado {count, plural,
    one {1 vez}
    other {{count} veces}
  }`,
  favoritedTimes: `Marcado como favorito {count, plural,
    one {1 vez}
    other {{count} veces}
  }`,
  pinnedStatus: 'Toot fijado',
  rebloggedYou: 'reenvió tu toot',
  favoritedYou: 'marcó como favorito tu toot',
  followedYou: 'te siguió',
  edited: 'editó su toot',
  requestedFollow: 'solicitó seguirte',
  reported: 'creó una denuncia',
  signedUp: 'sesión iniciada',
  posted: 'publicado',
  pollYouCreatedEnded: 'Una encuesta que creaste ha finalizado',
  pollYouVotedEnded: 'Una encuesta en la que votaste ha finalizado',
  reblogged: 'reenviado',
  favorited: 'marcado como favorito',
  unreblogged: 'no reenviado',
  unfavorited: 'no marcado como favorito',
  showSensitiveMedia: 'Mostrar multimedia sensible',
  hideSensitiveMedia: 'Ocultar multimedia sensible',
  clickToShowSensitive: 'Contenido sensible. Haz clic para mostrar.',
  longPost: 'Publicación larga',
  // Accessible status labels
  accountRebloggedYou: '{account} reenvió tu toot',
  accountFavoritedYou: '{account} marcó como favorito tu toot',
  accountEdited: '{account} editó su toot',
  rebloggedByAccount: 'reenviado por {account}',
  contentWarningContent: 'Advertencia de contenido: {spoiler}',
  hasMedia: 'tiene multimedia',
  hasPoll: 'tiene encuesta',
  shortStatusLabel: '{privacy} toot de {account}',
  // Privacy types
  public: 'Público',
  unlisted: 'No listado',
  followersOnly: 'Solo seguidores',
  direct: 'Directo',
  // Themes
  themeRoyal: 'Light',
  themeScarlet: 'Escarlata',
  themeSeafoam: 'Espuma de mar',
  themeHotpants: 'Hotpants',
  themeOaken: 'Roble',
  themeMajesty: 'Majesty',
  themeGecko: 'Gecko',
  themeGrayscale: 'Escala de grises',
  themeDark: 'Dark',
  themeCobalt: 'Cobalto',
  themeSorcery: 'Sorcery',
  themePunk: 'Punk',
  themeRiot: 'Riot',
  themeHacker: 'Hacker',
  themeMastodon: 'Mastodon',
  themePitchBlack: 'Tono negro',
  themeDarkGrayscale: 'Escala de gris oscuro',
  // Polls
  voteOnPoll: 'Votar en encuesta',
  pollChoices: 'Opciones de la encuesta',
  vote: 'Votar',
  pollDetails: 'Detalles de la encuesta',
  refresh: 'Actualizar',
  expires: 'Finaliza',
  expired: 'Finalizada',
  voteCount: `{count, plural,
    one {1 voto}
    other {{count} votos}
  }`,
  // Status interactions
  clickToShowThread: '{time} - haz clic para mostrar el hilo',
  showMore: 'Mostrar más',
  showLess: 'Mostrar menos',
  closeReply: 'Cerrar respuesta',
  cannotReblogFollowersOnly: 'No se puede reenviar porque es solo para seguidores',
  cannotReblogDirectMessage: 'No se puede reenviar porque es un mensaje directo',
  reblog: 'Reenviar',
  reply: 'Responder',
  replyToThread: 'Responder al hilo',
  favorite: 'Favorito',
  unfavorite: 'No favorito',
  // timeline
  loadingMore: 'Cargando más…',
  loadMore: 'Cargar más',
  showCountMore: 'Mostrar {count} más',
  nothingToShow: 'Nada para mostrar.',
  // status thread page
  statusThreadPage: 'Página de hilo de toots',
  status: 'Toot',
  // toast messages
  blockedAccount: 'Cuenta bloqueada',
  unblockedAccount: 'Cuenta desbloqueada',
  unableToBlock: 'No se puede bloquear la cuenta: {error}',
  unableToUnblock: 'No se puede desbloquear la cuenta: {error}',
  bookmarkedStatus: 'Toot con marcador',
  unbookmarkedStatus: 'Toot sin marcador',
  unableToBookmark: 'No se puede poner marcador: {error}',
  unableToUnbookmark: 'No se puede quitar marcador: {error}',
  cannotPostOffline: 'No puedes publicar mientras estás sin conexión',
  unableToPost: 'No se puede publicar el toot: {error}',
  statusDeleted: 'Toot borrado',
  unableToDelete: 'No se puede borrar el toot: {error}',
  cannotFavoriteOffline: 'No puedes marcar como favorito mientras estás sin conexión',
  cannotUnfavoriteOffline: 'No puedes quitar marca de favorito mientras estás sin conexión',
  unableToFavorite: 'No se puede marcar como favorito: {error}',
  unableToUnfavorite: 'No se puede quitar marca de favorito: {error}',
  followedAccount: 'Cuenta seguida',
  unfollowedAccount: 'Cuenta no seguida',
  unableToFollow: 'No se puede seguir a la cuenta: {error}',
  unableToUnfollow: 'No se puede dejar de seguir a la cuenta: {error}',
  accessTokenRevoked: 'El token de acceso fue anulado, se cerró sesión en {instance}',
  loggedOutOfInstance: 'Se cerró sesión en {instance}',
  failedToUploadMedia: 'Falló la subida del multimedia: {error}',
  mutedAccount: 'Cuenta silenciada',
  unmutedAccount: 'Cuenta no silenciada',
  unableToMute: 'No se puede silenciar la cuenta: {error}',
  unableToUnmute: 'No se puede dejar de silenciar la cuenta: {error}',
  mutedConversation: 'Conversación silenciada',
  unmutedConversation: 'Conversación no silenciada',
  unableToMuteConversation: 'No se puede silenciar la conversación: {error}',
  unableToUnmuteConversation: 'No se puede dejar de silenciar la conversación: {error}',
  unpinnedStatus: 'Toot no fijado',
  unableToPinStatus: 'No se puede fijar el toot: {error}',
  unableToUnpinStatus: 'No se puede dejar de fijar el toot: {error}',
  unableToRefreshPoll: 'No se puede actualizar la encuesta: {error}',
  unableToVoteInPoll: 'No se puede votar en la encuesta: {error}',
  cannotReblogOffline: 'No puedes reenviar mientras estás sin conexión.',
  cannotUnreblogOffline: 'No puedes deshacer reenvíos mientras estás sin conexión.',
  failedToReblog: 'Fallo al reenviar: {error}',
  failedToUnreblog: 'Fallo al deshacer reenvío: {error}',
  submittedReport: 'Denuncia enviada',
  failedToReport: 'Fallo al enviar denuncia: {error}',
  approvedFollowRequest: 'Solicitud de seguimiento aceptada',
  rejectedFollowRequest: 'Solicitud de seguimiento rechazada',
  unableToApproveFollowRequest: 'No se puede aceptar la solicitud de seguimiento: {error}',
  unableToRejectFollowRequest: 'No se puede rechazar la solicitud de seguimiento: {error}',
  searchError: 'Error durante la búsqueda: {error}',
  hidDomain: 'Dominio oculto',
  unhidDomain: 'Dominio no oculto',
  unableToHideDomain: 'No se puede ocultar el dominio: {error}',
  unableToUnhideDomain: 'No se puede dejar de ocultar el dominio: {error}',
  showingReblogs: 'Mostrando reenvíos',
  hidingReblogs: 'Ocultando reenvíos',
  unableToShowReblogs: 'No se puede mostrar los reenvíos: {error}',
  unableToHideReblogs: 'No se puede ocultar los reenvíos: {error}',
  unableToShare: 'No se puede compartir: {error}',
  unableToSubscribe: 'Imposible suscribirse: {error}',
  unableToUnsubscribe: 'Imposible dejar de suscribirse: {error}',
  showingOfflineContent: 'La petición a internet falló. Mostrando contenido sin conexión.',
  youAreOffline: 'Parece que estás sin conexión. Puedes leer contenido incluso sin conexión.',
  // Snackbar UI
  updateAvailable: 'Actualización de la aplicación disponible.',
  // Word/phrase filters
  wordFilters: 'Filtros de palabras',
  noFilters: 'No tienes ningún filtro de palabras.',
  wordOrPhrase: 'Palabra o frase',
  contexts: 'Contextos',
  addFilter: 'Añadir filtro',
  editFilter: 'Editar filtro',
  filterHome: 'Inicio y listas',
  filterNotifications: 'Notificaciones',
  filterPublic: 'Cronologías públicas',
  filterThread: 'Conversaciones',
  filterAccount: 'Perfiles',
  filterUnknown: 'Desconocido',
  expireAfter: 'Expira al cabo de',
  whereToFilter: 'Dónde filtrar',
  irreversible: 'Irreversible',
  wholeWord: 'Palabra completa',
  save: 'Guardar',
  updatedFilter: 'Filtro actualizado',
  createdFilter: 'Filtro creado',
  failedToModifyFilter: 'Fallo al modificar el filtro: {error}',
  deletedFilter: 'Filtro borrado',
  required: 'Requerido',
  // Dialogs
  profileOptions: 'Opciones de perfil',
  copyLink: 'Copiar enlace',
  emoji: 'Emoji',
  editMedia: 'Editar multimedia',
  shortcutHelp: 'Ayuda sobre atajos de teclado',
  statusOptions: 'Opciones de estado',
  confirm: 'Confirmar',
  closeDialog: 'Cerrar diálogo',
  postPrivacy: 'Privacidad del post',
  homeOnInstance: 'Inicio en {instance}',
  statusesTimelineOnInstance: 'Estados: {timeline} cronología en {instance}',
  statusesHashtag: 'Estados: #{hashtag} hashtag',
  statusesThread: 'Estados: hilo',
  statusesAccountTimeline: 'Estado: cronología de cuenta',
  statusesList: 'Estado: lista',
  notificationsOnInstance: 'Notificaciones en {instance}',
  // Details
  statusEdited: 'Edited'
}
