const bot = require('./app/traderBot');
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Paste your API-key: ', (answer) => {
    const key = answer;
    console.log(`API-key saved.`);

    rl.question('Paste your API-secret: ', (answer) => {
        const secret = answer;
        console.log(`API-secret saved.`);
        rl.close();

        const traderBot = new bot(key, secret);

        (async () => {
            console.log(await traderBot.api('Balance'));
        })();
    });

});




