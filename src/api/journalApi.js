import axios from 'axios'

const journalApi = axios.create({
    baseURL: 'https://vue-demos-164a5-default-rtdb.firebaseio.com'
})

export default journalApi