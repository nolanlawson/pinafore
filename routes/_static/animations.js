export const FAVORITE_ANIMATION = [
  {
    properties: [
      {transform: 'scale(1)'},
      {transform: 'scale(2)'},
      {transform: 'scale(1)'}
    ],
    options: {
      duration: 400,
      easing: 'ease-in-out'
    }
  },
  {
    properties: [
      {fill: 'var(--action-button-fill-color)'},
      {fill: 'var(--action-button-fill-color-pressed)'}
    ],
    options: {
      duration: 400,
      easing: 'linear'
    }
  }
]

export const REBLOG_ANIMATION = FAVORITE_ANIMATION

export const FOLLOW_BUTTON_ANIMATION = [
  {
    properties: [
      {transform: 'scale(1)'},
      {transform: 'scale(2)'},
      {transform: 'scale(1)'}
    ],
    options: {
      duration: 400,
      easing: 'ease-in-out'
    }
  }
]
