"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseStorage = void 0;
const storage_1 = __importDefault(require("./storage"));
exports.BaseStorage = storage_1.default;
class BrowserConfig extends storage_1.default {
    static create(id, opt) {
        return new BrowserConfig(id, opt);
    }
}
exports.default = BrowserConfig;
