const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } = require('discord.js');
const fs = require('fs');
const path = './data/voiceTime.json';
const config = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('painel')
        .setDescription('Painel principal com informações e comandos.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: false });

        const embed = new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('Painel Principal - Legion Group')
            .setDescription('Selecione uma das opções abaixo para mais informações e ações.')
            .setImage('https://cdn.discordapp.com/attachments/1220155275953045574/1249407374264111234/legin-cmulher.gif?ex=6668824a&is=666730ca&hm=974a2824afb0dda7ac75087bac3adc1ed1b1af3c1a9eae7a7969e03074f45530&'); // Aqui vai um link de imagem ou gif também, coloque uma de sua escolha.

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('socials')
                    .setLabel('Redes Sociais')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('rank')
                    .setLabel('Ranking de Tempo de Voz')
                    .setStyle(ButtonStyle.Secondary)
            );

        await interaction.editReply({ embeds: [embed], components: [row] });

        const filter = i => i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async i => {
            if (i.customId === 'socials') {
                await sendSocialsEmbed(i);
            } else if (i.customId === 'rank') {
                await sendRankEmbed(i);
            }
        });
    },
};

async function sendSocialsEmbed(interaction) {
    const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('Acesse nossos canais de comunicação.')
        .setDescription('Acesse e fique por dentro dos nossos meios de comunicação!')
        .setImage('https://cdn.discordapp.com/attachments/1220155275953045574/1249407374264111234/legin-cmulher.gif?ex=6668824a&is=666730ca&hm=974a2824afb0dda7ac75087bac3adc1ed1b1af3c1a9eae7a7969e03074f45530&'); // Aqui também vai outro link de gif ou imagem, coloque um de seu gosto.

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setLabel('Instagram')
                .setStyle(ButtonStyle.Link)
                .setURL('https://www.instagram.com/magusthe/'), // Link das redes sociais de vocês, caso queiram colocar.
            new ButtonBuilder()
                .setLabel('TikTok')
                .setStyle(ButtonStyle.Link)
                .setURL('https://www.tiktok.com/@anthemagus') //Mesma coisa do comm acima.
        );

    await interaction.update({ embeds: [embed], components: [row] });
}

async function sendRankEmbed(interaction) {
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

    await interaction.update({
        embeds: [embed],
        files: [{ attachment: './images/rank_image.gif', name: 'rank_image.gif' }]
    });
}
