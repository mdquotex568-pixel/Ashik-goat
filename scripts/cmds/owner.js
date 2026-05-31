const fs = require("fs-extra");
const request = require("request");
const path = require("path");

module.exports = {
  config: {
    name: "owner",
    version: "1.3.0",
    author: "亗•𝘔𝘈𝘔𝘜𝘕✿᭄",
    role: 0,
    shortDescription: "Owner information with image",
    category: "Information",
    guide: {
      en: "owner"
    }
  },

  onStart: async function ({ api, event }) {
    const ownerText = 
`╭─ 👑 Oᴡɴᴇʀ Iɴғᴏ 👑 ─╮
│ 👤 Nᴀᴍᴇ       : 亗•𝒂𝒔𝒉𝒊𝒌✿᭄
│🧸 Nɪᴄᴋ       : 𝒂𝒔𝒉𝒖𝒖
│ 🎂 Aɢᴇ        : 17+
│ 💘 Rᴇʟᴀᴛɪᴏɴ : 𝒔𝒊𝒏𝒈𝒍𝒆
│ 🎓 Pʀᴏғᴇssɪᴏɴ : Sᴛᴜᴅᴇɴᴛ
│ 📚 Eᴅᴜᴄᴀᴛɪᴏɴ : Iɴᴛᴇʀ 1𝒔𝒕 Yᴇᴀʀ
│ 🏡 Lᴏᴄᴀᴛɪᴏɴ : 𝒑𝒂𝒃𝒏𝒂  
├─ 🔗 Cᴏɴᴛᴀᴄᴛ ─╮
│ 📘 Facebook  : 𝒅𝒆𝒃𝒐 𝒏𝒂
│ 💬 Messenger: 𝒏𝒂 𝒅𝒊𝒍𝒆 𝒌𝒊 𝒌𝒐𝒓𝒃𝒊?
│ 📞 WhatsApp  : wa.me/𝒎𝒓𝒂 𝒌𝒉𝒂
╰────────────────╯`;

    const cacheDir = path.join(__dirname, "cache");
    const imgPath = path.join(cacheDir, "owner.jpg");

    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

    const imgLink = "https://i.imgur.com/HVtr1O4.jpeg";

    const send = () => {
      api.sendMessage(
        {
          body: ownerText,
          attachment: fs.createReadStream(imgPath)
        },
        event.threadID,
        () => fs.unlinkSync(imgPath),
        event.messageID
      );
    };

    request(encodeURI(imgLink))
      .pipe(fs.createWriteStream(imgPath))
      .on("close", send);
  }
};
