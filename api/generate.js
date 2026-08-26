export default async function handler(req, res) {
    // CORS
    res.setHeader(
        "Access-Control-Allow-Origin",
        "https://witchanun.github.io"
    );

    res.setHeader(
        "Access-Control-Allow-Methods",
        "POST, OPTIONS"
    );

    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type"
    );

    // Preflight
    if (req.method === "OPTIONS") {
        return res.status(204).end();
    }

    // Only POST
    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    try {
        const apiKey =
            process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return res.status(500).json({
                error: "ไม่พบ GEMINI_API_KEY ใน Vercel"
            });
        }

        const {
            image,
            mimeType
        } = req.body || {};

        if (!image) {
            return res.status(400).json({
                error: "ไม่พบรูปสินค้า"
            });
        }

        const base64Image =
            image.includes(",")
                ? image.split(",")[1]
                : image;

        const actualMimeType =
            mimeType ||
            image.match(
                /^data:(.*?);base64,/
            )?.[1] ||
            "image/jpeg";

        const prompt = `
คุณคือ AI Content Creator มืออาชีพสำหรับเพจ Affiliate สินค้าในประเทศไทย

ดูภาพสินค้าอย่างละเอียด แล้วสร้างแคปชันภาษาไทยที่น่าสนใจ เหมือนคนจริงกำลังป้ายยาของดี

วิเคราะห์:
- ประเภทสินค้า
- หน้าที่
- จุดเด่น
- ฟังก์ชัน
- วิธีใช้งาน
- ปัญหาที่ช่วยแก้
- คนที่เหมาะกับสินค้า
- ข้อมูลที่เห็นในภาพ

กฎ:
- ใช้ข้อมูลจากภาพเป็นหลัก
- ห้ามแต่งข้อมูลที่ไม่มีในภาพ
- ห้ามใส่ราคา
- ไม่ต้องใช้ชื่อสินค้ายาว ๆ
- ให้เรียกประเภทสินค้าแทน
- ภาษาธรรมชาติ
- Hook ต้องน่าสนใจ
- ห้ามเขียนเหมือนโฆษณาแข็ง ๆ
- ต้องมีรายละเอียดสินค้า
- ต้องมีจุดเด่น
- ต้องมี CTA
- Reel และ Facebook ต้องแตกต่างกัน

ตอบตามรูปแบบนี้:

=== REELS ===

🔗 [แปะ Affiliate Link ตรงนี้]

[Hook ที่ดึงดูด]

[รายละเอียดสินค้า]

✨ จุดเด่น
[จุดเด่น]

💡 เหมาะกับ
[กลุ่มคน]

[CTA]

[Hashtags]


=== FACEBOOK ===

🔗 [แปะ Affiliate Link ตรงนี้]

[Hook]

[รายละเอียดสินค้า]

✨ จุดเด่น
[จุดเด่น]

💡 เหมาะกับใคร
[กลุ่มคน]

[CTA]

[Hashtags]
`;

        const endpoint =
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

        const response =
            await fetch(
                `${endpoint}?key=${apiKey}`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        contents: [
                            {
                                role: "user",

                                parts: [
                                    {
                                        text: prompt
                                    },

                                    {
                                        inline_data: {
                                            mime_type:
                                                actualMimeType,

                                            data:
                                                base64Image
                                        }
                                    }
                                ]
                            }
                        ],

                        generationConfig: {
                            temperature: 0.85,
                            maxOutputTokens: 1800
                        }
                    })
                }
            );

        const data =
            await response.json();

        if (!response.ok) {
            console.error(
                "Gemini Error:",
                data
            );

            return res
                .status(response.status)
                .json({
                    error:
                        "Gemini API Error",

                    details:
                        JSON.stringify(data)
                });
        }

        const result =
            data
                ?.candidates?.[0]
                ?.content?.parts
                ?.map(
                    part =>
                        part.text || ""
                )
                .join("")
                .trim();

        if (!result) {
            return res.status(500).json({
                error:
                    "Gemini ไม่ได้ส่งข้อความกลับมา"
            });
        }

        return res.status(200).json({
            success: true,
            result
        });

    } catch (error) {

        console.error(
            "Server Error:",
            error
        );

        return res.status(500).json({
            error:
                error?.message ||
                "เกิดข้อผิดพลาดบน Server"
        });
    }
}