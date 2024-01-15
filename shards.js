require('dotenv').config();

const { ShardingManager } = require('discord.js')
const TOKEN = process.env.TOKEN
const manager = new ShardingManager(`${__dirname}/index.js`, { token: TOKEN })

manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`))
manager.spawn()