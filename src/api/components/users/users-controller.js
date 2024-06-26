const usersService = require('./users-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

/**
 * Handle get list of users request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getUsers(request, response, next) {
  try {
    const users = await usersService.getUsers();
    return response.status(200).json(users);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle get user detail request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getUser(request, response, next) {
  try {
    const user = await usersService.getUser(request.params.id);

    if (!user) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Unknown user');
    }

    return response.status(200).json(user);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle create user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function createUser(request, response, next) {
  try {
    const name = request.body.name;
    const email = request.body.email;
    const password = request.body.password;
    const confirmpassword = request.body.confirmpassword;

    if(confirmpassword !== password){
      throw errorResponder(
        errorTypes.INVALID_PASSWORD,
        'Passwords did not match'
      )
    }

    const emailExists = await usersService.checkUserEmail(email);
    if (emailExists) {
      throw errorResponder(
        errorTypes.EMAIL_ALREADY_TAKEN,
        'Email already taken'
      );
    }
    
    const success = await usersService.createUser(name, email, password);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create user'
      );
    }

    return response.status(200).json({ name, email });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle update user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function updateUser(request, response, next) {
  try {
    const id = request.params.id;
    const name = request.body.name;
    const email = request.body.email;
    const password = request.body.password;
    const confirmpassword = request.body.confirmpassword;

    if(confirmpassword !== password){
      throw errorResponder(
        errorTypes.INVALID_PASSWORD,
        'Passwords did not match'
      )
    }

    const emailExists = await usersService.checkUserEmail(email);
    if (emailExists) {
      throw errorResponder(
        errorTypes.EMAIL_ALREADY_TAKEN,
        'Email already taken'
      );
    }

    const success = await usersService.updateUser(id, name, email);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update user'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

async function patchUser(request, response, next){
  try {
    const id = request.params.id;
    const oldpassword = request.body.oldpassword;
    const newpassword = request.body.newpassword;
    const confirmnewpassword = request.body.confirmnewpassword;

    const check = await usersService.checkLoginCredential(id, oldpassword);
    if(check){
      throw errorResponder(
        errorTypes.INVALID_PASSWORD,
        'Wrong password!'
      )
    }

    if(newpassword !== confirmnewpassword){
      throw errorResponder(
        errorTypes.INVALID_PASSWORD,
        'Your new password doesnt match the confirm new password!'
      )
    }

    // Saya commit dan push sekali lagi karena lebih masuk akal juga apabila password yang lama seharusnya tidak boleh sama dengan password yang baru
    if(oldpassword === newpassword){
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Your new password cant be the same as the old one!'
      )
    }

    const checking = await usersService.patchUser(id, oldpassword, confirmnewpassword);
    if(!checking){
      throw errorResponder(
        errorTypes.INVALID_CREDENTIALS,
        'Fail to patch user'
      )
    }
    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle delete user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function deleteUser(request, response, next) {
  try {
    const id = request.params.id;

    const success = await usersService.deleteUser(id);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete user'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  patchUser,
};
