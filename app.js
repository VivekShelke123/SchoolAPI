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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
var express = require("express");
var bodyParser = require("body-parser");
var mysql = require("mysql2/promise");
//Defining Pool For My SQl
var pool = mysql.createPool({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database,
});
console.log(process.env.host, process.env.user);
//defining APP And middleware function
exports.app = express();
exports.app.use(bodyParser.urlencoded({ extended: true }));
//definning home action 
exports.app.get('/', function (req, res) {
    res.render('index.ejs');
});
//definning  /addSchool 
exports.app.post('/addSchool', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, Name, Addr, Lat, Lon, latitude, longitude, result, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, Name = _a.Name, Addr = _a.Addr, Lat = _a.Lat, Lon = _a.Lon;
                latitude = parseInt(Lat);
                longitude = parseInt(Lon);
                if (!Name || !Addr || typeof latitude !== 'number' || typeof longitude !== 'number') {
                    return [2 /*return*/, res.status(400).json({
                            success: false,
                            error: 'Invalid input data'
                        })];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, pool.execute('INSERT INTO schoollist (name, address, latitude, longitude) VALUES (?, ?, ?, ?)', [Name, Addr, latitude, longitude])];
            case 2:
                result = (_b.sent())[0];
                res.status(201).json({
                    success: true,
                    message: 'School added successfully',
                });
                return [3 /*break*/, 4];
            case 3:
                error_1 = _b.sent();
                res.status(500).json({
                    success: false,
                    error: 'Database error',
                });
                console.log(error_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.app.get('/addSchool', function (req, res) {
    res.redirect('/');
});
//Function to Calculate the Distance from Latitude and Longitude
function calculateDistance(lat1, lon1, lat2, lon2) {
    var earth_radius = 6371;
    var dLat = (lat2 - lat1) * (Math.PI / 180);
    var dLon = (lon2 - lon1) * (Math.PI / 180);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earth_radius * c;
}
// Defining get method for /SchoolList
exports.app.get('/listSchools', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userLatitude, userLongitude, schools, sortedSchools, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userLatitude = parseFloat(req.query.latitude);
                userLongitude = parseFloat(req.query.longitude);
                if (isNaN(userLatitude) || isNaN(userLongitude)) {
                    return [2 /*return*/, res.status(400).json({
                            success: false,
                            message: 'Invalid latitude or longitude'
                        })];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, pool.execute('SELECT * FROM schoollist')];
            case 2:
                schools = (_a.sent())[0];
                sortedSchools = schools.sort(function (a, b) {
                    var distanceA = calculateDistance(userLatitude, userLongitude, a.latitude, a.longitude);
                    var distanceB = calculateDistance(userLatitude, userLongitude, b.latitude, b.longitude);
                    return distanceA - distanceB;
                });
                res.status(200).json({
                    success: true,
                    message: 'Here Are the List of Schools',
                    SchoolList: sortedSchools
                });
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                res.status(500).json({
                    success: false,
                    message: 'DataBase Error'
                });
                console.log(error_2);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
