import axios from 'axios';

//解决node端请求跨域
export default axios.create({
  proxy: {
    host: '127.0.0.1',
    port: 9090
  }
});