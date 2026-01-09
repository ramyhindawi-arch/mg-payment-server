const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// عدّل هذه القيم فقط لاحقًا
const FAUCETPAY_API_KEY = "ضع_API_مفتاح_فوست_باي_هنا";
const REQUIRED_AMOUNT = 14.99;

// صفحة اختبار
app.get("/", (req, res) => {
  res.send("السيرفر يعمل بنجاح ✅");
});

// التحقق من الدفع
app.get("/check-payment", async (req, res) => {
  try {
    const response = await fetch("https://faucetpay.io/api/v1/getbalance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        api_key: FAUCETPAY_API_KEY
      })
    });

    const data = await response.json();

    if (!data || !data.balance) {
      return res.json({ paid: false });
    }

    const balance = parseFloat(data.balance.USDT || 0);

    if (balance >= REQUIRED_AMOUNT) {
      return res.json({ paid: true });
    } else {
      return res.json({ paid: false });
    }

  } catch (error) {
    return res.status(500).json({ error: "خطأ في السيرفر" });
  }
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
