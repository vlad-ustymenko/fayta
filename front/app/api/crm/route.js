import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const {
      name,
      phone,
      lang,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_term,
      utm_content,
    } = await request.json();

    if (!name || !phone) {
      return NextResponse.json(
        { success: false, message: "Name and phone are required" },
        { status: 400 },
      );
    }

    const token = process.env.CRM_TOKEN;
    const partnerId = process.env.CRM_PARTNER_ID;

    if (!token || !partnerId) {
      throw new Error("CRM environment variables are missing");
    }

    const params = new URLSearchParams({
      action: "partner-custom-form",
      token,
      partner_id: partnerId,
      name: `${name} (faytanova.com.ua)`,
      phone,
      lang: lang || "ua",
      note: "Запит з сайта faytanova.com.ua",
      utm_source: utm_source || "",
      utm_medium: utm_medium || "",
      utm_campaign: utm_campaign || "",
      utm_term: utm_term || "",
      utm_content: utm_content || "",
    });

    const response = await fetch("https://crm.g-plus.app/api/actions", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "CRM API error");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("CRM API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to send form to CRM",
      },
      { status: 500 },
    );
  }
}
