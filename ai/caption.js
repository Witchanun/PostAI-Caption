// ==========================================
// PostAI V2
// Caption Generator
// Client-side only
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


    // ======================================
    // AI อ่านภาพ
    // ======================================

    const imageDescription =
        await analyzeImage(
            imageData
        );


    if (!imageDescription) {

        throw new Error(
            "AI ไม่สามารถอ่านข้อมูลจากรูปได้"
        );

    }


    // ======================================
    // REELS
    // ======================================

    if (type === "reels") {

        return generateReelsCaption(
            imageDescription
        );

    }


    // ======================================
    // FACEBOOK
    // ======================================

    if (type === "facebook") {

        return generateFacebookCaption(
            imageDescription
        );

    }


    throw new Error(
        "ไม่รู้จักประเภทแคปชัน"
    );

}


// ==========================================
// REELS CAPTION
// ==========================================

function generateReelsCaption(
    description
) {

    return `🎬 แคปชัน Reel

🔥 ใครกำลังมองหาของแบบนี้อยู่ ต้องลองดู 👀

จากภาพนี้เป็นสินค้าที่ดูน่าสนใจและเหมาะกับการใช้งานในชีวิตประจำวัน

📝 ข้อมูลที่ AI มองเห็นจากภาพ

${description}

✨ เหมาะกับคนที่กำลังมองหาของใช้ที่ช่วยให้ชีวิตสะดวกขึ้น

🛒 สนใจลองกดดูรายละเอียดสินค้าได้เลย 👇

[ใส่ Affiliate Link ตรงนี้]

#ของน่าใช้ #ของใช้ในบ้าน #ป้ายยา #Shopee`;
}


// ==========================================
// FACEBOOK CAPTION
// ==========================================

function generateFacebookCaption(
    description
) {

    return `[ใส่ Affiliate Link ตรงนี้]

🔥 เจอของน่าใช้มาอีกแล้ว 👀

ใครกำลังมองหาของแบบนี้ ลองดูรายละเอียดก่อนตัดสินใจนะ

📝 ข้อมูลจากภาพสินค้า

${description}

✨ ดูแล้วเป็นอีกชิ้นที่น่าสนใจสำหรับคนที่อยากได้ของใช้ดี ๆ มาเพิ่มความสะดวกในชีวิตประจำวัน

🛍️ ใครสนใจ กดเข้าไปดูรายละเอียดสินค้าได้เลย 👇

[ใส่ Affiliate Link ตรงนี้]

#ของน่าใช้ #ของใช้ในบ้าน #ป้ายยา #Shopee`;
}