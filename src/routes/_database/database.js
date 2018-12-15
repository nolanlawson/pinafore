// The proxy stuff doesn't play well with IDEs, so use this as
// the dev mode database.js, but swap out the other one in Webpack.

import * as database from './databaseApis'
export { database }
