const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { createCanvas, loadImage } = require("canvas");

// LOGOS
const LION = "https://i.imgur.com/6K0Gk79.gif";
const SKULL = "https://i.imgur.com/C7OUGdj.gif";

module.exports = {
  config: {
    name: "vcpp",
    version: "3.0",
    author: "ashik",
    countDown: 5,
    role: 0,
    description: "Ultra esports vcpp banner",
    category: "image",
    guide: {
      en: "Reply a photo\n/vcpp color ITS NAME , DOWN , GC"
    }
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID, messageReply } = event;

    if (!messageReply || !messageReply.attachments?.[0]) {
      return api.sendMessage("❌ Reply a photo first!", threadID, messageID);
    }

    if (!args.length) {
      return api.sendMessage("❌ Use /vcppr for help", threadID, messageID);
    }

    try {
      const color = args[0];
      const text = args.slice(1).join(" ");
      let [its, top, down, gc] = text.split(",").map(x => x?.trim());

      const imgURL = messageReply.attachments[0].url;
      const imgData = await axios.get(imgURL, { responseType: "arraybuffer" });
      const avatar = await loadImage(imgData.data);

      const lion = await loadImage(LION);
      const skull = await loadImage(SKULL);

      const canvas = createCanvas(1000, 1000);
      const ctx = canvas.getContext("2d");

      // ================= ULTRA ESPORTS BACKGROUND =================
      const bg = ctx.createLinearGradient(0, 0, 1000, 1000);
      bg.addColorStop(0, "#05010a");
      bg.addColorStop(0.3, "#12001f");
      bg.addColorStop(0.6, "#001a1f");
      bg.addColorStop(1, "#0a000f");

      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, 1000, 1000);

      // glow particles
      for (let i = 0; i < 25; i++) {
        ctx.beginPath();
        ctx.fillStyle = `rgba(0,255,255,${Math.random() * 0.08})`;
        ctx.arc(Math.random() * 1000, Math.random() * 1000, Math.random() * 120, 0, Math.PI * 2);
        ctx.fill();
      }

      // diagonal lines
      ctx.strokeStyle = "rgba(255,0,255,0.08)";
      ctx.lineWidth = 2;

      for (let i = -1000; i < 2000; i += 80) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + 400, 1000);
        ctx.stroke();
      }

      // ================= LOGOS =================
      ctx.drawImage(lion, 40, 80, 120, 120);
      ctx.drawImage(skull, 840, 80, 120, 120);

      // ================= TOP TEXT =================
      ctx.shadowColor = "#00ffff";
      ctx.shadowBlur = 25;
      ctx.fillStyle = "#00ffff";
      ctx.font = "bold 70px Sans";
      ctx.textAlign = "center";
      ctx.fillText((its || "ITS").toUpperCase(), 500, 120);
      ctx.shadowBlur = 0;

      // ================= CENTER AVATAR =================
      const x = 500;
      const y = 500;
      const r = 200;

      // outer glow
      ctx.beginPath();
      ctx.shadowColor = "#00ffff";
      ctx.shadowBlur = 30;
      ctx.strokeStyle = "#00ffff";
      ctx.lineWidth = 10;
      ctx.arc(x, y, r + 10, 0, Math.PI * 2);
      ctx.stroke();

      // inner ring
      ctx.beginPath();
      ctx.shadowColor = "#ff00ff";
      ctx.shadowBlur = 20;
      ctx.strokeStyle = "#ff00ff";
      ctx.lineWidth = 5;
      ctx.arc(x, y, r - 5, 0, Math.PI * 2);
      ctx.stroke();

      // avatar clip
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(avatar, x - r, y - r, r * 2, r * 2);
      ctx.restore();

      // ================= BOTTOM TEXT =================
      ctx.shadowBlur = 0;

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 55px Sans";
      ctx.textAlign = "center";
      ctx.fillText((top || "").toUpperCase(), 500, 780);

      ctx.fillStyle = "#00ffff";
      ctx.font = "bold 40px Sans";
      ctx.fillText((down || "").toUpperCase(), 500, 850);

      ctx.fillStyle = "#ff00ff";
      ctx.font = "bold 35px Sans";
      ctx.fillText((gc || "").toUpperCase(), 500, 910);

      const buffer = canvas.toBuffer("image/png");

      const filePath = path.join(__dirname, "vcpp.png");
      fs.writeFileSync(filePath, buffer);

      return api.sendMessage(
        {
          body: "🔥 ULTRA ESPORTS VCPP READY!",
          attachment: fs.createReadStream(filePath)
        },
        threadID,
        () => fs.unlinkSync(filePath),
        messageID
      );

    } catch (e) {
      console.log(e);
      return api.sendMessage("❌ Error generating VCPP", threadID, messageID);
    }
  }
};
