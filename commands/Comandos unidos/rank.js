const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = './data/voiceTime.json';
const config = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rank')
        .setDescription('Mostra o ranking de tempo total dos usuários'),
    async execute(interaction) {
        if (!interaction.member.roles.cache.has(config.adminRoleId)) {
            return interaction.reply({ content: 'Você não tem permissão para usar este comando.', ephemeral: true });
        }

        const voiceTime = JSON.parse(fs.readFileSync(path, 'utf8'));
        const userTimes = {};

        for (const [userId, data] of Object.entries(voiceTime)) {
            userTimes[userId] = data.totalTime || 0;
        }

        const sortedUserTimes = Object.entries(userTimes).sort((a, b) => b[1] - a[1]);
        
        if (sortedUserTimes.length === 0) {
            return interaction.reply({ content: 'Não há dados de tempo de voz para exibir.', ephemeral: true });
        }

        const rank = sortedUserTimes.map(([userId, time], index) => {
            const hours = Math.floor(time / 1000 / 60 / 60);
            const minutes = Math.floor((time / 1000 / 60) % 60);
            return `${index + 1}. <@${userId}> - ${hours} horas e ${minutes} minutos`;
        }).join('\n');

        const embed = new EmbedBuilder()
            .setTitle('Ranking de Horas - LegionRP')
            .setDescription(rank)
            .setImage('attachment://rank_image.gif') 
            .setColor('#FF0000');

        await interaction.reply({
            embeds: [embed],
            files: [{ attachment: './images/rank_image.gif', name: 'rank_image.gif' }]
        });
    },
};