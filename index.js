const TelegramBot = require("node-telegram-bot-api");

const express = require("express");
const cors = require("cors");

const token = "6194631496:AAEBZDbxbit26h1Sq24H3jnXxTp2YrIm8bk";

const webAppUrl = "https://remarkable-haupia-dcd58b.netlify.app/";

const bot = new TelegramBot(token, { polling: true });
const app = express();

app.use(express.json());
app.use(cors());

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === "/start") {
    await bot.sendMessage(chatId, "Ниже появится кнопкаб заполни форму", {
      reply_markup: {
        keyboard: [
          [{ text: "заполнить форму", web_app: { url: webAppUrl + "/form" } }],
        ],
      },
    });

    await bot.sendMessage(chatId, "Заходи в наш интернет магазин", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "Зделать заказ", web_app: { url: webAppUrl } }],
        ],
      },
    });
  }

  if (msg?.web_app_data?.data) {
    try {
      const data = JSON.parse(msg?.web_app_data?.data);

      await bot.sendMessage(chatId, "Спасибо за оюратную свзяь");
      await bot.sendMessage(chatId, "Ваша старана:" + data?.country);
      await bot.sendMessage(chatId, "Ваша улица:" + data?.street);

      setTimeout(async () => {
        await bot.sendMessage("Всю информацию вы получите в этом чате");
      }, 3000);
    } catch (e) {
      console.log(e);
    }
  }
});

app.post("/web-data", async (req, res) => {
  const { queryId, products, totalPrice } = req.body;
  try {
    await bot.answerWebAppQuery(queryId, {
      type: "artticle",
      id: queryId,
      title: "Успешная покупка",
      input_message_content: {
        message_text:
          "Поздравляю с покупкой, вы приобрел товар на сумму" + totalPrice,
      },
    });
    return res.status(200).json({});
  } catch (e) {
    await bot.answerWebAppQuery(queryId, {
      type: "artticle",
      id: queryId,
      title: "Не удалось приобрести товар",
      input_message_content: { message_text: "Не удалось приобрести товар" },
    });
    return res.status(500).json({});
  }
});

const PORT = 8000;

app.listen(PORT, () => console.log("server started on PORT " + PORT));
