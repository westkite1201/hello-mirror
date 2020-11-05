/*
 * Client Configuration
 *
 */
export const clientConfig = {
  endpoint: {
    web:
      process.env.REACT_APP_API_HOST === 'develop'
        ? 'http://127.0.0.1:3031'
        : process.env.REACT_APP_PROXY_URL,
    api:
      process.env.REACT_APP_API_HOST === 'develop'
        ? 'http://127.0.0.1:3031/api'
        : process.env.REACT_APP_PROXY_URL + '/api',
  },
};
