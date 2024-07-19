const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const voiceTimeFile = path.join(__dirname, '../data/voiceTime.json');
const voiceTime = require(voiceTimeFile);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('horas')
        .setDescription('Ver suas horas em call'),
    async execute(interaction) {
        const userId = interaction.user.id;
        const userData = voiceTime[userId];
        
        if (!userData || userData.totalTime === undefined) {
        await interaction.reply({ content: 'Você ainda não passou tempo suficiente em call.', ephemeral: true });
            return;
        }
        
     
        const totalTimeMilliseconds = userData.totalTime;
        const totalSeconds = Math.floor(totalTimeMilliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);

        
        let formattedTime = `${hours} horas`;
        if (minutes > 0) {
            formattedTime += ` e ${minutes} minutos`;
        }

        await interaction.reply({ content: `Você passou ${formattedTime} em call.`, ephemeral: true });
    },
};
