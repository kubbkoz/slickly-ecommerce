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