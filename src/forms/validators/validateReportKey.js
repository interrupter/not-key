const notNode = require('not-node');
const {notValidationError} = require('not-error');
const {ERR_EMPTY_KEY_NO_CONSUMERS,ERR_INVALID_KEY_OR_ORIGIN} = require('../../const');

module.exports = async ({inKey, orgn}/*, validationEnvs*/) => {
  let key = await Key.findActiveByKeyOrOrigin(inKey, orgn);
  if (!key) {
    throw new notValidationError(
      `not-key:${ERR_INVALID_KEY_OR_ORIGIN}`,
      {},
      undefined,
      {}
    );
  }
  if (!(key.crate || key.crate.consumers)) {
    throw new notValidationError(
      `not-key:${ERR_EMPTY_KEY_NO_CONSUMERS}`,
      {},
      undefined,
      {}
    );
  }
};
