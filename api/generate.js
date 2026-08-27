// ==========================================
// PostAI
// Vercel API
// Gemini 3.6 Flash
// ==========================================

export default async function handler(req, res) {

    // ======================================
    // CORS
    // ======================================

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

    res.setHeader(
        "Access-Control-Max-Age",
        "86400"
    );


    // ======================================
    // PREFLIGHT
    // ======================================

    if (req.method === "OPTIONS") {

        return res
            .status(204)
            .end();

    }


    // ======================================
    // ONLY POST
    // ======================================

    if (req.method !== "POST") {

        return res
            .status(405)
            .json({
                error: "Method not allowed"
            });

    }


    try {

        // ==================================
        // API KEY
        // ==================================

        const apiKey =
            process.env.GEMINI_API_KEY;


        if (!apiKey) {

            console.error(
                "GEMINI_API_KEY is missing"
            );

            return res
                .status(500)
                .json({
                    error:
                        "ไม่พบ GEMINI_API_KEY ใน Vercel"
                });

        }


        // ==================================
        // REQUEST BODY
        // ==================================

        const body =
            req.body || {};


        const image =
            body.image;


        const mimeType =
            body.mimeType;


        if (!image) {

            return res
                .status(400)
                .json({
                    error:
                        "ไม่พบรูปสินค้า"
                });

        }


        // ==================================
        // EXTRACT BASE64
        // ==================================

        let base64Image =
            image;


        let detectedMimeType =
            null;


        // data:image/jpeg;base64,...
        const dataUrlMatch =
            image.match(
                /^data:(.*?);base64,(.*)$/
            );


        if (dataUrlMatch) {

            detectedMimeType =
                dataUrlMatch[1];

            base64Image =
                dataUrlMatch[2];

        }


        const actualMimeType =
            mimeType ||
            detectedMimeType ||
            "image/jpeg";


        // ==================================
        // PROMPT
        // ==================================

        const prompt = `
คุณคือ AI Content Creator มืออาชีพสำหรับเพจ Affiliate สินค้าในประเทศไทย

หน้าที่ของคุณคือดูภาพสินค้าอย่างละเอียด แล้วสร้างแคปชันที่น่าสนใจ เหมือนคนจริงกำลังเจอของดีแล้วเอามาป้ายยาให้คนอื่น

วิเคราะห์ภาพก่อนเขียน โดยพยายามดูข้อมูลเหล่านี้:

- ประเภทสินค้า
- หน้าที่ของสินค้า
- วิธีใช้งาน
- จุดเด่น
- ฟังก์ชัน
- วัสดุ ถ้ามองเห็นหรือมีข้อความระบุ
- ขนาด ถ้ามีข้อมูล
- จำนวน ถ้ามีข้อมูล
- รูปแบบการใช้งาน
- ปัญหาที่สินค้าช่วยแก้
- คนที่น่าจะเหมาะกับสินค้า
- ข้อความสำคัญที่อยู่บนภาพ

กฎสำคัญ:

1. ใช้ข้อมูลที่เห็นในภาพเป็นหลัก
2. ห้ามแต่งสเปกที่ไม่มีข้อมูล
3. ห้ามแต่งราคา
4. ห้ามแต่งโปรโมชั่น
5. ห้ามแต่งแบรนด์ถ้ามองไม่เห็น
6. ไม่ต้องใช้ชื่อสินค้าแบบยาว
7. ให้เรียกด้วย "ประเภทสินค้า" เป็นหลัก
8. ต้องมีรายละเอียดสินค้าจริง
9. ต้องมีจุดเด่นที่ชัดเจน
10. ต้องมีเหตุผลว่าทำไมคนถึงน่าจะสนใจ
11. Hook ต้องน่าสนใจ
12. ภาษาเป็นภาษาไทยธรรมชาติ
13. อย่าเขียนเหมือนโฆษณาแข็ง ๆ
14. อย่าเปิดทุกโพสต์ด้วย "ใครกำลังมองหา..."
15. ห้ามใช้ประโยคซ้ำ ๆ
16. ใช้อีโมจิอย่างพอดี
17. ห้ามใส่ราคา
18. Reel และ Facebook ต้องเขียนต่างกัน
19. ต้องเหมาะกับคนไทย
20. ห้ามพูดว่า "จากภาพ"
21. ห้ามอธิบายขั้นตอนการวิเคราะห์
22. ห้ามใส่ Markdown code block
23. ต้องตอบตามรูปแบบที่กำหนดด้านล่าง

สไตล์ REELS:

- Hook ต้องสะดุดตา
- เปิดด้วยสถานการณ์หรือปัญหาที่คนเจอ
- แนะนำประเภทสินค้า
- อธิบายว่ามันช่วยอะไร
- บอกจุดเด่น
- ปิดด้วย CTA ที่ชวนกดเข้าไปดู
- กระชับ อ่านแล้วเหมาะกับคลิปสั้น
- อย่าเขียนยาวจนเหมือนบทความ

สไตล์ FACEBOOK:

- Hook น่าสนใจ
- เล่าให้เหมือนกำลังแนะนำของให้เพื่อน
- รายละเอียดมากกว่า Reel
- อธิบายฟังก์ชันและจุดเด่น
- บอกว่าเหมาะกับใคร
- ปิดด้วย CTA
- อ่านง่าย
- แบ่งย่อหน้า
- ไม่ขายตรงเกินไป

รูปแบบคำตอบต้องเป็น EXACTLY:

=== REELS ===

[Hook]

[รายละเอียดสินค้า]

✨ จุดเด่น
[จุดเด่นของสินค้า]

💡 เหมาะกับ
[กลุ่มคนที่เหมาะ]

[CTA]

[Hashtags]


=== FACEBOOK ===  

[Hook]

[รายละเอียดสินค้า]

✨ จุดเด่น
[จุดเด่นของสินค้า]

💡 เหมาะกับใคร
[กลุ่มคนที่เหมาะ]

[CTA]

[Hashtags]
`;


        // ==================================
        // GEMINI ENDPOINT
        // ==================================

        const endpoint =
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent";


        // ==================================
        // CALL GEMINI
        // ==================================

        const response =
            await fetch(
                endpoint,
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "x-goog-api-key":
                            apiKey

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

                            ]

                        })

                }
            );


        // ==================================
        // READ GEMINI RESPONSE
        // ==================================

        const data =
            await response.json();


        // ==================================
        // GEMINI ERROR
        // ==================================

        if (!response.ok) {

            console.error(
                "Gemini API Error:",
                JSON.stringify(
                    data,
                    null,
                    2
                )
            );


            return res
                .status(500)
                .json({

                    error:
                        "Gemini API Error",

                    details:
                        JSON.stringify(
                            data
                        )

                });

        }


        // ==================================
        // EXTRACT TEXT
        // ==================================

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


        // ==================================
        // EMPTY RESPONSE
        // ==================================

        if (!result) {

            console.error(
                "Gemini returned no text:",
                JSON.stringify(
                    data,
                    null,
                    2
                )
            );


            return res
                .status(500)
                .json({

                    error:
                        "Gemini ไม่ได้ส่งข้อความกลับมา",

                    details:
                        JSON.stringify(
                            data
                        )

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

                result:
                    result

            });

    }


    // ======================================
    // SERVER ERROR
    // ======================================

    catch (error) {

        console.error(
            "PostAI Server Error:",
            error
        );


        return res
            .status(500)
            .json({

                success:
                    false,

                error:
                    error?.message ||
                    "เกิดข้อผิดพลาดบน Vercel"

            });

    }

}