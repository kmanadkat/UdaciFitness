export const RECEIVE_ENTRIES = 'RECEIVE_ENTRIES'
export const ADD_ENTRY = 'ADD_ENTRY'

export const receiveEntries = (entries) => ({
  type: RECEIVE_ENTRIES,
  entries
});

export const addEntry = (entry) => ({
  type: ADD_ENTRY,
  entry
})
