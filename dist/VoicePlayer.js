'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _immutable = require('immutable');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var VoicePlayer = function () {
    function VoicePlayer(client) {
        _classCallCheck(this, VoicePlayer);

        this.soundQueue = (0, _immutable.Map)();
        this.client = client;
    }

    _createClass(VoicePlayer, [{
        key: 'play',
        value: function play(message, fileName) {
            var _this = this;

            if (!message.member.voiceChannel) {
                return;
            }
            if (message.member.voiceChannel.connection) {
                this.playSound(message.guild.id, message.member.voiceChannel.connection, fileName);
            } else {
                message.member.voiceChannel.join().then(function (connection) {
                    _this.playSound(message.guild.id, connection, fileName);
                }, function (err) {
                    console.error(err);
                });
            }
        }
    }, {
        key: 'multiPlay',
        value: function multiPlay(message, command) {
            var fileName = command.filePrefix + Math.floor(Math.random() * command.count) + command.fileSuffix;
            this.play(message, fileName);
        }
    }, {
        key: 'playSound',
        value: function (_playSound) {
            function playSound(_x, _x2, _x3) {
                return _playSound.apply(this, arguments);
            }

            playSound.toString = function () {
                return _playSound.toString();
            };

            return playSound;
        }(function (guildId, connection, fileName) {
            var _this2 = this;

            if (connection.speaking === true) {
                this.soundQueue = this.soundQueue.update(guildId, (0, _immutable.List)(), function (list) {
                    return list.push((0, _immutable.Map)({ message: message, fileName: fileName }));
                });
            } else {
                connection.playFile(_path2.default.join(__dirname, '..', 'sounds', fileName)).on('end', function () {
                    if (!_this2.soundQueue.has(guildId)) {
                        connection.disconnect();
                    } else {
                        nextSound = _this2.soundQueue.get(guildId).first();
                        _this2.soundQueue = _this2.soundQueue.update(guildId, function (list) {
                            return list.shift();
                        });

                        if (_this2.soundQueue.get(guildId).isEmpty()) {
                            _this2.soundQueue.delete(guildId);
                        }
                        playSound(nextSound.get('message'), nextSound.get('fileName'));
                    }
                });
            }
        })
    }]);

    return VoicePlayer;
}();

exports.default = VoicePlayer;