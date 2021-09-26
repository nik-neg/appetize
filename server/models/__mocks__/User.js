const User = {
  _id: '12345679',
  firstName: 'firstName',
  lastName: 'lastName',
  email: 'email',
  password: 'password',
  hashedPassword: Array.from('password').reverse().join(''),
  findOne: async () => {},
  create: async () => {},
};

module.exports = User;
