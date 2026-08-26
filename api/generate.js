export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    try {
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            throw new Error(
                "ไม่พบ GEMINI_API_KEY ใน Vercel Environment Variables"
            );
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

        const base64Image = image.includes(",")
            ? image.split(",")[1]
            : image;

        const actualMimeType =
            mimeType ||
            image.match(/^data:(.*?);base64,/)?.[1] ||
            "image/jpeg";

        const prompt = `
คุณคือ AI Content Creator สำหรับเพจ Affiliate สินค้า

วิเคราะห์ภาพสินค้าอย่างละเอียด แล้วเขียนแคปชันภาษาไทยให้เหมือนคนจริงกำลังป้ายยาของที่ตัวเองเห็นว่าน่าสนใจ

อ่านข้อมูลจากภาพให้ได้มากที่สุด เช่น:
- ประเภทสินค้า
- รายละเอียดสินค้า
- ฟังก์ชัน
- จุดเด่น
- วัสดุ
- ขนาด
- จำนวน
- วิธีใช้งาน
- เหมาะกับใคร
- ข้อความสำคัญบนภาพ

กฎสำคัญ:
1. ใช้ข้อมูลที่มองเห็นจากภาพเป็นหลัก
2. ห้ามแต่งสเปกสินค้า
3. ห้ามแต่งราคา
4. ห้ามแต่งชื่อแบรนด์
5. ถ้าอ่านข้อมูลไม่ได้ ให้ข้ามข้อมูลนั้น
6. ไม่ต้องใส่ชื่อสินค้าแบบยาว
7. ใช้ประเภทของสินค้าแทนชื่อสินค้า
8. ภาษาไทยต้องเป็นธรรมชาติ
9. ห้ามเขียนเหมือนโบรชัวร์
10. ต้องอ่านแล้วรู้สึกว่าน่าสนใจและอยากกดดู
11. Affiliate Link ต้องอยู่ด้านบน
12. ห้ามใส่ราคา
13. ต้องมีรายละเอียดสินค้าจริง
14. สร้างทั้ง Reel และ Facebook Post
15. ทั้งสองแบบต้องเขียนต่างกันเล็กน้อย

รูปแบบคำตอบ:

=== REELS ===

🔗 [แปะ Affiliate Link ตรงนี้]

[Hook ที่ดึงดูด]

[รายละเอียดสินค้าแบบเป็นธรรมชาติ]

✨ จุดเด่น
[จุดเด่นจากภาพ]

💡 เหมาะกับ
[กลุ่มคนที่น่าจะสนใจ]

[ประโยคปิดที่ชวนกดดูสินค้า]

[Hashtags]


=== FACEBOOK ===

🔗 [แปะ Affiliate Link ตรงนี้]

[เปิดเรื่องแบบน่าสนใจ]

[รายละเอียดสินค้า]

✨ จุดเด่น
[จุดเด่นจากภาพ]

💡 เหมาะกับใคร
[กลุ่มคนที่เหมาะ]

[CTA ที่ชวนกดเข้าไปดูรายละเอียด]

[Hashtags]

อย่าใส่คำอธิบายเพิ่มเติมนอกเหนือจากสองส่วนนี้
`;

        const endpoint =
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

        const response = await fetch(
            `${endpoint}?key=${apiKey}`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
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
                        temperature: 0.8,
                        maxOutputTokens: 1500
                    }
                })
            }
        );

        if (!response.ok) {
            const errorText =
                await response.text();

            console.error(
                "Gemini API error:",
                errorText
            );

            return res.status(
                response.status
            ).json({
                error: "Gemini API error",
                details: errorText
            });
        }

        const data =
            await response.json();

        const result =
            data?.candidates?.[0]
                ?.content?.parts
                ?.map(
                    part => part.text || ""
                )
                .join("")
                .trim();

        if (!result) {
            throw new Error(
                "Gemini ไม่ส่งข้อความกลับมา"
            );
        }

        return res.status(200).json({
            success: true,
            result
        });

    } catch (error) {

        console.error(
            "PostAI API error:",
            error
        );

        return res.status(500).json({
            success: false,
            error:
                error.message ||
                "เกิดข้อผิดพลาดจาก Server"
        });
    }
}