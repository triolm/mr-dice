const axios = require('axios');
const fs = require('fs');
fs.writeFile("./lists.txt", "", () => 0);
spells = [];
items = [];
magicItems = [];

(async () => {
    let sRes = await axios.get(`https://www.dnd5eapi.co/api/spells`)
    sRes = sRes.data.results;
    const sAll = sRes.map((e) => { return e.name })

    count = 0;
    let sArr = ""
    for (let i of sAll) {
        sArr += i + '\n';
        count += i.length + 1;
        if (count > 1024) {
            spells.push(sArr);
            sArr = [];
            count = 0;
        }
    }


    let iRes = await axios.get(`https://www.dnd5eapi.co/api/equipment`)
    iRes = iRes.data.results;

    const iAll = iRes.map((e) => { return e.name })

    count = 0;
    let iArr = ""
    for (let i of iAll) {
        iArr += i + '\n';
        count += i.length + 1;
        if (count > 1024) {
            items.push(iArr);
            iArr = [];
            count = 0;
        }
    }


    let mRes = await axios.get(`https://www.dnd5eapi.co/api/magic-items`)
    mRes = mRes.data.results;
    const mAll = mRes.map((e) => { return e.name })

    count = 0;
    let mArr = ""
    for (let i of mAll) {
        mArr += i + '\n';
        count += i.length + 1;
        if (count > 1024) {
            magicItems.push(mArr);
            mArr = [];
            count = 0;
        }
    }
    fs.appendFile("./lists.txt", JSON.stringify({ spells, items, magicItems }), () => 0)
})()
