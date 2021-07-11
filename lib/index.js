"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.op = void 0;
const storage_1 = __importDefault(require("./storage"));
var storage_2 = require("./storage");
Object.defineProperty(exports, "op", { enumerable: true, get: function () { return storage_2.op; } });
class BrowserConfig extends storage_1.default {
    static create(id, opt) {
        return new BrowserConfig(id, opt);
    }
}
exports.default = BrowserConfig;
