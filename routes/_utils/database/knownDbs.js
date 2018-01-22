import keyval from "idb-keyval"

export async function addKnownDb(instanceName, type, dbName) {
  let knownDbs = (await keyval.get('known_dbs')) || {}
  if (!knownDbs[instanceName]) {
    knownDbs[instanceName] = []
  }
  if (!knownDbs[instanceName].some(db => db.type === type && db.dbName === dbName)) {
    knownDbs[instanceName].push({type, dbName})
  }
  await keyval.set('known_dbs', knownDbs)
}

export async function getKnownDbs() {
  return (await keyval.get('known_dbs')) || {}
}

export async function getKnownDbsForInstance(instanceName) {
  let knownDbs = await getKnownDbs()
  return knownDbs[instanceName] || []
}