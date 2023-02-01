export default {
  // Home page, basic <title> and <description>
  appName: 'Semaphore',
  appDescription: 'Ein alternativer Web Client für Mastodon, der auf Geschwindigkeit und einfache Bedienung ausgelegt ist.',
  homeDescription: `
    <p>
      Semaphore ist ein Web Client für
      <a rel="noopener" target="_blank" href="https://joinmastodon.org">Mastodon</a>,
      der für Geschwindigkeit und einfache Bedienung konzipiert wurde.
    </p>
    <p>
      Dich bei einer Instanz anmeldest:
    </p>`,
  logIn: 'Anmelden',
  footer: `
    <p>
      Semaphore ist
      <a rel="noopener" target="_blank" href="https://github.com/NickColley/semaphore">quelloffene Software</a>,
      gepflegt von <a rel="noopener" target="_blank" href="https://nickcolley.co.uk">Nick Colley</a>
      und verteilt unter der
      <a rel="noopener" target="_blank"
         href="https://github.com/NickColley/semaphore/blob/main/LICENSE">AGPL Lizenz</a>.
      Hier ist die <a href="/settings/about#privacy-policy" rel="prefetch">Datenschutzerklärung</a>.
      Es ist eine Fortsetzung des Pinafore-Projekts von <a rel="noopener" target="_blank" href="https://nolanlawson.com">Nolan Lawson</a>.
    </p>
  `,
  // Generic UI
  loading: 'Wird geladen',
  okay: 'OK',
  cancel: 'Abbrechen',
  alert: 'Hinweis',
  close: 'Schließen',
  error: 'Fehler: {error}',
  errorShort: 'Fehler:',
  // Relative timestamps
  justNow: 'gerade eben',
  // Navigation, page titles
  navItemLabel: `
    {label} {selected, select,
      true {(aktuelle Seite)}
      other {}
    } {name, select,
      notifications {{count, plural,
        =0 {}
        one {(eine Benachrichtigung)}
        other {({count} Benachrichtigungen)}
      }}
      community {{count, plural,
        =0 {}
        one {(eine Followeranfrage)}
        other {({count} Followeranfragen)}
      }}
      other {}
    }
  `,
  blockedUsers: 'Blockierte Benutzer',
  bookmarks: 'Lesezeichen',
  directMessages: 'Direktnachrichten',
  favorites: 'Favoriten',
  federated: 'Föderiert',
  home: 'Startseite',
  local: 'Lokal',
  notifications: 'Benachrichtigungen',
  mutedUsers: 'Stummgeschaltete Benutzer',
  pinnedStatuses: 'Angeheftete Tröts',
  followRequests: 'Followeranfragen',
  followRequestsLabel: `Followeranfragen {hasFollowRequests, select,
    true {({count})}
    other {}
  }`,
  list: 'Liste',
  search: 'Suchen',
  pageHeader: 'Seitenkopf',
  goBack: 'Zurückgehen',
  back: 'Zurück',
  profile: 'Profil',
  federatedTimeline: 'Föderierte Zeitleiste',
  localTimeline: 'Lokale Zeitleiste',
  // community page
  community: 'Community',
  pinnableTimelines: 'Zeitleisten, die angeheftet werden können',
  timelines: 'Zeitleisten',
  lists: 'Listen',
  instanceSettings: 'Einstellungen der Instanz',
  notificationMentions: 'Benachrichtigungen über Erwähnungen',
  profileWithMedia: 'Profil mit Medien',
  profileWithReplies: 'Profil mit Antworten',
  hashtag: 'Hashtag',
  // not logged in
  profileNotLoggedIn: 'Hier erscheint Deine Benutzerzeitleiste, wenn Du Dich anmeldest.',
  bookmarksNotLoggedIn: 'Hier erscheinen Deine Lesezeichen, wenn Du Dich anmeldest.',
  directMessagesNotLoggedIn: 'Hier erscheinen Deine Direktnachrichten, wenn Du Dich anmeldest.',
  favoritesNotLoggedIn: 'Hier erscheinen Deine Favoriten, wenn Du Dich anmeldest.',
  federatedTimelineNotLoggedIn: 'Hier erscheint Deine föderierte Zeitleiste, wenn Du Dich anmeldest.',
  localTimelineNotLoggedIn: 'Hier erscheint Deine lokale Zeitleiste, wenn Du Dich anmeldest.',
  searchNotLoggedIn: 'Du kannst eine Suche ausführen, sobald Du bei einer Instanz angemeldet bist.',
  communityNotLoggedIn: 'Hier erscheinen Community-Optionen, wenn Du Dich anmeldest.',
  listNotLoggedIn: 'Hier erscheint eine Liste, wenn Du Dich anmeldest.',
  notificationsNotLoggedIn: 'Hier erscheinen Deine Benachrichtigungen, wenn Du Dich anmeldest.',
  notificationMentionsNotLoggedIn: 'Hier erscheinen Deine Benachrichtigungen zu Erwähnungen, wenn Du Dich anmeldest.',
  statusNotLoggedIn: 'Hier erscheint der Faden zu einem Tröt, wenn Du Dich anmeldest.',
  tagNotLoggedIn: 'Hier erscheinen Tröts zu einem hashtag, wenn Du Dich anmeldest.',
  // Notification subpages
  filters: 'Filter',
  all: 'Alle',
  mentions: 'Erwähnungen',
  // Follow requests
  approve: 'Genehmigen',
  reject: 'Ablehnen',
  // Hotkeys
  hotkeys: 'Tastenkürzel',
  global: 'Global',
  timeline: 'Zeitleiste',
  media: 'Medien',
  globalHotkeys: `
    {leftRightChangesFocus, select,
      true {
        <li><kbd>→</kbd> gehe zum nächsten fokussierbaren Element</li>
        <li><kbd>←</kbd> gehe zum vorherigen fokussierbaren Element</li>
      }
      other {}
    }
    <li>
      <kbd>1</kbd> - <kbd>6</kbd>
      {leftRightChangesFocus, select,
        true {}
        other {oder <kbd>←</kbd>/<kbd>→</kbd>}
      }
      um die Spalten umzuschalten
    </li>
    <li><kbd>7</kbd> oder <kbd>c</kbd> zum Erstellen eines neuen Tröts</li>
    <li><kbd>s</kbd> oder <kbd>/</kbd> zum Suchen</li>
    <li><kbd>g</kbd> + <kbd>h</kbd> zur Startseite gehen</li>
    <li><kbd>g</kbd> + <kbd>n</kbd> zu den Benachrichtigungen gehen</li>
    <li><kbd>g</kbd> + <kbd>l</kbd> zur lokalen zeitleiste gehen</li>
    <li><kbd>g</kbd> + <kbd>t</kbd> zur föderierten Zeitleiste gehen</li>
    <li><kbd>g</kbd> + <kbd>c</kbd> zur Community-Seite gehen</li>
    <li><kbd>g</kbd> + <kbd>d</kbd> zur Seite mit Direktnachrichten gehen</li>
    <li><kbd>h</kbd> oder <kbd>?</kbd> zum Umschalten des Hilfe-Dialogs</li>
    <li><kbd>Rückschritttaste</kbd> zurückgehen, Dialogfelder schließen</li>
  `,
  timelineHotkeys: `
    <li><kbd>j</kbd> oder <kbd>↓</kbd> nächsten Tröt ansteuern</li>
    <li><kbd>k</kbd> oder <kbd>↑</kbd> den vorherigen Tröt ansteuern</li>
    <li><kbd>.</kbd> neue Tröts anzeigen und nach oben scrollen</li>
    <li><kbd>o</kbd> Tröt öffnen</li>
    <li><kbd>f</kbd> Tröt favorisieren</li>
    <li><kbd>b</kbd> Tröt boosten</li>
    <li><kbd>r</kbd> auf Tröt antworten</li>
    <li><kbd>i</kbd> Bilder, Videos oder Audio öffnen</li>
    <li><kbd>y</kbd> sensible Medieninhalte zeigen oder verbergen</li>
    <li><kbd>m</kbd> den Verfasser erwähnen</li>
    <li><kbd>p</kbd> das Profil des Verfassers öffnen</li>
    <li><kbd>l</kbd> den Link des aktuellen Tröts in einem neuen Tab öffnen</li>
    <li><kbd>x</kbd> den Text hinter der Inhaltswarnung anzeigen oder verbergen</li>
    <li><kbd>z</kbd> den Text hinter der Inhaltswarnung für alle in dieser Unterhaltung anzeigen oder verbergen</li>
  `,
  mediaHotkeys: `
    <li><kbd>←</kbd> / <kbd>→</kbd> zum nächsten oder vorherigen Inhalt gehen</li>
  `,
  // Community page, tabs
  tabLabel: `{label} {current, select,
    true {(Aktuell)}
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
        true {(Angeheftete Seite)}
        other {(Nicht angeheftete Seite)}
      }
    }
    other {}
  }`,
  pinPage: 'Hefte {label} an',
  // Status composition
  composeStatus: 'Tröt erstellen',
  postStatus: 'Tröt!',
  contentWarning: 'Inhaltswarnung',
  dropToUpload: 'Fallenlassen zum Hochladen',
  invalidFileType: 'Ungültiger Dateityp',
  composeLabel: "Was gibt's Neues?",
  autocompleteDescription: 'Autovervollständigungsergebnisse verfügbar. Drücke die Pfeiltasten auf und ab und dann Eingabe zum Auswählen.',
  mediaUploads: 'Medien-Uploads',
  edit: 'Bearbeiten',
  delete: 'Löschen',
  description: 'Beschreibung',
  descriptionLabel: 'Beschreibe Bilder oder Videos für Menschen mit Seheinschränkungen, oder Audio- oder Videoinhalte für Menschen mit Höreinschränkungen',
  markAsSensitive: 'Medien als sensibel kennzeichnen',
  // Polls
  createPoll: 'Umfrage erstellen',
  removePollChoice: 'Auswahl {index} entfernen',
  pollChoiceLabel: 'Auswahl {index}',
  multipleChoice: 'Mehrfachauswahl',
  pollDuration: 'Dauer der Umfrage',
  fiveMinutes: '5 Minuten',
  thirtyMinutes: '30 Minuten',
  oneHour: '1 Stunde',
  sixHours: '6 Stunden',
  oneDay: '1 Tag',
  threeDays: '3 Tage',
  sevenDays: '7 Tage',
  addEmoji: 'Emoji einfügen',
  addMedia: 'Medien einfügen (Bilder, video, audio)',
  addPoll: 'Umfrage hinzufügen',
  removePoll: 'Umfrage entfernen',
  postPrivacyLabel: 'Privatsphäre anpassen (aktuell {label})',
  addContentWarning: 'Inhaltswarnung hinzufügen',
  removeContentWarning: 'Inhaltswarnung entfernen',
  altLabel: 'Beschreibe für Menschen mit Seheinschränkungen',
  extractText: 'Text aus Bild ermitteln',
  extractingText: 'Erkenne Text',
  extractingTextCompletion: 'Erkenne Text ({percent}% abgeschlossen)…',
  unableToExtractText: 'Es konnte kein Text erkannt werden.',
  // Account options
  followAccount: 'Folge {account}',
  unfollowAccount: 'Entfolge {account}',
  blockAccount: 'Blockiere {account}',
  unblockAccount: 'Blockieren von {account} aufheben',
  muteAccount: 'Schalte {account} stumm',
  unmuteAccount: 'Hebe Stummschaltung von {account} auf',
  showReblogsFromAccount: 'Boosts von {account} anzeigen',
  hideReblogsFromAccount: 'Boosts von {account} verbergen',
  showDomain: 'Verbergen von {domain} aufheben',
  hideDomain: 'Verbirg {domain}',
  reportAccount: 'Melde {account}',
  mentionAccount: 'Erwähne {account}',
  copyLinkToAccount: 'Kopiere Link zu account',
  copiedToClipboard: 'In Zwischenablage kopiert',
  // Media dialog
  navigateMedia: 'Durch Medieninhalte navigieren',
  showPreviousMedia: 'Vorherigen Medieninhalt zeigen',
  showNextMedia: 'Nächsten Medieninhalt zeigen',
  enterPinchZoom: 'Modus Ziehen zum Zoomen',
  exitPinchZoom: 'Modus Ziehen zum Zoomen beenden',
  showMedia: `Zeige {index, select,
    1 {ersten}
    2 {zweiten}
    3 {dritten}
    other {vierten}
  } Medieninhalt {current, select,
    true {(aktuell)}
    other {}
  }`,
  previewFocalPoint: 'Vorschau (Hauptausschnitt)',
  enterFocalPoint: 'Koordinaten des Hauptausschnitts des Medieninhalts eingeben (X, Y)',
  muteNotifications: 'Auch Benachrichtigungen stummschalten',
  muteAccountConfirm: '{account} stummschalten?',
  mute: 'Stummschalten',
  unmute: 'Stummschaltung aufheben',
  zoomOut: 'Herauszoomen',
  zoomIn: 'Hineinzoomen',
  // Reporting
  reportingLabel: 'Du machst eine Meldung von {account} an die Moderatoren von {instance}.',
  additionalComments: 'Zusätzliche Kommentare',
  forwardDescription: 'Auch an die Moderatoren von {instance} weiterleiten?',
  forwardLabel: 'An {instance} weiterleiten',
  unableToLoadStatuses: 'Kann neueste Tröts nicht laden: {error}',
  report: 'Melden',
  noContent: '(Keine Inhalte)',
  noStatuses: 'Keine Tröts zum Melden vorhanden',
  // Status options
  unpinFromProfile: 'Vom Profil abheften',
  pinToProfile: 'An Profil anheften',
  muteConversation: 'Unterhaltung stummschalten',
  unmuteConversation: 'Stummschaltung der Unterhaltung aufheben',
  bookmarkStatus: 'Tröt als Lesezeichen speichern',
  unbookmarkStatus: 'Tröt aus Lesezeichen entfernen',
  deleteAndRedraft: 'Löschen und neu eingeben',
  reportStatus: 'Tröt melden',
  shareStatus: 'Tröt teilen',
  copyLinkToStatus: 'Link zum Tröt kopieren',
  // Account profile
  profileForAccount: 'Profil für {account}',
  statisticsAndMoreOptions: 'Statistiken und weitere Optionen',
  statuses: 'Tröts',
  follows: 'Folgt',
  followers: 'Folgende',
  moreOptions: 'Weitere Optionen',
  followersLabel: 'Gefolgt von {count}',
  followingLabel: 'Folgt {count}',
  followLabel: `Folgen {requested, select,
    true {(Followeranfrage gestellt)}
    other {}
  }`,
  unfollowLabel: `Entfolgen {requested, select,
    true {(Followeranfrage gestellt)}
    other {}
  }`,
  unblock: 'Blockade aufheben',
  nameAndFollowing: 'Name und folgt',
  clickToSeeAvatar: 'Klicke zum Anzeigen des Avatars',
  opensInNewWindow: '{label} (öffnet in neuem Fenster)',
  blocked: 'Blockiert',
  domainHidden: 'Domain verborgen',
  muted: 'Stummgeschaltet',
  followsYou: 'Folgt Dir',
  avatarForAccount: 'Avatar für {account}',
  fields: 'Felder',
  accountHasMoved: '{account} ist umgezogen:',
  profilePageForAccount: 'Profilseite für {account}',
  verified: 'Verified',
  // About page
  about: 'Über',
  aboutApp: 'Über Semaphore',
  aboutAppDescription: `
  <p>
    Semaphore ist
    <a rel="noopener" target="_blank" href="https://github.com/NickColley/semaphore">quelloffene Software</a>,
    gepflegt von <a rel="noopener" target="_blank" href="https://nickcolley.co.uk">Nick Colley</a>
    und verteilt unter der
    <a rel="noopener" target="_blank"
      href="https://github.com/NickColley/semaphore/blob/main/LICENSE">AGPL Lizenz</a>.
    Es ist eine Fortsetzung des Pinafore-Projekts von <a rel="noopener" target="_blank" href="https://nolanlawson.com">Nolan Lawson</a>.
  </p>

  <h2 id="privacy-policy">Datenschutzerklärung</h2>

  <p>
    Semaphore speichert keine persönlichen Informationen auf seinen Servern,
    einschließlich, aber nicht beschränkt auf, Namen, E-Mail-Adressen,
    IP-Adressen, Beiträgen, und Fotos.
  </p>

  <p>
    Semaphore ist eine statische Seite. Alle Daten werden lokal in Ihrem Browser gespeichert und mit den Instanzen des Fediversums geteilt, zu denen Sie sich verbinden.
  </p>

  <h2>Mitwirkende</h2>

  <p>
    Icons provided by <a rel="noopener" target="_blank" href="http://fontawesome.io/">Font Awesome</a>.
  </p>

  <p>
    Logo thanks to "Flag" by AFY Studio from
    <a rel="noopener" target="_blank" href="https://thenounproject.com/">the Noun Project</a>.
  </p>`,
  // Settings
  settings: 'Einstellungen',
  general: 'Allgemein',
  generalSettings: 'Allgemeine Einstellungen',
  showSensitive: 'Sensible Inhalte standardmäßig anzeigen',
  showPlain: 'Eine graue Fläche für sensible Inhalte anzeigen',
  allSensitive: 'Alle Medien als sensibel behandeln',
  largeMedia: 'Große eingebettete Bilder und Videos anzeigen',
  autoplayGifs: 'Animierte Gifs automatisch abspielen',
  hideCards: 'Linkvorschauen verbergen',
  underlineLinks: 'Links in Tröts und Profilen unterstreichen',
  accessibility: 'Barrierefreiheit',
  reduceMotion: 'Bewegung in Animationen der Oberfläche reduzieren',
  disableTappable: 'Berührungsempfindlichkeit auf ganzem Tröt deaktivieren',
  removeEmoji: 'Emoji aus Anzeigenamen der Benutzer entfernen',
  shortAria: 'Verkürzte aria-label für Artikel verwenden',
  theme: 'Design',
  themeForInstance: 'Design für {instance}',
  disableCustomScrollbars: 'Angepasste Rollbalken deaktivieren',
  preferences: 'Vorlieben',
  hotkeySettings: 'Einstellungen für Tastenkürzel',
  disableHotkeys: 'Alle Tastenkürzel deaktivieren',
  leftRightArrows: 'Linke und rechte Pfeiltasten schalten den Fokus um anstatt der Spalten oder Medien',
  guide: 'Anleitung',
  reload: 'Neu laden',
  // Wellness settings
  wellness: 'Wohlbefinden',
  wellnessSettings: 'Einstellungen für ein gutes Wohlbefinden',
  wellnessDescription: `Die Einstellungen fürs Wohlbefinden dienen dazu, die süchtig machenden oder Angst induzierenden Aspekte von Social Media zu reduzieren.
    Nimm hier Einstellungen vor, die Dir gut tun.`,
  enableAll: 'Alle einschalten',
  metrics: 'Messungen',
  hideFollowerCount: 'Verbirg Anzahl Folgender (ab 10 gedeckelt)',
  hideReblogCount: 'Verbirg Anzahl der Boosts',
  hideFavoriteCount: 'Verbirg Anzahl Favorisierungen',
  hideUnread: 'Verbirg Anzeige ungelesener Benachrichtigungen (z.B. den roten Punkt)',
  ui: 'Benutzeroberfläche',
  grayscaleMode: 'Graustufenmodus',
  wellnessFooter: `Diese Einstellungen basieren zum Teil auf Richtlinien des
    <a rel="noopener" target="_blank" href="https://humanetech.com">Center for Humane Technology</a>.`,
  // This is a link: "You can filter or disable notifications in the _instance settings_"
  filterNotificationsPre: 'Du kannst die Einstellungen für Benachrichtigungen in den',
  filterNotificationsText: 'Instanzeinstellungen',
  filterNotificationsPost: 'anpassen.',
  // Custom tooltips, like "Disable _infinite scroll_", where you can click _infinite scroll_
  // to see a description. It's hard to properly internationalize, so we just break up the strings.
  disableInfiniteScrollPre: '',
  disableInfiniteScrollText: 'Unendliches Scrollen',
  disableInfiniteScrollDescription: 'Wenn unendliches Scrollen deaktiviert ist, erscheinen neue Tröts nicht automatisch am unteren oder oberen Ende der zeitleiste. Stattdessen kannst Du weitere Inhalte durch dafür vorgesehene Schaltflächen nachladen.',
  disableInfiniteScrollPost: 'deaktivieren',
  // Instance settings
  loggedInAs: 'Eingeloggt als',
  homeTimelineFilters: 'Filter für Startzeitleiste',
  notificationFilters: 'Filter für Benachrichtigungen',
  pushNotifications: 'Push-Benachrichtigungen',
  // Add instance page
  storageError: 'Es sieht so aus als ob Semaphore lokal keine Daten speichern kann. Ist Dein Browser im privaten Modus oder blockiert Cookies? Semaphore speichert alle Daten lokal und braucht zum ordnungsgemäßen Betrieb LocalStorage und IndexedDB.',
  javaScriptError: 'Du musst zum Einloggen javaScript einschalten.',
  enterInstanceName: 'Namen der Instanz eingeben',
  instanceColon: 'Instanz:',
  // Custom tooltip, concatenated together
  getAnInstancePre: 'Hast Du noch keine',
  getAnInstanceText: 'instanz',
  getAnInstanceDescription: 'Eine Instanz ist Deine Heimat auf Mastodon, wie z.B. mastodon.social oder cybre.space.',
  getAnInstancePost: '?',
  joinMastodon: 'Tritt Mastodon bei!',
  instancesYouveLoggedInTo: 'Instanzen, in denen Du angemeldet bist:',
  addAnotherInstance: 'Eine weitere Instanz hinzufügen',
  youreNotLoggedIn: 'Du bist bei keiner Instanz angemeldet.',
  currentInstanceLabel: `{instance} {current, select,
    true {(jetzige Instanz)}
    other {}
  }`,
  // Link text
  logInToAnInstancePre: '',
  logInToAnInstanceText: 'Melde Dich bei einer Instanz an',
  logInToAnInstancePost: 'um Semaphore zu verwenden.',
  // Another custom tooltip
  showRingPre: 'Immer einen',
  showRingText: 'Fokusring',
  showRingDescription: 'Der Fokusring ist der Rahmen, der um das fokussierte Element angezeigt wird, wenn Du mit der Tastatur navigierst. Standardmäßig wird er nicht angezeigt, wenn Du die maus oder einen Touchscreen verwendest. Hier kannst du einstellen, dass er immer angezeigt wird.',
  showRingPost: 'anzeigen',
  instances: 'Instanzen',
  addInstance: 'Instanz hinzufügen',
  homeTimelineFilterSettings: 'Einstellungen für die Filterung der Startzeitleiste',
  showReblogs: 'Boosts zeigen',
  showReplies: 'Antworten zeigen',
  switchOrLogOut: 'Zu dieser Instanz wechseln oder sich von ihr abmelden',
  switchTo: 'Zu dieser Instanz wechseln',
  switchToInstance: 'Zu Instanz wechseln',
  switchToNameOfInstance: 'Wechsle zu {instance}',
  logOut: 'Abmelden',
  logOutOfInstanceConfirm: 'Von {instance} abmelden?',
  notificationFilterSettings: 'Einstellungen für die Filterung von Benachrichtigungen',
  // Push notifications
  browserDoesNotSupportPush: 'Dein Browser unterstützt keine Push-Benachrichtigungen.',
  deniedPush: 'Du hast es abgelehnt, Push-Benachrichtigungen anzuzeigen.',
  pushNotificationsNote: 'Beachte, dass Du nur für jeweils eine Instanz Push-Benachrichtigungen anzeigen lassen kannst.',
  pushSettings: 'Einstellungen für Push-Benachrichtigungen',
  newFollowers: 'Neue Folgende',
  reblogs: 'Boosts',
  pollResults: 'Umfrageergebnisse',
  needToReauthenticate: 'Du musst Dich neu anmelden, um die Push-Benachrichtigung einschalten zu können. Jetzt von {instance} abmelden?',
  failedToUpdatePush: 'Fehler beim Aktualisieren der Einstellungen für Push-Benachrichtigungen: {error}',
  // Themes
  chooseTheme: 'Wähle ein Design',
  darkBackground: 'Dunkler Hintergrund',
  lightBackground: 'Heller Hintergrund',
  themeLabel: `{label} {default, select,
    true {(standard)}
    other {}
  }`,
  animatedImage: 'Animiertes Gif: {description}',
  showImage: `Zeige {animated, select,
    true {animiert}
    other {}
  } image: {description}`,
  playVideoOrAudio: `Wiedergabe von {audio, select,
    true {audio}
    other {video}
  }: {description}`,
  accountFollowedYou: '{name} folgt Dir jetzt, {account}',
  reblogCountsHidden: 'Anzahl Boosts verborgen',
  favoriteCountsHidden: 'Anzahl Favorisierungen verborgen',
  rebloggedTimes: `Geboostet {count, plural,
    one {einmal}
    other {{count} mal}
  }`,
  favoritedTimes: `Favorisiert {count, plural,
    one {einmal}
    other {{count} mal}
  }`,
  pinnedStatus: 'Angehefteter Tröt',
  rebloggedYou: 'hat Deinen Tröt geboostet',
  favoritedYou: 'hat Deinen Tröt favorisiert',
  followedYou: 'folgt Dir jetzt',
  pollYouCreatedEnded: 'Eine von Dir erstellte Umfrage ist beendet',
  pollYouVotedEnded: 'Eine Umfrage, an der Du teilgenommen hast, ist beendet',
  reblogged: 'geboostet',
  showSensitiveMedia: 'Sensible Inhalte zeigen',
  hideSensitiveMedia: 'Sensible Inhalte verbergen',
  clickToShowSensitive: 'Sensible Inhalte. Klicke zum Anzeigen.',
  longPost: 'Langer Beitrag',
  // Accessible status labels
  accountRebloggedYou: '{account} hat Deinen Tröt geboostet',
  accountFavoritedYou: '{account} hat Deinen Tröt favorisiert',
  rebloggedByAccount: 'geboostet von {account}',
  contentWarningContent: 'Inhaltswarnung: {spoiler}',
  hasMedia: 'hat Medien',
  hasPoll: 'hat Umfrage',
  shortStatusLabel: '{privacy} Tröt von {account}',
  // Privacy types
  public: 'Öffentlich',
  unlisted: 'Nicht gelistet',
  followersOnly: 'Nur Folgende',
  direct: 'Direkt',
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
  voteOnPoll: 'In dieser Umfrage abstimmen',
  pollChoices: 'Auswahlmöglichkeiten',
  vote: 'Abstimmen',
  pollDetails: 'Einzelheiten zur Umfrage',
  refresh: 'Aktualisieren',
  expires: 'Endet',
  expired: 'Beendet',
  voteCount: `{count, plural,
    one {eine Stimme}
    other {{count} Stimmen}
  }`,
  // Status interactions
  clickToShowThread: '{time} - Klicke, um Unterhaltung anzuzeigen',
  showMore: 'Zeige mehr',
  showLess: 'Zeige weniger',
  closeReply: 'Antwort schließen',
  cannotReblogFollowersOnly: 'Kann nicht geboostet werden, da nur Folgende',
  cannotReblogDirectMessage: 'Kann nicht geboostet werden, da dies eine Direktnachricht ist',
  reblog: 'Boost',
  reply: 'Antworten',
  replyToThread: 'Auf Unterhaltung antworten',
  favorite: 'Favorisieren',
  unfavorite: 'Favorisieren aufheben',
  // timeline
  loadingMore: 'Lade weitere',
  loadMore: 'Lade weitere',
  showCountMore: 'Zeige {count} weitere',
  nothingToShow: 'Nichts zum anzeigen.',
  // status thread page
  statusThreadPage: 'Seite für Tröt-Unterhaltung',
  status: 'Tröt',
  // toast messages
  blockedAccount: 'Account blockiert',
  unblockedAccount: 'Blockade des Accounts aufgehoben',
  unableToBlock: 'Konnte Account nicht blockieren: {error}',
  unableToUnblock: 'Konnte Blockade des Accounts nicht aufheben: {error}',
  bookmarkedStatus: 'Tröt als Lesezeichen gespeichert',
  unbookmarkedStatus: 'Tröt aus Lesezeichen entfernt',
  unableToBookmark: 'Konnte kein lesezeichen setzen: {error}',
  unableToUnbookmark: 'Konnte Lesezeichen nicht entfernen: {error}',
  cannotPostOffline: 'Du kannst nicht senden, wenn Du offline bist',
  unableToPost: 'Konnte Tröt nicht posten: {error}',
  statusDeleted: 'Tröt gelöscht',
  unableToDelete: 'Konnte Tröt nicht löschen: {error}',
  cannotFavoriteOffline: 'Du kannst nicht favorisieren, wenn Du offline bist',
  cannotUnfavoriteOffline: 'Du kannst Favorisierung nicht zurücknehmen, wenn Du offline bist',
  unableToFavorite: 'Konnte nicht favorisieren: {error}',
  unableToUnfavorite: 'Konnte Favorisierung nicht aufheben: {error}',
  followedAccount: 'folge jetzt diesem Account',
  unfollowedAccount: 'Folge diesem Account nicht mehr',
  unableToFollow: 'Konnte dem Account nicht folgen: {error}',
  unableToUnfollow: 'Konnte den Account nicht entfolgen: {error}',
  accessTokenRevoked: 'Das Zugriffstoken wurde zurückgezogen, von {instance} abgemeldet',
  loggedOutOfInstance: 'Von {instance} abgemeldet',
  failedToUploadMedia: 'Konnte Medien nicht hochladen: {error}',
  mutedAccount: 'Account stummgeschaltet',
  unmutedAccount: 'Stummschaltung von Account aufgehoben',
  unableToMute: 'Konnte Account nicht stummschalten: {error}',
  unableToUnmute: 'Konnte Stummschaltung von Account nicht aufheben: {error}',
  mutedConversation: 'Unterhaltung stummgeschaltet',
  unmutedConversation: 'Stummschaltung der Unterhaltung aufgehoben',
  unableToMuteConversation: 'Konnte Unterhaltung nicht stummschalten: {error}',
  unableToUnmuteConversation: 'Konnte Stummschaltung der Unterhaltung nicht aufheben: {error}',
  unpinnedStatus: 'Tröt abgeheftet',
  unableToPinStatus: 'Konnte Tröt nicht anheften: {error}',
  unableToUnpinStatus: 'Konnte Tröt nicht abheften: {error}',
  unableToRefreshPoll: 'Konnte Umfrage nicht aktualisieren: {error}',
  unableToVoteInPoll: 'Konte in der Umfrage nicht abstimmen: {error}',
  cannotReblogOffline: 'Du kannst nicht boosten, wenn Du offline bist.',
  cannotUnreblogOffline: 'Du kannst einen Boost nicht aufheben, wenn Du offline bist.',
  failedToReblog: 'Boosten fehlgeschlagen: {error}',
  failedToUnreblog: 'Aufheben des Boosts fehlgeschlagen: {error}',
  submittedReport: 'Meldung übermittelt',
  failedToReport: 'Übermittlung der Meldung fehlgeschlagen: {error}',
  approvedFollowRequest: 'Folgeanfrage genehmigt',
  rejectedFollowRequest: 'Folgeanfrage abgelehnt',
  unableToApproveFollowRequest: 'Konnte Folgeanfrage nicht genehmigen: {error}',
  unableToRejectFollowRequest: 'Konnte Folgeanfrage nicht ablehnen: {error}',
  searchError: 'Fehler bei der Suche: {error}',
  hidDomain: 'Domain verborgen',
  unhidDomain: 'Domain nicht mehr verborgen',
  unableToHideDomain: 'Konnte Domain nicht verbergen: {error}',
  unableToUnhideDomain: 'Konnte Verbergen der Domain nicht aufheben: {error}',
  showingReblogs: 'Zeige Boosts an',
  hidingReblogs: 'Verberge Boosts',
  unableToShowReblogs: 'Kann Boosts nicht anzeigen: {error}',
  unableToHideReblogs: 'Kann Boosts nicht verbergen: {error}',
  unableToShare: 'Teilen fehlgeschlagen: {error}',
  showingOfflineContent: 'Anforderung übers Internet fehlgeschlagen. Zeige Offline-Inhalte an.',
  youAreOffline: 'Du scheinst keine Verbindung zum Internet zu haben. Du kanst weiterhin Tröts lesen, solange Du offline bist.',
  // Snackbar UI
  updateAvailable: 'Update der App verfügbar',
  // Details
  statusEdited: 'Edited'
}
