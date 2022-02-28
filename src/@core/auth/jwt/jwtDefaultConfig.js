export default {
  // Endpoints
  loginEndpoint: '/api/auth/login',
  registerEndpoint: '/jwt/register',
  refreshEndpoint: '/api/auth/refresh',
  logoutEndpoint: '/jwt/logout',

  // This will be prefixed in authorization header with token
  // e.g. Authorization: Bearer <token>
  tokenType: 'Bearer',

  // Value of this property will be used as key to store JWT token in storage
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
}
