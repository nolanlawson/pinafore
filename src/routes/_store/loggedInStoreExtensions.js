import { loggedInComputations } from './computations/loggedInComputations.js'
import { loggedInObservers } from './observers/loggedInObservers.js'
import { loggedInMixins } from './mixins/loggedInMixins.js'

console.log('imported logged in observers and computations')
loggedInMixins()
loggedInComputations()
loggedInObservers()
