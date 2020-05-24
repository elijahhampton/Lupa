"use strict";
/* Please do not remove this line as it prevents the Cannot Find Variable: Buffer error */
//global.Buffer = global.Buffer || require('buffer').Buffer
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
exports.__esModule = true;
var UserController_1 = require("./UserController");
var PacksController_1 = require("./PacksController");
var SessionController_1 = require("./SessionController");
var ProgramController_1 = require("./ProgramController");
var firebase_js_1 = require("../firebase/firebase.js");
var permissions_1 = require("./permissions/permissions");
/*const algoliasearch = require('algoliasearch/reactnative.js');
const algoliaIndex = algoliasearch("EGZO4IJMQL", "f0f50b25f97f17ed73afa48108d9d7e6");
const packsIndex = algoliaIndex.initIndex("dev_PACKS");
const algoliaUsersIndex = algoliasearch("EGZO4IJMQL", "f0f50b25f97f17ed73afa48108d9d7e6");
const usersIndex = algoliaUsersIndex.initIndex("dev_USERS");*/
var USER_CONTROLLER_INSTANCE;
var PACKS_CONTROLLER_INSTANCE;
var SESSION_CONTROLLER_INSTANCE;
var NOTIFICATIONS_CONTROLLER_INSTANCE;
var PROGRAMS_CONTROLLER_INSTANCE;
var LupaController = /** @class */ (function () {
    function LupaController() {
        var _this = this;
        this.isUserLoggedIn = function () { return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, firebase_js_1.LUPA_AUTH.currentUser];
                    case 1:
                        (_a.sent()) == null ? result = false : result = true;
                        return [2 /*return*/, result];
                }
            });
        }); };
        /***************** Firebase Storage *********** */
        this.saveUserProfileImage = function (imageURI) { return __awaiter(_this, void 0, void 0, function () {
            var url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, USER_CONTROLLER_INSTANCE.saveUserProfileImage(imageURI).then(function (result) {
                            url = result;
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, Promise.resolve(url)];
                }
            });
        }); };
        this.getUserProfileImageFromUUID = function (uuid) { return __awaiter(_this, void 0, void 0, function () {
            var imageURI;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, USER_CONTROLLER_INSTANCE.getUserProfileImageFromUUID(uuid).then(function (result) {
                            imageURI = result;
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, Promise.resolve(imageURI)];
                }
            });
        }); };
        this.savePackImage = function (string, uuid) { return __awaiter(_this, void 0, void 0, function () {
            var url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, PACKS_CONTROLLER_INSTANCE.savePackImage(string, uuid).then(function (data) {
                            url = data;
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, Promise.resolve(url)];
                }
            });
        }); };
        this.savePackEventImage = function (string, uuid) {
            PACKS_CONTROLLER_INSTANCE.savePackEventImage(string, uuid);
        };
        this.getPackImageFromUUID = function (uuid) { return __awaiter(_this, void 0, void 0, function () {
            var link;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, PACKS_CONTROLLER_INSTANCE.getPackImageFromUUID(uuid).then(function (result) {
                            link = result;
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, Promise.resolve(link)];
                }
            });
        }); };
        this.getPackEventImageFromUUID = function (uuid) { return __awaiter(_this, void 0, void 0, function () {
            var link;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, PACKS_CONTROLLER_INSTANCE.getPackEventImageFromUUID(uuid).then(function (result) {
                            link = result;
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, Promise.resolve(link)];
                }
            });
        }); };
        /***************************** */
        /***********  App IO *************/
        this.runAppSetup = function () {
            permissions_1["default"]();
            _this.indexApplicationData();
        };
        this.addLupaTrainerVerificationRequest = function (uuid, certification, cert_number) {
            var certInformation = { uuid: uuid, certification: certification, cert_number: cert_number };
            firebase_js_1["default"].collection('trainer_request').doc(uuid).set(certInformation);
        };
        /********************** */
        this.getNotifications = function () { return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, NOTIFICATIONS_CONTROLLER_INSTANCE.getNotificationsFromUUID(this.getCurrentUser().uid).then(function (res) {
                            result = res;
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, Promise.resolve(result)];
                }
            });
        }); };
        this.addNotification = function (user, date, time, type, data) {
            NOTIFICATIONS_CONTROLLER_INSTANCE.createNotification(user, date, time, type, data);
        };
        this.isUsernameTaken = function (val) { return __awaiter(_this, void 0, void 0, function () {
            var isTaken;
            return __generator(this, function (_a) {
                USER_CONTROLLER_INSTANCE.isUsernameTaken(val).then(function (result) {
                    isTaken = result;
                });
                return [2 /*return*/, Promise.resolve(isTaken)];
            });
        }); };
        this.getCurrentUser = function () {
            var currentUser = USER_CONTROLLER_INSTANCE.getCurrentUser();
            return currentUser;
        };
        this.getCurrentUserData = function () { return __awaiter(_this, void 0, void 0, function () {
            var userData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, USER_CONTROLLER_INSTANCE.getCurrentUserData().then(function (result) {
                            userData = result;
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, Promise.resolve(userData)];
                }
            });
        }); };
        this.getCurrentUserHealthData = function () { return __awaiter(_this, void 0, void 0, function () {
            var healthData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, USER_CONTROLLER_INSTANCE.getCurrentUserHealthData().then(function (result) {
                            healthData = result;
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, Promise.resolve(healthData)];
                }
            });
        }); };
        this.isTrainer = function (userUUID) {
            var isTrainer = USER_CONTROLLER_INSTANCE.isTrainer(userUUID);
            return isTrainer;
        };
        this.updatePack = function (packID, attribute, value, optionalData) {
            if (optionalData === void 0) { optionalData = []; }
            PACKS_CONTROLLER_INSTANCE.updatePack(packID, attribute, value, optionalData);
        };
        this.updatePackEvent = function (eventUUID, attribute, value, optionalData) {
            if (optionalData === void 0) { optionalData = []; }
            PACKS_CONTROLLER_INSTANCE.updatePackEvent(eventUUID, attribute, value, optionalData);
        };
        this.updateCurrentUser = function (fieldToUpdate, value, optionalData) {
            //validate data
            //pass to usercontroller
            USER_CONTROLLER_INSTANCE.updateCurrentUser(fieldToUpdate, value, optionalData);
        };
        this.getUserDisplayName = function () {
            return USER_CONTROLLER_INSTANCE.getUserDisplayName(true);
        };
        this.getUserPhotoURL = function () {
            return USER_CONTROLLER_INSTANCE.getUserPhotoURL(true);
        };
        this.completeSession = function (uuid) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, SESSION_CONTROLLER_INSTANCE.completeSession(uuid)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        this.addUserSessionReview = function (sessionUUID, userReviewingUUID, userToReviewUUID, reviewText, dateSubmitted) { return __awaiter(_this, void 0, void 0, function () {
            var retVal;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, SESSION_CONTROLLER_INSTANCE.addUserSessionReview(sessionUUID, userReviewingUUID, userToReviewUUID, reviewText, dateSubmitted).then(function (res) {
                            retVal = res;
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, Promise.resolve(retVal)];
                }
            });
        }); };
        this.createNewSession = function (attendeeOne, attendeeTwo, requesterUUID, date, time_periods, name, description, timestamp, locationData) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, SESSION_CONTROLLER_INSTANCE.createSession(attendeeOne, attendeeTwo, requesterUUID, date, time_periods, name, description, timestamp, locationData)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        this.getUserSessions = function (currUser, uid) {
            if (currUser === void 0) { currUser = true; }
            if (uid === void 0) { uid = undefined; }
            return SESSION_CONTROLLER_INSTANCE.getUserSessions(currUser, uid);
        };
        this.getUserInformationFromArray = function (arrOfUUIDS) { return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, USER_CONTROLLER_INSTANCE.getArrayOfUserObjectsFromUUIDS(arrOfUUIDS).then(function (objs) {
                            result = objs;
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, result];
                }
            });
        }); };
        this.getAttributeFromUUID = function (uuid, attribute) { return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, USER_CONTROLLER_INSTANCE.getAttributeFromUUID(uuid, attribute).then(function (res) {
                            result = res;
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, result];
                }
            });
        }); };
        this.getUUIDFromDisplayName = function (displayName) { return __awaiter(_this, void 0, void 0, function () {
            var result, userUUID;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, USER_CONTROLLER_INSTANCE.getUserInformationFromDisplayName(displayName).then(function (snapshot) {
                            result = snapshot.data();
                        })];
                    case 1:
                        _a.sent();
                        userUUID = result.uid;
                        return [2 /*return*/, userUUID];
                }
            });
        }); };
        /********************** */
        /* Algolia */
        this.indexApplicationData = function () {
            //USER_CONTROLLER_INSTANCE.indexUsersIntoAlgolia();
            //PACKS_CONTROLLER_INSTANCE.indexPacksIntoAlgolia();
            //USER_CONTROLLER_INSTANCE.indexProgramsIntoAlgolia();
        };
        this.indexUsers = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        }); };
        this.indexPacks = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        }); };
        this.indexPrograms = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        }); };
        /** Pack Functions */
        this.createNewPack = function (packLeader, title, description, location, image, members, invitedMembers, rating, sessionsCompleted, timeCreated, isSubscription, isDefault, packImageSource) { return __awaiter(_this, void 0, void 0, function () {
            var packData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, PACKS_CONTROLLER_INSTANCE.createPack(packLeader, title, description, location, image, members, invitedMembers, rating, sessionsCompleted, timeCreated, isSubscription, isDefault, packImageSource)];
                    case 1:
                        packData = _a.sent();
                        return [2 /*return*/, Promise.resolve(packData)];
                }
            });
        }); };
        this.createNewPackEvent = function (packUUID, title, description, date, eventImage) { return __awaiter(_this, void 0, void 0, function () {
            var payload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    //call pack controller to create new event
                    return [4 /*yield*/, PACKS_CONTROLLER_INSTANCE.createPackEvent(packUUID, title, description, date, eventImage).then(function (data) {
                            payload = data;
                        })];
                    case 1:
                        //call pack controller to create new event
                        _a.sent();
                        return [2 /*return*/, Promise.resolve(payload)];
                }
            });
        }); };
        this.inviteUserToPacks = function (packs, userUUID) {
            //If the user didn't select any packs then there is no work to be done and we can just exit the function
            if (packs.length == 0) {
                return;
            }
            PACKS_CONTROLLER_INSTANCE.inviteUserToPacks(packs, userUUID);
        };
        this.getSubscriptionPacksBasedOnLocation = function (location) { return __awaiter(_this, void 0, void 0, function () {
            var subscriptionBasedPacks;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, PACKS_CONTROLLER_INSTANCE.getSubscriptionPacksBasedOnLocation(location).then(function (result) {
                            subscriptionBasedPacks = result;
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, Promise.resolve(subscriptionBasedPacks)];
                }
            });
        }); };
        /* User Functions */
        this.getTrainersBasedOnLocation = function (location) { return __awaiter(_this, void 0, void 0, function () {
            var trainersNearby;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, USER_CONTROLLER_INSTANCE.getNearbyTrainers(location).then(function (result) {
                            trainersNearby = result;
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, Promise.resolve(trainersNearby)];
                }
            });
        }); };
        this.getUsersBasedOnLocation = function (location) { return __awaiter(_this, void 0, void 0, function () {
            var nearbyUsers;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, USER_CONTROLLER_INSTANCE.getNearbyUsers(location).then(function (result) {
                            nearbyUsers = result;
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, Promise.resolve(nearbyUsers)];
                }
            });
        }); };
        this.getUserInformationByUUID = function (uuid) { return __awaiter(_this, void 0, void 0, function () {
            var userResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, USER_CONTROLLER_INSTANCE.getUserInformationByUUID(uuid).then(function (result) {
                            userResult = result;
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, Promise.resolve(userResult)];
                }
            });
        }); };
        this.getPackInformationByUserUUID = function (uuid) { return __awaiter(_this, void 0, void 0, function () {
            var userResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, PACKS_CONTROLLER_INSTANCE.getPackInformationByUserUUID(uuid).then(function (result) {
                            userResult = result;
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, Promise.resolve(userResult)];
                }
            });
        }); };
        /**
         *
         */
        this.searchPrograms = function (searchQuery) { return __awaiter(_this, void 0, void 0, function () {
            var retVal;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        retVal = [];
                        console.log(searchQuery);
                        return [4 /*yield*/, USER_CONTROLLER_INSTANCE.searchPrograms(searchQuery).then(function (result) {
                                retVal = result;
                            })];
                    case 1:
                        _a.sent();
                        console.log('and here: ' + retVal.length);
                        return [2 /*return*/, Promise.resolve(retVal)];
                }
            });
        }); };
        /**
         * search
         * Performs search queries on all indices through algolia
         * @param searchQuery The query to search for
         * @return returns a promise with an array of objects that matched the query.
         *
         * TODO: Save only necessary information into an object before pushing into final results array.
         */
        this.search = function (searchQuery) {
            /* let finalResults = new Array();
       
             const queries = [{
               indexName: 'dev_USERS',
               query: searchQuery,
               params: {
                 hitsPerPage: 10
               }
             }, {
               indexName: 'dev_PACKS',
               query: searchQuery,
               params: {
                 hitsPerPage: 10,
               }
             }];
       
             return new Promise((resolve, rejects) => {
                       // perform 3 queries in a single API
                       let finalResults = new Array();
             //  - 1st query targets index `categories`
             //  - 2nd and 3rd queries target index `products`
             algoliaIndex.search(queries, (err, { results = {}}) => {
               if (err) rejects(err);
             
               const userResults = results[0];
               const packResults = results[1];
       
               try {
                         //add the results we want from each into our final results array
               for (let i = 0; i < userResults.hits.length; ++i)
               {
                 userResults.hits[i].isTrainer == true ?  userResults.hits[i].resultType="trainer" :  userResults.hits[i].resultType="user"
                 if (userResults.hits[i]._highlightResult.display_name.matchLevel == "full" || userResults.hits[i]._highlightResult.username.matchLevel == "full"
                 || userResults.hits[i]._highlightResult.email.matchLevel == "full")
                 {
                   finalResults.push(userResults.hits[i]);
                 }
               }
       
               for (let i = 0; i < packResults.hits.length; ++i)
               {
                 packResults.hits[i].resultType = "pack"
                 if (packResults.hits[i]._highlightResult.pack_title.matchLevel == "full")
                 {
                   finalResults.push(packResults.hits[i]);
                 }
               }
               } catch(err)
               {
                 
               }
       
               resolve(finalResults);
             });
             })*/
        };
        this.followUser = function (uuidOfUserToFollow, uuidOfUserFollowing) {
            USER_CONTROLLER_INSTANCE.followAccountFromUUID(uuidOfUserToFollow, uuidOfUserFollowing);
            USER_CONTROLLER_INSTANCE.addFollowerToUUID(uuidOfUserToFollow, uuidOfUserFollowing);
        };
        this.unfollowUser = function (uuidofUserToUnfollow, uuidOfUserUnfollowing) {
            USER_CONTROLLER_INSTANCE.unfollowAccountFromUUID(uuidofUserToUnfollow, uuidOfUserUnfollowing);
            USER_CONTROLLER_INSTANCE.removeFollowerFromUUID(uuidofUserToUnfollow, uuidOfUserUnfollowing);
        };
        this.getAllTrainers = function () { return __awaiter(_this, void 0, void 0, function () {
            var trainers;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, USER_CONTROLLER_INSTANCE.getTrainers().then(function (result) {
                            trainers = result;
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, Promise.resolve(trainers)];
                }
            });
        }); };
        /* Session Functions */
        this.getSessionInformationByUUID = function (uuid) { return __awaiter(_this, void 0, void 0, function () {
            var retVal;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, SESSION_CONTROLLER_INSTANCE.getSessionInformationByUUID(uuid).then(function (result) {
                            retVal = result;
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, retVal];
                }
            });
        }); };
        this.updateSession = function (uuid, fieldToUpdate, value, optionalData) {
            if (optionalData === void 0) { optionalData = ""; }
            return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, SESSION_CONTROLLER_INSTANCE.updateSessionFieldByUUID(uuid, fieldToUpdate, value, optionalData)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        /* Pack Functions */
        /***************************Explore Page Pack Function  ****************************/
        this.getActivePacksBasedOnLocation = function (location) { return __awaiter(_this, void 0, void 0, function () {
            var explorePagePacks;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, PACKS_CONTROLLER_INSTANCE.getActivePacksBasedOnLocation(location).then(function (result) {
                            explorePagePacks = result;
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, Promise.resolve(explorePagePacks)];
                }
            });
        }); };
        this.getCommunityPacksBasedOnLocation = function (location) { return __awaiter(_this, void 0, void 0, function () {
            var explorePagePacks;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, PACKS_CONTROLLER_INSTANCE.getCommunityPacksBasedOnLocation(location).then(function (result) {
                            explorePagePacks = result;
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, Promise.resolve(explorePagePacks)];
                }
            });
        }); };
        /***********************************************************************************/
        this.getCurrentUserPacks = function () { return __awaiter(_this, void 0, void 0, function () {
            var userPacks;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    //Get all packs for the current user
                    return [4 /*yield*/, PACKS_CONTROLLER_INSTANCE.getCurrentUserPacks().then(function (currUserPacksData) {
                            userPacks = currUserPacksData;
                        })];
                    case 1:
                        //Get all packs for the current user
                        _a.sent();
                        return [2 /*return*/, userPacks];
                }
            });
        }); };
        this.getSubscriptionPacks = function () { return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, PACKS_CONTROLLER_INSTANCE.getSubscriptionBasedPacks().then(function (packs) {
                            result = packs;
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, result];
                }
            });
        }); };
        this.getExplorePagePacks = function () { return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, PACKS_CONTROLLER_INSTANCE.getExplorePagePacks().then(function (packs) {
                            result = packs;
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, result];
                }
            });
        }); };
        this.getDefaultPacks = function () { return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, PACKS_CONTROLLER_INSTANCE.getDefaultPacks().then(function (packs) {
                            result = packs;
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, result];
                }
            });
        }); };
        this.getCurrentUserDefaultPacks = function () { return __awaiter(_this, void 0, void 0, function () {
            var defaultPacks;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        defaultPacks = [];
                        return [4 /*yield*/, PACKS_CONTROLLER_INSTANCE.getCurrentUserDefaultPacks().then(function (result) {
                                defaultPacks = result;
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, Promise.resolve(defaultPacks)];
                }
            });
        }); };
        this.requestToJoinPack = function (userUUID, packUUID) {
            PACKS_CONTROLLER_INSTANCE.requestToJoinPack(userUUID, packUUID);
        };
        this.acceptPackInviteByPackUUID = function (packUUID, userUUID) {
            PACKS_CONTROLLER_INSTANCE.acceptPackInviteByPackUUID(packUUID, userUUID);
        };
        this.declinePackInviteByPackUUID = function (packUUID, userUUID) {
            PACKS_CONTROLLER_INSTANCE.declinePackInviteByPackUUID(packUUID, userUUID);
        };
        this.getPackInvitesFromUUID = function (uuid) { return __awaiter(_this, void 0, void 0, function () {
            var packInvites;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        packInvites = [];
                        return [4 /*yield*/, PACKS_CONTROLLER_INSTANCE.getPackInvitesFromUUID(uuid).then(function (result) {
                                packInvites = result;
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, Promise.resolve(packInvites)];
                }
            });
        }); };
        this.getPackInformationByUUID = function (uuid) { return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        result = [];
                        return [4 /*yield*/, PACKS_CONTROLLER_INSTANCE.getPackInformationByUUID(uuid).then(function (packs) {
                                result = packs;
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, Promise.resolve(result)];
                }
            });
        }); };
        this.getPackEventsByUUID = function (id) { return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        result = new Array();
                        if (!(id != undefined)) return [3 /*break*/, 2];
                        return [4 /*yield*/, PACKS_CONTROLLER_INSTANCE.getPackEventsByUUID(id).then(function (packs) {
                                result = packs;
                            })];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/, Promise.resolve(result)];
                }
            });
        }); };
        this.removeUserFromPackByUUID = function (packUUID, userUUID) {
            PACKS_CONTROLLER_INSTANCE.removeUserFromPackByUUID(packUUID, userUUID);
        };
        this.setUserAsAttendeeForEvent = function (packEventUUID, packEventTitle, userUUID) {
            PACKS_CONTROLLER_INSTANCE.attendPackEvent(packEventUUID, packEventTitle, userUUID);
        };
        this.removeUserAsAttendeeForEvent = function (packEventUUID, packEventTitle, userUUID) {
            PACKS_CONTROLLER_INSTANCE.unattendPackEvent(packEventUUID, packEventTitle, userUUID);
        };
        this.userIsAttendingPackEvent = function (packEventUUID, packEventTitle, userUUID) { return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, PACKS_CONTROLLER_INSTANCE.isAttendingPackEvent(packEventUUID, packEventTitle, userUUID).then(function (bool) {
                            result = bool;
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, Promise.resolve(result)];
                }
            });
        }); };
        this.getPacksEventsFromArrayOfUUIDS = function (arr) { return __awaiter(_this, void 0, void 0, function () {
            var packEventsData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, PACKS_CONTROLLER_INSTANCE.getPacksEventsFromArrayOfUUIDS(arr).then(function (result) {
                            packEventsData = result;
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, Promise.resolve(packEventsData)];
                }
            });
        }); };
        /** Goals **/
        this.addGoalForCurrentUser = function (goalUUID) {
            USER_CONTROLLER_INSTANCE.updateCurrentUser('goals', goalUUID, 'add');
        };
        this.removeGoalForCurrentUser = function (goalUUID) {
            USER_CONTROLLER_INSTANCE.updateCurrentUser('goals', goalUUID, 'remove');
        };
        this.createNewProgram = function (uuid) { return __awaiter(_this, void 0, void 0, function () {
            var programStructurePayload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, USER_CONTROLLER_INSTANCE.createProgram(uuid).then(function (result) {
                            programStructurePayload = result;
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, Promise.resolve(programStructurePayload)];
                }
            });
        }); };
        this.saveProgram = function (user_uuid, programUUID) { return __awaiter(_this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, USER_CONTROLLER_INSTANCE.saveProgram(user_uuid, programUUID).then(function (result) {
                            res = result;
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, Promise.resolve(res)];
                }
            });
        }); };
        this.handleSendUserProgram = function (currUserUUID, currUserData, currUserDisplayName, userList, program) {
            try {
                USER_CONTROLLER_INSTANCE.handleSendUserProgram(currUserUUID, currUserData, currUserDisplayName, userList, program);
            }
            catch (err) {
            }
        };
        this.deleteProgram = function (user_uuid, programUUID) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, USER_CONTROLLER_INSTANCE.deleteProgram(user_uuid, programUUID)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        this.createService = function (serviceObject) {
            USER_CONTROLLER_INSTANCE.createService(serviceObject);
        };
        this.loadCurrentUserPrograms = function () { return __awaiter(_this, void 0, void 0, function () {
            var programsData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, USER_CONTROLLER_INSTANCE.loadCurrentUserPrograms().then(function (result) {
                            programsData = result;
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, Promise.resolve(programsData)];
                }
            });
        }); };
        this.loadCurrentUserServices = function () { return __awaiter(_this, void 0, void 0, function () {
            var servicesData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, USER_CONTROLLER_INSTANCE.loadCurrentUserServices().then(function (result) {
                            servicesData = result;
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, Promise.resolve(servicesData)];
                }
            });
        }); };
        this.loadWorkouts = function () { return __awaiter(_this, void 0, void 0, function () {
            var workoutData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, PROGRAMS_CONTROLLER_INSTANCE.loadWorkouts().then(function (result) {
                            workoutData = result;
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, Promise.resolve(workoutData)];
                }
            });
        }); };
        this.loadAssessments = function () { return __awaiter(_this, void 0, void 0, function () {
            var assessments;
            return __generator(this, function (_a) {
                assessments = [];
                firebase_js_1["default"].collection('lupa_data')
                    .doc('lupa_assessment')
                    .collection('assessments')
                    .get()
                    .then(function (docs) {
                    docs.forEach(function (docSnapshot) {
                        var snapshot = docSnapshot.data();
                        assessments.push(snapshot);
                    });
                })["catch"](function (err) {
                    return Promise.resolve([]);
                });
                return [2 /*return*/, Promise.resolve(assessments)];
            });
        }); };
        this.getPrivateChatUUID = function (currUserUUID, userTwo) { return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, USER_CONTROLLER_INSTANCE.getPrivateChatUUID(currUserUUID, userTwo).then(function (chatUUID) {
                            result = chatUUID;
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, Promise.resolve(result)];
                }
            });
        }); };
        this.getAllCurrentUserChats = function () { return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, USER_CONTROLLER_INSTANCE.getAllCurrentUserChats().then(function (chats) {
                            result = chats;
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, Promise.resolve(result)];
                }
            });
        }); };
        this.getSuggestedTrainers = function () { return __awaiter(_this, void 0, void 0, function () {
            var suggestedTrainers;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, SESSION_CONTROLLER_INSTANCE.getSuggestedTrainers().then(function (trainers) {
                            suggestedTrainers = trainers;
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, Promise.resolve(suggestedTrainers)];
                }
            });
        }); };
        this.getUpcomingSessions = function (isCurrentUser, user_uuid) { return __awaiter(_this, void 0, void 0, function () {
            var upcomingSessions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, SESSION_CONTROLLER_INSTANCE.getUpcomingSessions(true, user_uuid).then(function (sessions) {
                            upcomingSessions = sessions;
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, Promise.resolve(upcomingSessions)];
                }
            });
        }); };
        this.submitAssessment = function (assessmentObject) { return __awaiter(_this, void 0, void 0, function () {
            var currUser, assessment_uuid;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, USER_CONTROLLER_INSTANCE.getCurrentUserUUID()];
                    case 1:
                        currUser = _a.sent();
                        assessmentObject.user_uuid = currUser;
                        assessmentObject.complete = 'true';
                        assessment_uuid = assessmentObject.assessment_acronym + "_" + currUser;
                        //add assessment to database and get assessment document ID
                        return [4 /*yield*/, firebase_js_1["default"].collection('assessments').doc(assessment_uuid).set(assessmentObject)];
                    case 2:
                        //add assessment to database and get assessment document ID
                        _a.sent();
                        //pass to user controller to add assessment id for user
                        return [4 /*yield*/, USER_CONTROLLER_INSTANCE.addAssessment(assessment_uuid)];
                    case 3:
                        //pass to user controller to add assessment id for user
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        this.getUserAssessment = function (acronym, user_uuid) { return __awaiter(_this, void 0, void 0, function () {
            var assessment;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, USER_CONTROLLER_INSTANCE.getUserAssessment(acronym, user_uuid).then(function (result) {
                            assessment = result;
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, Promise.resolve(assessment)];
                }
            });
        }); };
        /* designing programs */
        this.saveProgramWorkoutGraphic = function (workout, programUUID, graphicType, uri) { return __awaiter(_this, void 0, void 0, function () {
            var newURI;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, USER_CONTROLLER_INSTANCE.saveProgramWorkoutGraphic(workout, programUUID, graphicType, uri).then(function (res) {
                            newURI = res;
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, Promise.resolve(newURI)];
                }
            });
        }); };
        this.getUserNotifications = function () { return __awaiter(_this, void 0, void 0, function () {
            var queue;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, USER_CONTROLLER_INSTANCE.getUserNotificationsQueue().then(function (queueResults) {
                            queue = queueResults;
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, Promise.resolve(queue)];
                }
            });
        }); };
        this.getFeaturedPrograms = function () { return __awaiter(_this, void 0, void 0, function () {
            var retVal;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, USER_CONTROLLER_INSTANCE.getFeaturedPrograms().then(function (result) {
                            retVal = result;
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, Promise.resolve(retVal)];
                }
            });
        }); };
        this.purchaseProgram = function (currUserData, programData) { return __awaiter(_this, void 0, void 0, function () {
            var updatedProgram;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, USER_CONTROLLER_INSTANCE.purchaseProgram(currUserData, programData).then(function (retVal) {
                            updatedProgram = retVal;
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        USER_CONTROLLER_INSTANCE = UserController_1["default"].getInstance();
        PACKS_CONTROLLER_INSTANCE = PacksController_1["default"].getInstance();
        SESSION_CONTROLLER_INSTANCE = SessionController_1["default"].getInstance();
        PROGRAMS_CONTROLLER_INSTANCE = ProgramController_1["default"].getInstance();
    }
    LupaController.getInstance = function () {
        if (!LupaController._instance) {
            LupaController._instance = new LupaController();
            return LupaController._instance;
        }
        return LupaController._instance;
    };
    LupaController.notifications = [];
    return LupaController;
}());
exports["default"] = LupaController;
