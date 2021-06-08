"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config = {
    server: 'localhost',
    database: 'SL_Database',
    authentication: {
        type: 'default',
        options: {
            userName: 'sa',
            password: 'Password64*',
        },
    },
    options: {
        encrypt: false,
    },
};
exports.default = config;
