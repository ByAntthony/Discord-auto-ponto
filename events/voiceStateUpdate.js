const fs = require('fs');
const path = require('path');
const config = require('../config.json');

const voiceTimeFile = path.join(__dirname, '../data/voiceTime.json');
let voiceTime = require(voiceTimeFile);

module.exports = {
    name: 'voiceStateUpdate',
    async execute(oldState, newState) {
        if (oldState.channelId !== newState.channelId) {
            const userId = newState.id;
            const now = Date.now();

            if (newState.channel) {
                if (config.canais.includes(newState.channel.id) && newState.member.roles.cache.some(role => config.cargos.includes(role.id))) {
                    voiceTime[userId] = voiceTime[userId] || { totalTime: 0, joinedAt: now };
                    voiceTime[userId].joinedAt = now;
                }
            } else {
                if (voiceTime[userId] && voiceTime[userId].joinedAt) {
                    const joinedAt = voiceTime[userId].joinedAt;
                    const duration = (now - joinedAt);
                    voiceTime[userId].totalTime = (voiceTime[userId].totalTime || 0) + duration;
                    delete voiceTime[userId].joinedAt;

                    fs.writeFileSync(voiceTimeFile, JSON.stringify(voiceTime, null, 2));
                }
            }
        }
    },
};