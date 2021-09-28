/* export const myGetter = (state) => {
    return state
    traer informacion del state, y la podemos procesar
} */

export const getEntriesByTerm = (state) => (term = '') => {
    if(term.length === 0){
        return state.entries
    }else{
        return state.entries.filter(entry => entry.text.toLowerCase().includes(term.toLowerCase()))
    }
}

export const getEntryById = (state) => (id = '') => {
    const entry = state.entries.find(entry => entry.id === id)

    if(!entry) return 
    //aplico el spread operator porque me regresa un PROXY y asi no lo puedo manipular como objeto
    return { ...entry } //TODO: prueben

}
