import request from '../utils/request';

export const http = (url, params, method) => {
    return request({
        url,
        data: {...params },
        method: 'get'
    });
};