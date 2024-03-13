const KeyVal = require("../engine/KeyVal/KeyVal.Model").Model;

async function CodeGen(toCountone) {
    // var newrow = new KeyVal({});
    // await newrow.save();
    // return null;
    const id = "63bab178663e176d0c635236";

    const counterdata = await KeyVal.findById(id);
        console.log(counterdata);

    const newJsonCounter = JSON.parse(counterdata.valEn.replace(/'/g, '"'));
    console.log(newJsonCounter);
    if (!newJsonCounter[toCountone]) {
        newJsonCounter[toCountone] = 230000;
    }
    newJsonCounter[toCountone]++;
    counterdata.valEn = JSON.stringify(newJsonCounter, null, 2);
    // await counterdata.save();
    await counterdata.save();
    return newJsonCounter[toCountone];
}

module.exports = { CodeGen };