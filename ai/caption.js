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


    const productInfo =
        await analyzeImage(
            imageData
        );


    if (type === "reels") {

        return generateReelsCaption(
            productInfo
        );

    }


    if (type === "facebook") {

        return generateFacebookCaption(
            productInfo
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
    product
) {

    return `🎬 REELS CAPTION

🔥 HOOK

${product.name || "ของชิ้นนี้"} ใครกำลังหาอะไรแบบนี้อยู่ ลองดูอันนี้ก่อน 👀


💡 เนื้อหา

${product.description || "ดูรายละเอียดจากภาพสินค้า"}


✨ จุดเด่น

${formatFeatures(
        product.features
    )}


🛒 CTA

ใครสนใจลองกดเข้าไปดูรายละเอียดสินค้าก่อนได้เลย 👇

${product.url || "[ใส่ Affiliate Link ตรงนี้]"}


หมายเหตุ:
แคปชันนี้สร้างจากข้อมูลที่มองเห็นในภาพสินค้า
`;
}


// ==========================================
// FACEBOOK
// ==========================================

function generateFacebookCaption(
    product
) {

    return `[ใส่ Affiliate Link ตรงนี้]


🔥 ${product.name || "เจอของน่าใช้มาอีกแล้ว"}

${product.description || ""}


✨ จุดเด่น

${formatFeatures(
        product.features
    )}


💰 ราคา

${product.price || "ไม่พบราคาในภาพ"}


🛍️ ใครกำลังมองหาของแบบนี้ ลองกดเข้าไปดูรายละเอียดก่อนได้เลย 👇

${product.url || "[ใส่ Affiliate Link ตรงนี้]"}


#ของใช้ในบ้าน #ของน่าใช้ #ป้ายยา
`;
}


// ==========================================
// FEATURES
// ==========================================

function formatFeatures(
    features
) {

    if (
        !Array.isArray(features) ||
        features.length === 0
    ) {

        return "✨ ดูรายละเอียดจากภาพสินค้า";

    }

    return features
        .map(
            feature =>
                `✨ ${feature}`
        )
        .join("\n");

}