module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`Estou pronto! Prazer, sou o ${client.user.tag}`);
    },
};