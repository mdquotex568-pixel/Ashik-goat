const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { createCanvas, loadImage } = require("canvas");

module.exports = {
  config: {
    name: "hinata2",
    version: "1.0",
    author: "ashik",
    countDown: 5,
    role: 0,
    category: "image",
    guide: {
      en: "{pn} @mention or reply"
    }
  },

  onStart: async function ({ api, event, args, message }) {
    const uid =
      event.messageReply?.senderID ||
      Object.keys(event.mentions || {})[0] ||
      event.senderID;

    const processing = await message.reply("⏳ Creating Hinata effect...");

    try {
      // USER PROFILE PIC
      const avatar = await axios.get(
        `https://graph.facebook.com/${uid}/picture?width=512&height=512&access_token=`
        ,
        { responseType: "arraybuffer" }
      );

      const userImg = await loadImage(Buffer.from(avatar.data));

      // HINATA BACKGROUND (your image)
      const bg = await loadImage(
        "https://i.imgur.com/zTkguWx.jpeg"
      );

      const canvas = createCanvas(1000, 1000);
      const ctx = canvas.getContext("2d");

      // background
      ctx.drawImage(bg, 0, 0, 1000, 1000);

      // glow circle
      ctx.beginPath();
      ctx.arc(500, 420, 180, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0, 200, 255, 0.25)";
      ctx.fill();

      // circle crop DP
      ctx.save();
      ctx.beginPath();
      ctx.arc(500, 420, 160, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      ctx.drawImage(userImg, 340, 260, 320, 320);
      ctx.restore();

      const filePath = path.join(__dirname, "cache", `hinata2_${uid}.png`);
      fs.writeFileSync(filePath, canvas.toBuffer());

      await message.reply({
        attachment: fs.createReadStream(filePath)
      });

      fs.unlinkSync(filePath);
      await api.unsendMessage(processing.messageID);

    } catch (e) {
      console.log(e);
      message.reply("❌ Error creating image");
    }
  }
};
