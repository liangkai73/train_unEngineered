const netWork = window.netWork || (window.netWork = {});
netWork.axios = netWork.axios || axios.create({
    baseURL: 'https://api.github.com',
    // 其他配置...
});

// 添加请求拦截器
netWork.axios.interceptors.request.use(config => {
    return config;
}, error => {
    console.error(error)
    return Promise.reject(error);
});

// 添加响应拦截器
netWork.axios.interceptors.response.use(response => {
    const { data } = response
    return data
}, error => {
    console.error(err)
    return Promise.reject(error);
});
