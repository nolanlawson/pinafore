export default {
  // Home page, basic <title> and <description>
  appName: 'Pinafore',
  appDescription: 'Un client alternatif pour Mastodon, concentré sur la vitesse et la simplicité',
  homeDescription: `
    <p>
      Pinafore est un client web pour
      <a rel="noopener" target="_blank" href="https://joinmastodon.org">Mastodon</a>,
      dessiné pour la vitesse et la simplicité.
    </p>
    <p>
      Lire
      <a rel="noopener" target="_blank"
         href="https://nolanlawson.com/2018/04/09/introducing-pinafore-for-mastodon/">l'article introductoire (anglais)</a>,
      ou se connecter à une instance:
    </p>`,
  logIn: 'Se connecter',
  footer: `
    <p>
      Pinafore est
      <a rel="noopener" target="_blank" href="https://github.com/nolanlawson/pinafore">logiciel open-source</a>
      créé par
      <a rel="noopener" target="_blank" href="https://nolanlawson.com">Nolan Lawson</a>
      et distribué sous la
      <a rel="noopener" target="_blank"
         href="https://github.com/nolanlawson/pinafore/blob/master/LICENSE">License AGPL</a>.
      Lire la <a href="/settings/about#privacy-policy" rel="prefetch">politique de confidentialité</a>.
    </p>
  `,
  // Generic UI
  loading: 'Chargement en cours',
  okay: 'OK',
  cancel: 'Annuler',
  alert: 'Alerte',
  close: 'Fermer',
  error: 'Erreur: {error}',
  errorShort: 'Erreur:',
  // Relative timestamps
  justNow: 'il y a un moment',
  // Navigation, page titles
  navItemLabel: `
    {label} {selected, select,
      true {(page actuelle)}
      other {}
    } {name, select,
      notifications {{count, plural,
        =0 {}
        one {(1 notification)}
        other {({count} notifications)}
      }}
      community {{count, plural,
        =0 {}
        one {(1 demande de suivre)}
        other {({count} demandes de suivre)}
      }}
      other {}
    }
  `,
  blockedUsers: 'Utilisateurs bloqués',
  bookmarks: 'Signets',
  directMessages: 'Messages directs',
  favorites: 'Favoris',
  federated: 'Fédéré',
  home: 'Accueil',
  local: 'Local',
  notifications: 'Notifications',
  mutedUsers: 'Utilisateurs mis en sourdine',
  pinnedStatuses: 'Pouets épinglés',
  followRequests: 'Demandes de suivre',
  followRequestsLabel: `Demandes de suivre {hasFollowRequests, select,
    true {({count})}
    other {}
  }`,
  list: 'Liste',
  search: 'Recherche',
  pageHeader: 'Titre de page',
  goBack: 'Rentrer',
  back: 'Rentrer',
  profile: 'Profil',
  federatedTimeline: 'Historique fédéré',
  localTimeline: 'Historique local',
  // community page
  community: 'Communauté',
  pinnableTimelines: 'Historiques épinglables',
  timelines: 'Historiques',
  lists: 'Listes',
  instanceSettings: "Paramètres d'instance",
  notificationMentions: 'Notifications de mention',
  profileWithMedia: 'Profil avec medias',
  profileWithReplies: 'Profil avec réponses',
  hashtag: 'Mot-dièse',
  // not logged in
  profileNotLoggedIn: "Un historique d'utilisateur s'apparêtra ici quand on est conncté.",
  bookmarksNotLoggedIn: "Vos signets s'apparêtront ici quand on est conncté.",
  directMessagesNotLoggedIn: "Vos messages directes s'apparêtront ici quand on est conncté.",
  favoritesNotLoggedIn: "Vos favoris s'apparêtront ici quand on est conncté.",
  federatedTimelineNotLoggedIn: "L'historique fédéré s'apparêtra ici quand on est conncté.",
  localTimelineNotLoggedIn: "L'historique local s'apparêtra ici quand on est conncté.",
  searchNotLoggedIn: "On peut rechercher dès qu'on est conncté.",
  communityNotLoggedIn: "Les paramètres de commnautés s'apparêtront ici quand on est conncté.",
  listNotLoggedIn: "Une liste s'apparêtra ici dès qu'on est conncté.",
  notificationsNotLoggedIn: "Vos notifications s'apparêtront ici quand on est conncté.",
  notificationMentionsNotLoggedIn: "Vos notifications de mention s'apparêtront ici quand on est conncté.",
  statusNotLoggedIn: "Un historique de pouet s'apparêtra ici quand on est conncté.",
  tagNotLoggedIn: "Un historique de mot-dièse s'apparêtra ici quand on est conncté.",
  // Notification subpages
  filters: 'Filtres',
  all: 'Tous',
  mentions: 'Mentions',
  // Follow requests
  approve: 'Accepter',
  reject: 'Rejeter',
  // Hotkeys
  hotkeys: 'Raccourcis clavier',
  global: 'Global',
  timeline: 'Historique',
  media: 'Medias',
  globalHotkeys: `
    {leftRightChangesFocus, select,
      true {
        <li><kbd>→</kbd> pour changer de focus à l'élément suivant</li>
        <li><kbd>←</kbd> pour changer de focus à l'élément précédent</li>
      }
      other {}
    }
    <li>
      <kbd>1</kbd> - <kbd>6</kbd>
      {leftRightChangesFocus, select,
        true {}
        other {ou <kbd>←</kbd>/<kbd>→</kbd>}
      }
      pour changer de pages
    </li>
    <li><kbd>7</kbd> or <kbd>c</kbd> pour écrire un nouveau pouet</li>
    <li><kbd>s</kbd> or <kbd>/</kbd> pour rechercher</li>
    <li><kbd>g</kbd> + <kbd>h</kbd> pour renter à l'acceuil</li>
    <li><kbd>g</kbd> + <kbd>n</kbd> pour voir les notifications</li>
    <li><kbd>g</kbd> + <kbd>l</kbd> pour voir l'historique local</li>
    <li><kbd>g</kbd> + <kbd>t</kbd> pour voir l'historique fédéré</li>
    <li><kbd>g</kbd> + <kbd>c</kbd> pour voir les paramètres de communauté</li>
    <li><kbd>g</kbd> + <kbd>d</kbd> pour voir les messages directs</li>
    <li><kbd>h</kbd> ou <kbd>?</kbd> pour voir les raccourcis clavier</li>
    <li><kbd>Retour arrière</kbd> pour rentrer à la page précédente, ou fermer une boite de dialogue</li>
  `,
  timelineHotkeys: `
    <li><kbd>j</kbd> ou <kbd>↓</kbd> pour activer le pouet suivant</li>
    <li><kbd>k</kbd> ou <kbd>↑</kbd> pour activer le pouet précedent</li>
    <li><kbd>.</kbd> pour afficher les nouveaus messages et renter en haut</li>
    <li><kbd>o</kbd> pour ouvrir</li>
    <li><kbd>f</kbd> pour ajouter aux favoris</li>
    <li><kbd>b</kbd> pour partager</li>
    <li><kbd>r</kbd> pour répondre</li>
    <li><kbd>i</kbd> pour voir une image, vidéo, ou audio</li>
    <li><kbd>y</kbd> pour afficher ou cacher une image sensible</li>
    <li><kbd>m</kbd> pour mentionner l'auteur</li>
    <li><kbd>p</kbd> pour voir le profile de l'auteur</li>
    <li><kbd>l</kbd> pour ouvrir un lien de carte dans un nouvel onglet</li>
    <li><kbd>x</kbd> pour afficher ou cacher le texte caché derrière une avertissement</li>
  `,
  mediaHotkeys: `
    <li><kbd>←</kbd> / <kbd>→</kbd> pour voir la prochaine ou dernière image</li>
  `,
  // Community page, tabs
  tabLabel: `{label} {current, select,
    true {(Actuel)}
    other {}
  }`,
  pageTitle: `
    {hasNotifications, select,
      true {({count})}
      other {}
    }
    {showInstanceName, select,
      true {{instanceName}}
      other {Pinafore}
    }
    ·
    {name}
  `,
  pinLabel: `{label} {pinnable, select,
    true {
      {pinned, select,
        true {(Page épinglée)}
        other {(Page non-épinglée)}
      }
    }
    other {}
  }`,
  pinPage: 'Epingler {label}',
  // Status composition
  overLimit: '{count} {count, plural, =1 {caractère} other {caractères}} en dessus de la limite',
  underLimit: '{count} {count, plural, =1 {caractère} other {caractères}} qui reste',
  composeStatus: 'Ecrire un pouet',
  postStatus: 'Pouet!',
  contentWarning: 'Avertissement',
  dropToUpload: 'Déposer',
  invalidFileType: "Impossible d'uploader ce type de fichier",
  composeLabel: "Qu'avez vous en tête?",
  autocompleteDescription: 'Quand les résultats sont dispibles, appuyez la fleche vers le haut ou vers le bas pour selectionner.',
  mediaUploads: 'Medias uploadés',
  edit: 'Rediger',
  delete: 'Supprimer',
  description: 'Déscription',
  descriptionLabel: 'Décrire pour les aveugles (image, video) ou les sourds (audio, video)',
  markAsSensitive: 'Désigner comme sensible',
  // Polls
  createPoll: 'Créer une enquête',
  removePollChoice: 'Supprimer la choix {index}',
  pollChoiceLabel: 'Choix {index}',
  multipleChoice: 'Choix multiple',
  pollDuration: "Duration de l'enquête",
  fiveMinutes: '5 minutes',
  thirtyMinutes: '30 minutes',
  oneHour: '1 heure',
  sixHours: '6 heures',
  oneDay: '1 jour',
  threeDays: '3 jours',
  sevenDays: '7 jours',
  addEmoji: 'Insérer un emoji',
  addMedia: 'Ajouter un media (images, vidéos, audios)',
  addPoll: 'Ajouter une enquête',
  removePoll: "Enlever l'enquête",
  postPrivacyLabel: 'Changer de confidentialité (actuellement {label})',
  addContentWarning: 'Ajouter une avertissement',
  removeContentWarning: "Enlever l'avertissement",
  altLabel: 'Décrire pour les aveugles ou les sourds',
  extractText: "Extraire le texte de l'image",
  extractingText: 'Extraction de texte en cours…',
  extractingTextCompletion: 'Extraction de texte en cours ({percent}% finit)…',
  unableToExtractText: "Impossible d'extraire le texte.",
  // Account options
  followAccount: 'Suivre {account}',
  unfollowAccount: 'Ne plus suivre {account}',
  blockAccount: 'Bloquer {account}',
  unblockAccount: 'Ne plus bloquer {account}',
  muteAccount: 'Mettre {account} en sourdine',
  unmuteAccount: 'Ne plus mettre {account} en sourdine',
  showReblogsFromAccount: 'Afficher les partages de {account}',
  hideReblogsFromAccount: 'Ne plus afficher les partages de {account}',
  showDomain: 'Ne plus cacher {domain}',
  hideDomain: 'Cacher {domain}',
  reportAccount: 'Signaler {account}',
  mentionAccount: 'Mentionner {account}',
  copyLinkToAccount: 'Copier un lien vers ce compte',
  copiedToClipboard: 'Copié vers le presse-papiers',
  // Media dialog
  navigateMedia: 'Changer de medias',
  showPreviousMedia: 'Afficher le media précédent',
  showNextMedia: 'Afficher le media suivant',
  enterPinchZoom: 'Pincer pour zoomer',
  exitPinchZoom: 'Ne plus pincer pour zoomer',
  showMedia: `Afficher le {index, select,
    1 {premier}
    2 {deuxième}
    3 {troisième}
    other {quatrième}
  } média {current, select,
    true {(actuel)}
    other {}
  }`,
  previewFocalPoint: 'Aperçu (point de mire)',
  enterFocalPoint: 'Saisir le point de mire (X, Y) pour ce média',
  muteNotifications: 'Mettre aussi bien les notifications en sourdine',
  muteAccountConfirm: 'Mettre {account} en sourdine?',
  mute: 'Mettre en sourdine',
  unmute: 'Ne plus mettre en sourdine',
  zoomOut: 'Dé-zoomer',
  zoomIn: 'Zoomer',
  // Reporting
  reportingLabel: 'Vous signalez {account} aux modérateurs/modératrices de {instance}.',
  additionalComments: 'Commentaires additionels',
  forwardDescription: 'Faire parvenir aux modérateurs/modératrices de {instance} aussi?',
  forwardLabel: 'Fair pervenir à {instance}',
  unableToLoadStatuses: 'Impossible de charger les pouets récents: {error}',
  report: 'Signaler',
  noContent: '(Pas de contenu)',
  noStatuses: 'Aucun pouet à signaler',
  // Status options
  unpinFromProfile: 'Ne plus épingler sur son profil',
  pinToProfile: 'Epingler sur son profil',
  muteConversation: 'Mettre en sourdine la conversation',
  unmuteConversation: 'Ne plus mettre en sourdine la conversation',
  bookmarkStatus: 'Ajouter aux signets',
  unbookmarkStatus: 'Enlever des signets',
  deleteAndRedraft: 'Supprimer et rediger',
  reportStatus: 'Signaler ce pouet',
  shareStatus: 'Partager ce pouet externellement',
  copyLinkToStatus: 'Copier un lien vers ce pouet',
  // Account profile
  profileForAccount: 'Profil pour {account}',
  statisticsAndMoreOptions: "Statistiques et plus d'options",
  statuses: 'Pouets',
  follows: 'Suis',
  followers: 'Suivants',
  moreOptions: "Plus d'options",
  followersLabel: 'Suivi(e) par {count}',
  followingLabel: 'Suis {count}',
  followLabel: `Suivre {requested, select,
    true {(suivre demandé)}
    other {}
  }`,
  unfollowLabel: `Ne plus suivre {requested, select,
    true {(suivre demandé)}
    other {}
  }`,
  unblock: 'Ne plus bloquer',
  nameAndFollowing: 'Nom et suivants',
  clickToSeeAvatar: "Cliquer pour voir l'image de profile",
  opensInNewWindow: '{label} (ouvrir dans un nouvel onglet)',
  blocked: 'Bloquer',
  domainHidden: 'Domaine bloqué',
  muted: 'Mis en sourdine',
  followsYou: 'Suivant',
  avatarForAccount: 'Image de profil pour {account}',
  fields: 'Champs',
  accountHasMoved: '{account} a déménagé',
  profilePageForAccount: 'Page de profil pour {account}',
  // About page
  about: 'Infos',
  aboutApp: 'Infos sur Pinafore',
  aboutAppDescription: `
  <p>
    Pinafore est un logiciel
    <a rel="noopener" target="_blank"
       href="https://github.com/nolanlawson/pinafore">gratuit et open-source</a>
    créé par
    <a rel="noopener" target="_blank" href="https://nolanlawson.com">Nolan Lawson</a>
    et distribué sous le
    <a rel="noopener" target="_blank"
       href="https://github.com/nolanlawson/pinafore/blob/master/LICENSE">License GNU Affero General Public (AGPL)</a>.
  </p>

  <h2 id="privacy-policy">Politique de confidentialité</h2>

  <p>
    Pinafore ne garde pas d'informations personelles dans ses serveurs,
    y compris les noms, addresses courriel, addresses IP, messages, et photos.
  </p>

  <p>
    Pinafore est un site statique. Tous données sont gardées en locale dans le navigateur, et sont partagée qu'avec
    les instances auxquelles vous vous connectez.
  </p>

  <h2>Crédits</h2>

  <p>
    Icônes par <a rel="noopener" target="_blank" href="http://fontawesome.io/">Font Awesome</a>.
  </p>

  <p>
    Logo grâce à Gregor Cresnar du
    <a rel="noopener" target="_blank" href="https://thenounproject.com/">Noun Project</a>.
  </p>`,
  // Settings
  settings: 'Paramètres',
  general: 'Général',
  generalSettings: 'Paramètres générales',
  showSensitive: 'Afficher les medias sensible par défaut',
  showPlain: 'Afficher un simple gris pour les medias sensibles',
  allSensitive: 'Considérer tous medias comme sensible',
  largeMedia: 'Afficher de plus grands images et vidéos',
  autoplayGifs: 'Repasser automatiquement les GIFs animés',
  hideCards: 'Cacher les liens «cartes»',
  underlineLinks: 'Souligner les liens dans les pouets et profils',
  accessibility: 'Accessibilité',
  reduceMotion: 'Reduire la motions dans les animations',
  disableTappable: "Désactiver l'espace touchable sur un pouet entier",
  removeEmoji: "Enlever les emojis des noms d'utilisateur",
  shortAria: 'Utiliser des etiquettes courtes ARIA',
  theme: 'Thème',
  themeForInstance: 'Theème pour {instance}',
  disableCustomScrollbars: 'Désactiver les scrollbars customisés',
  preferences: 'Préférences',
  hotkeySettings: 'Paramètres de raccourcis clavier',
  disableHotkeys: 'Désactiver les raccourcis clavier',
  leftRightArrows: 'Les flèches gauche/droit change de focus plutôt que les pages',
  guide: 'Guide',
  reload: 'Recharger',
  // Wellness settings
  wellness: 'Bien-être',
  wellnessSettings: 'Paramètres de bien-être',
  wellnessDescription: `Les paramètres de bien-être sont dessinées pour rédruire les effets accrochants ou d'anxiété des réseaux sociaux.
    Veuillez choisir les options qui marchent pour vous.`,
  enableAll: 'Activer tous',
  metrics: 'Métrics',
  hideFollowerCount: 'Cacher le nombre de suivants (10 maximum)',
  hideReblogCount: 'Cacher le nombre de partages',
  hideFavoriteCount: 'Cacher le nombre de favoris',
  hideUnread: "Cacher le nombre de notifications (c'est-à-dire le point rouge)",
  ui: 'Interface Utilisateur',
  grayscaleMode: 'Mode echelle de gris',
  wellnessFooter: `Ces paramètres sont basé sur les recommendations du
    <a rel="noopener" target="_blank" href="https://humanetech.com">Center for Humane Technology</a>.`,
  // This is a link: "You can filter or disable notifications in the _instance settings_"
  filterNotificationsPre: 'Vous pouvez filtrer ou désactiver les notifications dans les',
  filterNotificationsText: "paramètres d'instance",
  filterNotificationsPost: '',
  // Custom tooltips, like "Disable _infinite scroll_", where you can click _infinite scroll_
  // to see a description. It's hard to properly internationalize, so we just break up the strings.
  disableInfiniteScrollPre: 'Désactiver le',
  disableInfiniteScrollText: 'défilage infini',
  disableInfiniteScrollDescription: `Quand le défilage infini est désactivé, les pouets nouveau ne
             s'apparêtront pas automatique au haut ou au bas de l'historique. Plutôt, il y aura des boutons pour
             charger sur demande.`,
  disableInfiniteScrollPost: '',
  // Instance settings
  loggedInAs: 'Connecté en tant que',
  homeTimelineFilters: "Filtres d'historique de l'acceuil",
  notificationFilters: 'Filtres de notifications',
  pushNotifications: 'Filtres de notifications push',
  // Add instance page
  storageError: `Il semble que Pinafore ne peut pas stocker les données en locale. Est-ce que votre navigateur
          est en mode privé, ou est-ce qu'il bloque les cookies? Pinafore garde tous ses données en locale et
          ne peut pas fonctionner sans LocalStorage ou IndexedDB.`,
  javaScriptError: 'Le JavaScript devrait être activé pour continuer.',
  enterInstanceName: "Saisir le nom d'instance",
  instanceColon: 'Instance:',
  // Custom tooltip, concatenated together
  getAnInstancePre: "N'avez-vous pas d'",
  getAnInstanceText: 'instance',
  getAnInstanceDescription: 'Une instance est votre serveur Mastodon, par exemple mastodon.social ou cybre.space.',
  getAnInstancePost: '?',
  joinMastodon: 'Joignez-vous à Mastodon!',
  instancesYouveLoggedInTo: 'Instances conntectées:',
  addAnotherInstance: 'Ajouter une nouvelle instance',
  youreNotLoggedIn: 'Vous êtes connecté(e) à aucune instance.',
  currentInstanceLabel: `{instance} {current, select,
    true {(instance actuelle)}
    other {}
  }`,
  // Link text
  logInToAnInstancePre: '',
  logInToAnInstanceText: 'Se connecter à une instance',
  logInToAnInstancePost: 'pour utiliser Pinafore.',
  // Another custom tooltip
  showRingPre: 'Afficher toujours',
  showRingText: "l'anneau de focus",
  showRingDescription: `L'anneau de focus est le contour qui indique l'élément en focus actuel. Par défaut, ce n'est
    affiché que quand on utilise le clavier (et ne pas la souris ou l'écran touche), mais vous pouvez choisr de
    l'afficher toujours.`,
  showRingPost: '',
  instances: 'Les instances',
  addInstance: 'Ajouter une instance',
  homeTimelineFilterSettings: "Paramètres de filtre d'historique",
  switchOrLogOut: 'Changer ou se déconnecter de cette instance',
  switchTo: "Changer d'instance à celle-ci",
  switchToInstance: "Changer d'instance",
  switchToNameOfInstance: "Faire {instance} l'instance actuelle",
  logOut: 'Se déconnecter',
  logOutOfInstanceConfirm: 'Déconnectez-vous de {instance}?',
  notificationFilterSettings: 'Paramètres de filtre de notifications',
  // Push notifications
  browserDoesNotSupportPush: 'Votre navigateur ne soutient pas les notifications push.',
  deniedPush: 'Vous avez désactivé les notifications push.',
  pushNotificationsNote: 'Veuillez noter que les notifications push ne peuvent être activées que pour une instance à la fois.',
  pushSettings: 'Paramètres de notifications push',
  newFollowers: 'Suivants nouveaux',
  reblogs: 'Partages',
  pollResults: "Résultats d'enquête",
  needToReauthenticate: 'Vous devez ré-authentiquer pour activer les notifications push. Déconnectez-vous de {instance}?',
  failedToUpdatePush: 'Impossible de mettre à jour les paramètres de notifications push: {error}',
  // Themes
  chooseTheme: 'Choisir une thème',
  darkBackground: 'Sombre',
  lightBackground: 'Clair',
  themeLabel: `{label} {default, select,
    true {(défaut)}
    other {}
  }`,
  animatedImage: 'Image animée: {description}',
  showImage: `Afficher l'image {animated, select,
    true {animée}
    other {}
  }: {description}`,
  playVideoOrAudio: `Repasser {audio, select,
    true {l'audio}
    other {la vidéo}
  }: {description}`,
  accountFollowedYou: '{name} vous a suivi(e), {account}',
  reblogCountsHidden: 'Nombre de partages caché',
  favoriteCountsHidden: 'nombre de mises en favori caché',
  rebloggedTimes: `Partagé {count, plural,
    one {une fois}
    other {{count} fois}
  }`,
  favoritedTimes: `Mis en favori {count, plural,
    one {une fois}
    other {{count} fois}
  }`,
  pinnedStatus: 'Pouet épinglé',
  rebloggedYou: 'a partagé votre pouet',
  favoritedYou: 'a mis en favori votre pouet',
  followedYou: 'followed you',
  pollYouCreatedEnded: 'Une enquête vous avez créée a terminée',
  pollYouVotedEnded: 'Une enquête dans laquelle vous avez voté a terminée',
  reblogged: 'partagé',
  showSensitiveMedia: 'Afficher la média sensible',
  hideSensitiveMedia: 'Cacher la média sensible',
  clickToShowSensitive: 'Image sensible. Cliquer pour afficher.',
  longPost: 'Pouet long',
  // Accessible status labels
  accountRebloggedYou: '{account} a partagé votre pouet',
  accountFavoritedYou: '{account} a mis votre pouet en favori',
  rebloggedByAccount: 'Partagé par {account}',
  contentWarningContent: 'Avertissement: {spoiler}',
  hasMedia: 'média',
  hasPoll: 'enquête',
  shortStatusLabel: 'Pouet {privacy} par {account}',
  // Privacy types
  public: 'Public',
  unlisted: 'Unlisted',
  followersOnly: 'Followers-only',
  direct: 'Direct',
  // Themes
  themeRoyal: 'Royal',
  themeScarlet: 'Scarlet',
  themeSeafoam: 'Seafoam',
  themeHotpants: 'Hotpants',
  themeOaken: 'Oaken',
  themeMajesty: 'Majesty',
  themeGecko: 'Gecko',
  themeGrayscale: 'Grayscale',
  themeOzark: 'Ozark',
  themeCobalt: 'Cobalt',
  themeSorcery: 'Sorcery',
  themePunk: 'Punk',
  themeRiot: 'Riot',
  themeHacker: 'Hacker',
  themeMastodon: 'Mastodon',
  themePitchBlack: 'Pitch Black',
  themeDarkGrayscale: 'Dark Grayscale',
  // Polls
  voteOnPoll: 'Vote on poll',
  pollChoices: 'Poll choices',
  vote: 'Vote',
  pollDetails: 'Poll details',
  refresh: 'Refresh',
  expires: 'Ends',
  expired: 'Ended',
  voteCount: `{count, plural,
    one {1 vote}
    other {{count} votes}
  }`,
  // Status interactions
  clickToShowThread: '{time} - click to show thread',
  showMore: 'Show more',
  showLess: 'Show less',
  closeReply: 'Close reply',
  cannotReblogFollowersOnly: 'Cannot be boosted because this is followers-only',
  cannotReblogDirectMessage: 'Cannot be boosted because this is a direct message',
  reblog: 'Boost',
  reply: 'Reply',
  replyToThread: 'Reply to thread',
  favorite: 'Favorite',
  unfavorite: 'Unfavorite',
  // timeline
  loadingMore: 'Loading more…',
  loadMore: 'Load more',
  showCountMore: 'Show {count} more',
  nothingToShow: 'Nothing to show.',
  // status thread page
  statusThreadPage: 'Toot thread page',
  status: 'Toot',
  // toast messages
  blockedAccount: 'Blocked account',
  unblockedAccount: 'Unblocked account',
  unableToBlock: 'Unable to block account: {error}',
  unableToUnblock: 'Unable to unblock account: {error}',
  bookmarkedStatus: 'Bookmarked toot',
  unbookmarkedStatus: 'Unbookmarked toot',
  unableToBookmark: 'Unable to bookmark: {error}',
  unableToUnbookmark: 'Unable to unbookmark: {error}',
  cannotPostOffline: 'You cannot post while offline',
  unableToPost: 'Unable to post toot: {error}',
  statusDeleted: 'Toot deleted',
  unableToDelete: 'Unable to delete toot: {error}',
  cannotFavoriteOffline: 'You cannot favorite while offline',
  cannotUnfavoriteOffline: 'You cannot unfavorite while offline',
  unableToFavorite: 'Unable to favorite: {error}',
  unableToUnfavorite: 'Unable to unfavorite: {error}',
  followedAccount: 'Followed account',
  unfollowedAccount: 'Unfollowed account',
  unableToFollow: 'Unable to follow account: {error}',
  unableToUnfollow: 'Unable to unfollow account: {error}',
  accessTokenRevoked: 'The access token was revoked, logged out of {instance}',
  loggedOutOfInstance: 'Logged out of {instance}',
  failedToUploadMedia: 'Failed to upload media: {error}',
  mutedAccount: 'Muted account',
  unmutedAccount: 'Unmuted account',
  unableToMute: 'Unable to mute account: {error}',
  unableToUnmute: 'Unable to unmute account: {error}',
  mutedConversation: 'Muted conversation',
  unmutedConversation: 'Unmuted conversation',
  unableToMuteConversation: 'Unable to mute conversation: {error}',
  unableToUnmuteConversation: 'Unable to unmute conversation: {error}',
  unpinnedStatus: 'Unpinned toot',
  unableToPinStatus: 'Unable to pin toot: {error}',
  unableToUnpinStatus: 'Unable to unpin toot: {error}',
  unableToRefreshPoll: 'Unable to refresh poll: {error}',
  unableToVoteInPoll: 'Unable to vote in poll: {error}',
  cannotReblogOffline: 'You cannot boost while offline.',
  cannotUnreblogOffline: 'You cannot unboost while offline.',
  failedToReblog: 'Failed to boost: {error}',
  failedToUnreblog: 'Failed to unboost: {error}',
  submittedReport: 'Submitted report',
  failedToReport: 'Failed to report: {error}',
  approvedFollowRequest: 'Approved follow request',
  rejectedFollowRequest: 'Rejected follow request',
  unableToApproveFollowRequest: 'Unable to approve follow request: {error}',
  unableToRejectFollowRequest: 'Unable to reject follow request: {error}',
  searchError: 'Error during search: {error}',
  hidDomain: 'Hid domain',
  unhidDomain: 'Unhid domain',
  unableToHideDomain: 'Unable to hide domain: {error}',
  unableToUnhideDomain: 'Unable to unhide domain: {error}',
  showingReblogs: 'Showing boosts',
  hidingReblogs: 'Hiding boosts',
  unableToShowReblogs: 'Unable to show boosts: {error}',
  unableToHideReblogs: 'Unable to hide boosts: {error}',
  unableToShare: 'Unable to share: {error}',
  showingOfflineContent: 'Internet request failed. Showing offline content.',
  youAreOffline: 'You seem to be offline. You can still read toots while offline.',
  // Snackbar UI
  updateAvailable: 'App update available.'
}
