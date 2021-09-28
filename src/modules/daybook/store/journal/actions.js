/* export const myActions = async({ commit }) => {
    son acciones asincronas que pueden mandar llamar una mutacion
} */

import journalApi from "../../../../api/journalApi"

export const loadEntries = async({ commit }) => {
    const { data } = await journalApi.get('/entries.json')
    if(!data){
        commit('setEntries', [])
        return 
    }
    const entries = []
    for(let id of Object.keys(data)){
        //console.log(id)
        entries.push({
            id,
            ...data[id]
        })
    }
    //console.log(data)
    //console.log(entries)
    commit('setEntries', entries)
}

export const updateEntry = async({ commit } , entry) => { //entry debe de ser un parametro
    //Extraer solo lo que necesitan //-id
    console.log(entry,"actions")

    const { date, picture, text } = entry
    const dataToSave = { date, picture, text }
    //await journalApi.put(PATH.json, dataToSave)
    const resp = await journalApi.put(`/entries/${entry.id}.json` , dataToSave)
    console.log(resp)
    //commit de una mitacion -> updateEntry
    commit('updateEntry', { ...entry })
}

export const createEntry = async({ commit }, entry) => {
    //dataToSave
    const { date, picture, text } = entry
    const dataToSave = { date, picture, text }
    //const {data} = await journalApi.post(`/entries/${entry.id}.json` , dataToSave)
    const {data} = await journalApi.post(`/entries.json` , dataToSave)
    //data = { name: -iojdoijsiugd}
    dataToSave.id = data.name
    commit('addEntry', dataToSave)
    //entry.id

    return data.name;
}

export const deleteEntry = async({ commit }, id) => {
    
    await journalApi.delete(`/entries/${id}.json`)
    commit('deleteEntry', id)
    return id
}