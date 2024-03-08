require('dotenv').config();
const fs = require('fs');

const { ShardingManager } = require('discord.js')
const TOKEN = process.env.TOKEN
try {
    const manager = new ShardingManager(`${__dirname}/index.js`, { token: TOKEN })

    manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`))
    manager.spawn()
} catch (e) {
    fs.appendFile("./errors.txt", `${e}\n\n`, () => { });
}