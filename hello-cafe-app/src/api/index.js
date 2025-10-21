import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api", //  backend API base URL
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});


// add inteceptor to avoid duplicate request
const pendingRequests = new Map();

api.interceptors.request.use(config => {
  // check post and put request only
  if (config.method?.toLowerCase() === 'post' || config.method?.toLowerCase() === 'put') {
    const requestKey = `${config.method}-${config.url}-${JSON.stringify(config.data)}`;
    
    if (pendingRequests.has(requestKey)) {
      const cancelToken = pendingRequests.get(requestKey);
      cancelToken.cancel('Duplicate request cancelled');
    }
    
    const source = axios.CancelToken.source();
    config.cancelToken = source.token;
    pendingRequests.set(requestKey, source);
  }
  
  return config;
});

api.interceptors.response.use(
  response => {
    // clear post and put request
    if (response.config.method?.toLowerCase() === 'post' || response.config.method?.toLowerCase() === 'put') {
      const requestKey = `${response.config.method}-${response.config.url}-${JSON.stringify(response.config.data)}`;
      pendingRequests.delete(requestKey);
    }
    return response;
  },
  error => {
    if (axios.isCancel(error)) {
      console.log('Request cancelled:', error.message);
    } else if (error.config) {
      const requestKey = `${error.config.method}-${error.config.url}-${JSON.stringify(error.config.data)}`;
      pendingRequests.delete(requestKey);
    }
    return Promise.reject(error);
  }
);
export default api;
