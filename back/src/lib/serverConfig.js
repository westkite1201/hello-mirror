module.exports = {
  endpoint: {
    web: '',
    api: ''
  },
  auth: {
    jwt: { secret: process.env.JWT_SECRET || 'cqms1234' },
    cookieOptions: {
      maxAge: 1000 * (60 * 60 * 24),
      httpOnly: false
    }
  }
};
