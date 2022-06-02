const notNode = require('not-node');
const {notValidationError} = require('not-error');
const {ERR_EMPTY_KEY_NO_CONSUMERS,ERR_INVALID_KEY_OR_ORIGIN} = require('../../const');

module.exports = async ({key, origin}/*, validationEnvs*/) => {
  let keyDoc = await notNode.Application.getModel('not-key//Key').findActiveByKeyOrOrigin(key, origin);
  if (!keyDoc) {
    throw new notValidationError(
      `not-key:${ERR_INVALID_KEY_OR_ORIGIN}`,
      {},
      undefined,
      {}
    );
  }
  if (!(keyDoc.crate || keyDoc.crate.consumers)) {
    throw new notValidationError(
      `not-key:${ERR_EMPTY_KEY_NO_CONSUMERS}`,
      {},
      undefined,
      {}
    );
  }
};
