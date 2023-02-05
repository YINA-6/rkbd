import axios from 'axios'


const http = axios.create({
        baseURL: 'http://localhost/api/v1/',
        timeout: 10000,
    })
    // 请求拦截器
http.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        console.log(error);
        return Promise.reject();
    }
);
// 响应拦截器
http.interceptors.response.use(
    (response) => {
        if (response.status === 200) {
            return response.data;
        } else {
            Promise.reject();
        }
    },
    (error) => {
        console.log(error);
        return Promise.reject();
    }
);


export default http