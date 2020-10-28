/*
 * Client Configuration
 *
 */
export const clientConfig = {
  endpoint: {
    web:
      process.env.REACT_APP_API_HOST === 'develop'
        ? 'http://127.0.0.1:3031'
        : 'https://www.hangang.site',
    api:
      process.env.REACT_APP_API_HOST === 'develop'
        ? 'http://127.0.0.1:3031/api'
        : 'https://www.hangang.site/api',
  },
};
