// The idea here is we can manually version some assets that change very infrequently, such
// as theme CSS and icons. Then we can cache them for longer at the HTTP level.
// And we can always bump this number to bust the cache.
//
// Process for busting the cache:
// 1. Increment this number
// 2. Move ./src/static/v<old> to ./src/static/v<new>
export const ASSET_VERSION = 'v1'
