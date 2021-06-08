"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.poolConnected = exports.pool = void 0;
var mssql_1 = __importDefault(require("mssql"));
var config_1 = __importDefault(require("./config"));
exports.pool = new mssql_1.default.ConnectionPool(config_1.default);
var poolConnected = function () { return exports.pool.connect(); };
exports.poolConnected = poolConnected;
