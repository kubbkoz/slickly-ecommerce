import { withMessage, url, sameAs, requiredUnless, requiredIf, required, or, numeric, not, minValue, minLength, maxLength, macAddress, ipv4Address, integer, email, decimal, between, alphaNum, alpha } from '@regle/rules';
import { j as useNuxtApp } from './server.mjs';

const customValidators = () => {
  const { $i18n } = useNuxtApp();
  const t = $i18n.t.bind($i18n);
  const getMessage = (key, params) => {
    return () => t(`validations.${key}`, params || {});
  };
  return {
    alpha: withMessage(alpha, getMessage("alpha")),
    alphaNum: withMessage(alphaNum, getMessage("alphaNum")),
    between: (min, max) => withMessage(between(min, max), getMessage("between", { min, max })),
    decimal: withMessage(decimal, getMessage("decimal")),
    email: withMessage(email, getMessage("email")),
    integer: withMessage(integer, getMessage("integer")),
    ipAddress: withMessage(ipv4Address, getMessage("ipAddress")),
    macAddress: withMessage(macAddress, getMessage("macAddress")),
    maxLength: (max) => withMessage(maxLength(max), getMessage("maxLength", { max })),
    minLength: (min) => withMessage(minLength(min), getMessage("minLength", { min })),
    minValue: (min) => withMessage(minValue(min), getMessage("minValue", { min })),
    not: (validator) => withMessage(not(validator), getMessage("not")),
    numeric: withMessage(numeric, getMessage("numeric")),
    or: (...validators) => withMessage(
      or(...validators),
      getMessage("or")
    ),
    required: withMessage(required, getMessage("required")),
    requiredIf: (condition) => withMessage(requiredIf(condition), getMessage("requiredIf")),
    requiredUnless: (condition) => withMessage(requiredUnless(condition), getMessage("requiredUnless")),
    sameAs: (other, otherName) => withMessage(
      sameAs(other, otherName),
      getMessage("sameAs", { otherName })
    ),
    url: withMessage(url, getMessage("url"))
  };
};

export { customValidators as c };
