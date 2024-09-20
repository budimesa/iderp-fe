import axios from 'axios'

const authApi= axios.create({
    baseURL:`http://127.0.0.1:8000/`,
    headers:{
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
    },
    withCredentials: true
})

export default authApi