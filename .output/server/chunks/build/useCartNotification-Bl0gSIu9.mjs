import { K as useNotifications, a as useCart } from './server.mjs';

const successCodes = ["promotion-discount-added"];
function useCartNotification() {
  const { pushError, pushSuccess } = useNotifications();
  const { consumeCartErrors } = useCart();
  const codeErrorsNotification = () => {
    const errors = consumeCartErrors();
    if (!errors || Array.isArray(errors)) return;
    for (const element of Object.keys(errors)) {
      const error = errors[element];
      if (successCodes.includes(error.messageKey)) {
        pushSuccess(error.message);
      } else {
        pushError(error.message);
      }
    }
  };
  const getErrorsCodes = () => {
    const errors = consumeCartErrors();
    if (!errors || Array.isArray(errors)) return [];
    return Object.keys(errors).reduce(
      (acc, element) => {
        const error = errors[element];
        if (!successCodes.includes(error.messageKey)) acc.push(error);
        return acc;
      },
      []
    );
  };
  return {
    codeErrorsNotification,
    getErrorsCodes
  };
}

export { useCartNotification as u };
