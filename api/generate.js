// ==========================================
// PostAI
// Vercel API
// Gemini 2.5 Flash
// ==========================================

export default async function handler(req, res) {

    // ======================================
    // CORS
    // ======================================

    res.setHeader(
        "Access-Control-Allow-Origin",
        "*"
    );

    res.setHeader(
        "Access-Control-Allow-Methods",
        "POST, OPTIONS"
    );

    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type"
    );


    // ======================================
    // OPTIONS
    // ======================================

    if (req.method === "OPTIONS") {

        return res
            .status(200)
            .end();

    }


    // ======================================
    // METHOD
    // ======================================

    if (req.method !== "POST") {

        return res
            .status(405)
            .json({
                error:
                    "Method not allowed"
            });

    }


    try {

        // ==================================
        // API KEY
        // ==================================

        const apiKey =
            process.env.GEMINI_API_KEY;


        if (!apiKey) {

            return res
                .status(500)
                .json({
                    error:
                        "ไม่พบ GEMINI_API_KEY ใน Vercel"
                });

        }


        // ==================================
        // REQUEST DATA
        // ==================================

        const {
            image,
            mimeType
        } = req.body || {};


        if (!image) {

            return res
                .status(400)
                .json({
                    error:
                        "ไม่พบรูปสินค้า"
                });

        }


        // ==================================
        // BASE64
        // ==================================

        const base64Image =
            image.includes(",")
                ? image.split(",")[1]
                : image;


        const detectedMimeType =
            image.match(
                /^data:(.*?);base64,/
            )?.[1];


        const actualMimeType =
            mimeType ||
            detectedMimeType ||
            "image/jpeg";


        // ==================================
        // PROMPT
        // ==================================

        const prompt = `
คุณคือ AI Content Creator มืออาชีพสำหรับเพจ Affiliate สินค้าในประเทศไทย

หน้าที่ของคุณคือดูภาพสินค้า แล้วสร้างแคปชันที่ "เหมือนคนจริงกำลังป้ายยา" ไม่ใช่ข้อความจากโบรชัวร์หรือ AI แข็ง ๆ

วิเคราะห์ภาพอย่างละเอียดก่อนเขียน

ข้อมูลที่ควรพยายามอ่านจากภาพ:
- ประเภทสินค้า
- หน้าที่ของสินค้า
- วิธีใช้งาน
- จุดเด่น
- ฟังก์ชัน
- วัสดุ ถ้ามองเห็นหรือระบุได้
- ขนาด ถ้ามีข้อมูล
- จำนวน ถ้ามีข้อมูล
- รูปแบบการใช้งาน
- ปัญหาที่สินค้าช่วยแก้
- คนที่น่าจะเหมาะกับสินค้า
- ข้อความที่เขียนอยู่บนภาพ

กฎสำคัญ:

1. ใช้ข้อมูลจากภาพเป็นหลัก
2. ห้ามแต่งสเปกที่ไม่มีในภาพ
3. ห้ามแต่งราคา
4. ห้ามแต่งแบรนด์
5. ถ้าอ่านข้อมูลบางอย่างไม่ได้ ให้ไม่ต้องใส่
6. ไม่ต้องใช้ชื่อสินค้าแบบยาว
7. เรียกด้วยประเภทสินค้าแทน เช่น "เครื่องต้มไข่", "ไม้ถูพื้น", "ชั้นวางของ"
8. ต้องบอกรายละเอียดสินค้าจริง ไม่ใช่ชมอย่างเดียว
9. ภาษาต้องเป็นภาษาไทยธรรมชาติ
10. ห้ามใช้ภาษาขายของแข็ง ๆ
11. ห้ามเปิดด้วย "ของชิ้นนี้น่าสนใจมาก"
12. ห้ามใช้ประโยคซ้ำ ๆ เช่น "ใครกำลังมองหา..." ทุกโพสต์
13. Hook ต้องน่าสนใจและเกี่ยวข้องกับสินค้า
14. ให้ความรู้สึกเหมือนเพจเจอของดีแล้วเอามาบอกต่อ
15. ใช้อีโมจิอย่างพอดี
16. ห้ามใส่ราคา
17. Affiliate Link ต้องอยู่ด้านบน
18. ต้องมีรายละเอียดสินค้าชัดเจน
19. ต้องมีจุดเด่นจากภาพ
20. ต้องมีเหตุผลว่าทำไมคนถึงน่าจะสนใจ
21. Reel และ Facebook ต้องเขียนต่างกัน
22. ห้ามใส่คำอธิบายเกี่ยวกับการวิเคราะห์ภาพ
23. ห้ามพูดว่า "จากภาพ"
24. ห้ามใส่ข้อความ placeholder อื่นนอกจาก "[แปะ Affiliate Link ตรงนี้]"
25. ห้ามใส่ Markdown code block

สไตล์ Reel:

- เปิดด้วย Hook สั้น ๆ ที่สะดุดตา
- เล่าปัญหาหรือสถานการณ์ที่คนเจอ
- แนะนำสินค้า
- บอกว่ามันทำอะไร
- บอกจุดเด่นที่เห็นได้จริง
- ปิดด้วย CTA ที่ชวนกดดู
- ไม่ต้องยาวเกินไป
- อ่านแล้วเหมาะกับคลิปสั้น

สไตล์ Facebook:

- เปิดแบบชวนคุยหรือชวนสงสัย
- อธิบายสินค้าให้ละเอียดกว่า Reel
- บอกฟังก์ชันและจุดเด่น
- บอกว่าเหมาะกับใคร
- ปิดด้วย CTA
- อ่านง่าย แบ่งย่อหน้า
- อย่าเขียนเหมือนโฆษณาตรง ๆ

รูปแบบคำตอบต้องเป็น EXACTLY:

=== REELS ===

🔗 [แปะ Affiliate Link ตรงนี้]

[Hook]

[เนื้อหาและรายละเอียดสินค้า]

✨ จุดเด่น
[จุดเด่นของสินค้า]

💡 เหมาะกับ
[กลุ่มคนที่เหมาะ]

[CTA]

[Hashtags]


=== FACEBOOK ===

🔗 [แปะ Affiliate Link ตรงนี้]

[Hook]

[รายละเอียดสินค้า]

✨ จุดเด่น
[จุดเด่นของสินค้า]

💡 เหมาะกับใคร
[กลุ่มคนที่เหมาะ]

[CTA]

[Hashtags]

สร้างเนื้อหาให้ดึงดูด น่าอ่าน และเป็นธรรมชาติ
`;


        // ==================================
        // GEMINI API
        // ==================================

        const endpoint =
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";


        const response =
            await fetch(
                `${endpoint}?key=${apiKey}`,
                {
                    method:
                        "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({

                            contents: [

                                {
                                    role:
                                        "user",

                                    parts: [

                                        {
                                            text:
                                                prompt
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

                                temperature:
                                    0.85,

                                maxOutputTokens:
                                    1800

                            }

                        })

                }
            );


        // ==================================
        // GEMINI ERROR
        // ==================================

        if (!response.ok) {

            const errorText =
                await response.text();


            console.error(
                "Gemini API error:",
                errorText
            );


            return res
                .status(
                    response.status
                )
                .json({

                    error:
                        "Gemini API Error",

                    details:
                        errorText

                });

        }


        // ==================================
        // RESPONSE
        // ==================================

        const data =
            await response.json();


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

            return res
                .status(500)
                .json({
                    error:
                        "Gemini ไม่ได้ส่งข้อความกลับมา"
                });

        }


        // ==================================
        // SUCCESS
        // ==================================

        return res
            .status(200)
            .json({

                success:
                    true,

                result

            });

    }

    catch (error) {

        console.error(
            "PostAI API Error:",
            error
        );


        return res
            .status(500)
            .json({

                success:
                    false,

                error:
                    error?.message ||
                    "เกิดข้อผิดพลาดจาก Server"

            });

    }

}