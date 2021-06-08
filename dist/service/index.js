"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadXLSX = void 0;
var exceljs_1 = require("exceljs");
var path_1 = __importDefault(require("path"));
var db_1 = require("../db");
var dayjs_1 = __importDefault(require("dayjs"));
var getIndex = function (list, key) {
    return list.indexOf(key);
};
function convertToNumberingScheme(number) {
    var baseChar = ("A").charCodeAt(0), letters = "";
    do {
        number -= 1;
        letters = String.fromCharCode(baseChar + (number % 26)) + letters;
        number = (number / 26) >> 0; // quick `floor`
    } while (number > 0);
    return letters;
}
var addLeadingZeror = function (number) {
    return ("0" + number).substr(-2);
};
var downloadXLSX = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var shiftRow_1, selectedDate, workbook, wb_1, tableDate, headerNames_1, timeRanges_1, request, recordset, buffer, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                shiftRow_1 = 7;
                selectedDate = dayjs_1.default(req.body.selectedDate).format('YYYY-MM-DD');
                workbook = new exceljs_1.Workbook();
                return [4 /*yield*/, workbook.xlsx.readFile(path_1.default.join(__dirname, '../', "template/" + req.body.report + ".xlsx"))
                    // set date 
                ];
            case 1:
                wb_1 = _a.sent();
                tableDate = wb_1.worksheets[0].getCell('A2').value + selectedDate;
                wb_1.worksheets[0].getCell('A2').value = tableDate;
                headerNames_1 = wb_1.worksheets[1].getColumn(2).values.slice(2) // A2
                ;
                timeRanges_1 = wb_1.worksheets[0].getColumn(1).values.slice(shiftRow_1)
                    .map(function (val) {
                    var twoDigitHour = addLeadingZeror(new Date(val).getUTCHours());
                    var twoDigitMinute = addLeadingZeror(new Date(val).getUTCMinutes());
                    var time = twoDigitHour + ":" + twoDigitMinute;
                    return time;
                }) //A7
                ;
                wb_1.removeWorksheet('TAG');
                request = db_1.pool.request();
                return [4 /*yield*/, request.query("SELECT\n        time_hour,\n        CONVERT(VARCHAR(30), point_id) AS point_id,\n        _VAL AS value\n      FROM\n        REPORT_TABLE AS t1\n        INNER JOIN (\n          SELECT\n            DATEPART (HOUR,CONVERT(VARCHAR(30), timestamp)) AS time_hour,\n            CONVERT(VARCHAR(30), point_id) AS min_point_id,\n            MIN(CONVERT(datetime2, CONVERT(VARCHAR(30), timestamp))) AS min_timestamp\n          FROM\n            REPORT_TABLE\n          WHERE\n            CAST(CONVERT(VARCHAR(30), timestamp) AS DATE) = '" + selectedDate + "'\n          GROUP BY\n            DATEPART (HOUR,\n              CONVERT(VARCHAR(30), timestamp)),\n            CONVERT(VARCHAR(30), point_id)) AS t2 \n        ON CONVERT(datetime2, CONVERT(VARCHAR(30), timestamp)) = t2.min_timestamp\n      WHERE\n        t2.min_timestamp = CONVERT(datetime2, CONVERT(VARCHAR(30), timestamp))\n        AND t2.min_point_id LIKE t1.point_id\n      ORDER BY\n        time_hour ASC")];
            case 2:
                recordset = (_a.sent()).recordset;
                recordset.forEach(function (record) { return __awaiter(void 0, void 0, void 0, function () {
                    var colIndex, rowIndex, ref;
                    return __generator(this, function (_a) {
                        colIndex = getIndex(headerNames_1, record.point_id);
                        rowIndex = getIndex(timeRanges_1, ("0" + record.time_hour).substr(-2) + ":00");
                        if (colIndex > -1) {
                            ref = "" + convertToNumberingScheme(colIndex + 2) + ("" + (rowIndex + shiftRow_1));
                            wb_1.worksheets[0].getCell(ref).value = record.value;
                        }
                        return [2 /*return*/];
                    });
                }); });
                return [4 /*yield*/, wb_1.xlsx.writeBuffer()];
            case 3:
                buffer = _a.sent();
                res.send(buffer);
                return [3 /*break*/, 5];
            case 4:
                error_1 = _a.sent();
                res.status(404).end();
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.downloadXLSX = downloadXLSX;
