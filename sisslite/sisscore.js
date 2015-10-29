"use strict";

/**
 * @global
 */
global.events = require('events');
/**
 * @global
 */
global.eventEmitter =  new events.EventEmitter();


/**
 * SISSCore object available for all. Provides tools for packages
 *
 * @author Cesar Casas
 * @namespace
 * @since 1.4
 */


module.exports=function(app){

    return {

        /**
         * Save event with callback(function to run once that event its fired)
         * @param  {string}   evt      event name. When this happened, callback is fired
         * @param  {Function} callback funciton to run when event its invoked
         * @return {Object}            return eventEmitter, so calls can be chained
         */
        on: function (evt, callback) {
            return eventEmitter.on(evt, callback);
        },

        Caronte: require(__droot__ + "/sisslite/lib/Caronte/index"),
        Class: require(__droot__ + '/sisslite/lib/Class'),

        defineGetter: function (obj, property, call) {
            Object.defineProperty(obj, property, {
                get: call
            });
        },
        require: function (packName, version) {
            var version = version || '*';

            try {
                return require(packName);
            } catch (e) {
                console.log("Error, cant load ", packName);
            }//end catch
        },
        /**
         * fire all registered events into params. This method receive all events that you want to run
         *
         * @memberOf SISSCore
         * @method emit
         */
        emit: function () {
            var args = [];
            for (var x = 0; x < arguments.length; x++) args.push(arguments[x]);

            if (args.length == 0) return;
            if (args.length == 1)    eventEmitter.emit(args[0]);
            else {
                var evt = args[0];
                args.shift();
                eventEmitter.emit(evt, args);
            }
        },
        /**
         * log errors
         * @param  string str error message
         */
        err: function (str) {
            console.log(str);
        },

        /**
         * show any message
         * @param  string str message
         */
        log: function (str) {
            console.log(str);
        },


        /**
         * Send response data(json or string) by express. Can use if you need response an api service.
         * @memberOf SISSCore
         * @method json
         * @param  {Object | string} data data to response
         * @param  {Object} res  Response object from express.js
         */
        json: function (data, res, mws) {
            var compress = res.compress || false;
            var mws = mws || {};
            var req = res.req || {};

            if (compress) {
                res.send(data);

            } else {
                res.json(data);
            }//end else compress

        },
        /**
         * Send response string by express. Useful for messages
         * @memberOf SISSCore
         * @method send
         * @param  {string} data string to send by http/s
         * @param  {Object} res  response object from express.js
         */
        send: function (data, res) {
            var mws = mws || {};
            res.send(data);
        },
        cross: function (req, res, next) {

            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
            res.setHeader('Access-Control-Allow-Credentials', true);


            next();
        },


        /**
         * Fix the req.ip for proxys
         * @param req
         * @param res
         * @param next
         */
        realip: function (req, res, next) {

            if (req.headers && req.headers['x-forwarded-for']) {
                var parts = req.headers['x-forwarded-for'].split(",");
                req.realip = parts[0];
            } else {
                req.realip = req.ip;
            }

            next();
        },


        /**
         * @callback SISSCore~requestCallback
         * function to run after http request
         * @param {Object} err error object
         * @param {Object} res response object from request
         */
        /**
         * SISSCore Request Method. Use this for all http/s request into any package.
         * @memberOf SISSCore
         * @method request
         * @param {Object} RequestOptions Params for http/s request
         * @param {string} RequestOptions.json if you need do a request with a entire json. Use this property
         * @param {string} RequestOptions.data if you need do a request with a entire xml o json string. Use this property
         * @param {string} RequestOptions.host host API url (without service invocation)
         * @param {string} RequestOptions.path service url (build with params if you need)
         * @param {string} RequestOptions.method HTTP method (GET,POST,etc)
         * @param {string} RequestOptions.typeprotocol http or https
         * @param {Object} RequestOptions.headers headers for request
         * @param {string} RequestOptions.headers.Accept Content-Type. Example: application/json, application/xml
         * @param {string} RequestOptions.headers.Accept-Encoding 'gzip, deflate
         * @param {string} RequestOptions.headers.X-ApiKey api key in order to validate request to api
         * @param  {SISSCore~requestCallback} callback   callback to run after response
         */
        request: function (RequestOptions, callback) {
            Logs.debug("SISSCore.Request: ", 2);
            Logs.debug(RequestOptions, 2);
            var http = require('http');
            var https = require('https');
            var zlib = require('zlib');

            var stream = function () {
                this.str = "";
                this.data = function (e) {
                };
                this.end = function () {
                    callback(null, this.str);
                };
                this.on = function (a, b) {
                }
                this.once = function (a, b) {
                }
                this.emit = function (a, b) {
                }
                this.write = function (buff) {
                    this.str += buff.toString();
                };
                this.error = function (e) {
                    console.log('error stream gzip: ');
                }
            };

            var cb = function (response) {
                if (typeof _debug !== "undefined" && _debug === true) {

                    Logs.debug("statusCode:", 2);
                    Logs.debug(response.statusCode, 2);

                    Logs.debug("headers:", 2)
                    Logs.debug(response.headers, 2);
                }

                switch (response.headers['content-encoding']) {

                    case 'gzip':
                        response.pipe(zlib.createGunzip()).pipe(new stream());
                        break;

                    case 'deflate':
                        response.pipe(zlib.createInflate()).pipe(new stream());
                        break;

                    default:
                        response.pipe(new stream());
                        break;
                }//end switch

            };//end callback

            var jstring = "";
            var typeprotocol = RequestOptions.typeprotocol || 'http';

            RequestOptions.headers = RequestOptions.headers || {};

            /**
             * Pidieron JSON, a darle atomos
             */
            if ("json" in RequestOptions) {

                jstring = JSON.stringify(RequestOptions.json);

                RequestOptions.headers['Content-Type'] = 'application/json',
                    RequestOptions.headers['Content-Length'] = Buffer.byteLength(jstring, 'utf8');
            }//end if json

            /**
             * post xml/json
             */
            if ("data" in RequestOptions) {
                jstring = RequestOptions.data;

                RequestOptions.headers['Content-Length'] = Buffer.byteLength(jstring, 'utf8');
            }


            if (typeprotocol == 'http') {
                //Default por http
                RequestOptions.port = RequestOptions.port || 80;

                var r = new http.request(RequestOptions, cb);
                if ("json" in RequestOptions) r.write(jstring);

                if ("data" in RequestOptions) r.write(jstring);
                r.end();

            }//es http
            else {

                //default port https
                RequestOptions.port = RequestOptions.port || 443;

                var r = new https.request(RequestOptions, cb);

                if ("json" in RequestOptions) r.write(jstring);

                if ("data" in RequestOptions) r.write(jstring);
                r.end();

            }//end else protocol

            r.on('response', function (r) {

            }).on('error', function (e) {
                callback(e, e);
            });

        }


    }//end sisscore return
};




