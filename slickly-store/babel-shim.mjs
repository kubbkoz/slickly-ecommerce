const stub = () => { };
export default stub;
export const parse = stub;
export const traverse = stub;
export const template = stub;
export const types = {};

export class Generator { }
export class SourceMapGenerator { }
export class SourceMapConsumer {
    static async with(data, callback) { return callback(new SourceMapConsumer()); }
}
export class MappingList { }
export class SourceNode { }
export const version = "0.0.0";
export const generateSourceMap = stub;

// xss's FilterXSS — needed as a named export because nuxt-security's
// xssValidator middleware does `import { FilterXSS } from "xss"`, and Rollup
// hard-fails the build if a named import doesn't exist on the resolved module
// (static export analysis — this errors at build time regardless of whether
// the binding is ever actually called at runtime). Kept a harmless passthrough:
// nuxt.config.ts sets security.xssValidator = false, so `new FilterXSS(...)`
// is never reached in practice — this only exists to satisfy Rollup's static
// check, not to actually filter anything.
export class FilterXSS {
    constructor() { }
    process(input) { return input; }
}