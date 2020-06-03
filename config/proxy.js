// 代理接口
export default {
  '/192.168.20.14:8150/': {
    target: 'http://192.168.20.14:8150/',
    changeOrigin: true,
    pathRewrite: { '^/192.168.20.14:8150/': '' },
  },
  '/192.168.20.6:8150/': {
    target: 'http://192.168.20.6:8150/',
    changeOrigin: true,
    pathRewrite: {
      '^/192.168.20.6:8150/': '',
    },
  },
  '/192.168.20.27:8150/': {
    target: 'http://192.168.20.27:8150/',
    changeOrigin: true,
    pathRewrite: {
      '^/192.168.20.27:8150/': '',
    },
  },
};
