export async function POST(request) {
  try {
    const body = await request.json();

    const {
      name,
      phone,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_term,
      utm_content,
    } = body;

    if (!name || !phone) {
      return Response.json(
        {
          success: false,
          message: "Name and phone are required",
        },
        {
          status: 400,
        },
      );
    }

    const telegramMessage = `
🔔 Нова заявка з сайту fautanova.com.ua

👤 Ім'я: ${name}
📞 Телефон: ${phone}

📊 UTM:

Source: ${utm_source || "—"}
Medium: ${utm_medium || "—"}
Campaign: ${utm_campaign || "—"}
Term: ${utm_term || "—"}
Content: ${utm_content || "—"}
`.trim();

    const response = await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text: telegramMessage,
        }),
      },
    );

    const result = await response.json();

    if (!result.ok) {
      console.error("Telegram API error:", result);

      return Response.json(
        {
          success: false,
          message: "Telegram API error",
        },
        {
          status: 500,
        },
      );
    }

    return Response.json({
      success: true,
    });
  } catch (error) {
    console.error("Telegram route error:", error);

    return Response.json(
      {
        success: false,
        message: "Server error",
      },
      {
        status: 500,
      },
    );
  }
}
