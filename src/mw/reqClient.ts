import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
// Add a request interceptor
import { baseApi } from "../common/urls"
const instance = axios.create({
  baseURL: baseApi,
  headers: {'Content-Type':'application/json'}
});

// Override timeout default for the library
// Now all requests using this instance will wait 2.5 seconds before timing out
// instance.defaults.timeout = 2500;
instance.interceptors.request.use(function (config) {
  // Do something before request is sent
  return config;
},  (error)=> {
  // Do something with request error
  return Promise.reject(error);
});

// Add a response interceptor
instance.interceptors.response.use(function (response) {
  // Do something with response data
  return response;
}, (error)=> {
  console.log("SHIVA: error resp", error);
  // Do something with response error
  // toast.error(error, {
  //   position: toast.POSITION.TOP_RIGHT
  // });
  return Promise.reject(error);
});


export default instance;