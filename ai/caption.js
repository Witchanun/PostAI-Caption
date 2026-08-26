// ==========================================
// PostAI
// Caption Generator
// Client-side
// ==========================================

import {
    analyzeImage
} from "./model.js";


// ==========================================
// GENERATE CAPTION
// ==========================================

export async function generateCaption(
    imageData,
    type
) {

    if (!imageData) {

        throw new Error(
            "ไม่พบรูปสินค้า"
        );

    }

    // OCR อ่านข้อความจากภาพ
    const text =
        await analyzeImage(
            imageData
        );

    if (!text) {

        throw new Error(
            "ไม่สามารถอ่านข้อความจากภาพได้"
        );

    }

    if (type === "reels") {

        return generateReelsCaption(
            text
        );

    }

    if (type === "facebook") {

        return generateFacebookCaption(
            text
        );

    }

    throw new Error(
        "ไม่รู้จักประเภทแคปชัน"
    );

}


// ==========================================
// REELS
// ==========================================

function generateReelsCaption(
    text
) {

    return `🎬 แคปชัน Reel

🔥 ของชิ้นนี้น่าสนใจมาก 👀

ใครกำลังมองหาของใช้แบบนี้ ลองดูก่อนเลย

📝 ข้อมูลที่อ่านได้จากภาพ

${text}

✨ เหมาะกับคนที่กำลังมองหาของใช้ที่ช่วยเพิ่มความสะดวกในชีวิตประจำวัน

🛒 สนใจลองดูรายละเอียดสินค้าได้เลย 👇

[ใส่ Affiliate Link ตรงนี้]

#ของน่าใช้ #ของใช้ในบ้าน #ป้ายยา #Shopee`;
}


// ==========================================
// FACEBOOK
// ==========================================

function generateFacebookCaption(
    text
) {

    return `[ใส่ Affiliate Link ตรงนี้]

🔥 เจอของน่าใช้มาอีกแล้ว 👀

ใครกำลังมองหาของแบบนี้ ลองดูรายละเอียดก่อนนะ

📝 ข้อมูลจากภาพสินค้า

${text}

✨ ใครกำลังหาของใช้ที่ช่วยให้ชีวิตสะดวกขึ้น ลองกดเข้าไปดูรายละเอียดได้เลย

🛍️ สนใจดูสินค้า 👇

[ใส่ Affiliate Link ตรงนี้]

#ของน่าใช้ #ของใช้ในบ้าน #ป้ายยา #Shopee`;
}