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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
exports.__esModule = true;
var SpotifyWebApi = require('spotify-web-api-node');
var express = require('express');
var router = express.Router();
var spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: "http://localhost:3000/"
});
router.get('/api/login', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var scopes, html;
    return __generator(this, function (_a) {
        scopes = [
            'playlist-modify-public',
            'playlist-modify-private',
            'playlist-read-private',
            'playlist-read-collaborative',
        ];
        try {
            html = spotifyApi.createAuthorizeURL(scopes, 'state', true);
            res.send(html);
        }
        catch (e) {
            console.error(e);
        }
        return [2 /*return*/];
    });
}); });
router.post('/api/authorize', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var code;
    return __generator(this, function (_a) {
        code = req.body.code;
        spotifyApi.authorizationCodeGrant(code).then(function (data) {
            spotifyApi.setAccessToken(data.body.access_token);
            spotifyApi.setRefreshToken(data.body.refresh_token);
            res.send({
                access_token: data.body.access_token,
                refresh_token: data.body.refresh_token
            });
        })["catch"](function (err) {
            console.log(err);
        });
        return [2 /*return*/];
    });
}); });
function refreshAccessToken(refresh_token) {
    return __awaiter(this, void 0, void 0, function () {
        var body;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Refreshing access token!");
                    return [4 /*yield*/, spotifyApi.setRefreshToken(refresh_token)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, spotifyApi.refreshAccessToken()];
                case 2:
                    body = (_a.sent()).body;
                    return [4 /*yield*/, spotifyApi.setAccessToken(body.access_token)];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
router.get('/api/getProfile', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var refreshToken;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("====\tGetting profile");
                refreshToken = req.query.refreshToken;
                return [4 /*yield*/, refreshAccessToken(refreshToken)];
            case 1:
                _a.sent();
                spotifyApi.getMe().then(function (response) {
                    var profile = {
                        name: response.body.display_name,
                        image: response.body.images[0].url,
                        uri: response.body.uri
                    };
                    res.send(profile);
                });
                return [2 /*return*/];
        }
    });
}); });
function findSpotifyTrack(song) {
    var e_1, _a;
    return __awaiter(this, void 0, void 0, function () {
        var songDetails, artists, title, artists_1, artists_1_1, artist, searchQuery, tracks, e_1_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    songDetails = song.split(' - ');
                    artists = songDetails[0].trim().split(/[&;\/(feat.)]/);
                    if (songDetails[1]) {
                        title = songDetails[1].trim().split(/(feat)|(ft)|(prod)|[(]/gi)[0].split("\'").join("");
                    }
                    else {
                        title = "";
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 7, 8, 13]);
                    artists_1 = __asyncValues(artists);
                    _b.label = 2;
                case 2: return [4 /*yield*/, artists_1.next()];
                case 3:
                    if (!(artists_1_1 = _b.sent(), !artists_1_1.done)) return [3 /*break*/, 6];
                    artist = artists_1_1.value;
                    artist = artist.split("\'").join("");
                    return [4 /*yield*/, spotifyApi.searchTracks("track:" + title + " artist:" + artist)];
                case 4:
                    searchQuery = _b.sent();
                    if (searchQuery === null || searchQuery === void 0 ? void 0 : searchQuery.body.tracks.items.length) {
                        tracks = searchQuery.body.tracks.items;
                        return [2 /*return*/, tracks[0]];
                    }
                    _b.label = 5;
                case 5: return [3 /*break*/, 2];
                case 6: return [3 /*break*/, 13];
                case 7:
                    e_1_1 = _b.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 13];
                case 8:
                    _b.trys.push([8, , 11, 12]);
                    if (!(artists_1_1 && !artists_1_1.done && (_a = artists_1["return"]))) return [3 /*break*/, 10];
                    return [4 /*yield*/, _a.call(artists_1)];
                case 9:
                    _b.sent();
                    _b.label = 10;
                case 10: return [3 /*break*/, 12];
                case 11:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 12: return [7 /*endfinally*/];
                case 13: return [2 /*return*/];
            }
        });
    });
}
router.post('/api/searchSongs', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var notFoundSongs, tracks, songList, tokens, songList_1, songList_1_1, song, track, e_2_1;
    var e_2, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                console.log("====\tSearching songs");
                notFoundSongs = [];
                tracks = [];
                songList = req.body.songs;
                tokens = req.body.tokens;
                return [4 /*yield*/, refreshAccessToken(tokens.refresh_token)];
            case 1:
                _b.sent();
                _b.label = 2;
            case 2:
                _b.trys.push([2, 8, 9, 14]);
                songList_1 = __asyncValues(songList);
                _b.label = 3;
            case 3: return [4 /*yield*/, songList_1.next()];
            case 4:
                if (!(songList_1_1 = _b.sent(), !songList_1_1.done)) return [3 /*break*/, 7];
                song = songList_1_1.value;
                return [4 /*yield*/, findSpotifyTrack(song.title)];
            case 5:
                track = _b.sent();
                // If there's no song, decrement total song count
                if (track === undefined) {
                    notFoundSongs.push(song);
                }
                else {
                    tracks.push(track);
                }
                _b.label = 6;
            case 6: return [3 /*break*/, 3];
            case 7: return [3 /*break*/, 14];
            case 8:
                e_2_1 = _b.sent();
                e_2 = { error: e_2_1 };
                return [3 /*break*/, 14];
            case 9:
                _b.trys.push([9, , 12, 13]);
                if (!(songList_1_1 && !songList_1_1.done && (_a = songList_1["return"]))) return [3 /*break*/, 11];
                return [4 /*yield*/, _a.call(songList_1)];
            case 10:
                _b.sent();
                _b.label = 11;
            case 11: return [3 /*break*/, 13];
            case 12:
                if (e_2) throw e_2.error;
                return [7 /*endfinally*/];
            case 13: return [7 /*endfinally*/];
            case 14:
                res.send({ tracks: tracks, notFoundSongs: notFoundSongs });
                return [2 /*return*/];
        }
    });
}); });
exports["default"] = router;
