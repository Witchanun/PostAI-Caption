// ==========================================
// PostAI
// Natural Affiliate Caption Generator
// ==========================================

import {
    analyzeImage
} from "./model.js";


// ==========================================
// GENERATE BOTH CAPTIONS
// ==========================================

export async function generateCaption(
    imageData
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


    const product =
        normalizeProduct(
            productInfo
        );


    return {

        reels:
            generateReelsCaption(
                product
            ),

        facebook:
            generateFacebookCaption(
                product
            )

    };

}


// ==========================================
// NORMALIZE
// ==========================================

function normalizeProduct(
    data
) {

    return {

        type:
            clean(
                data?.type
            ),

        description:
            clean(
                data?.description
            ),

        size:
            clean(
                data?.size
            ),

        quantity:
            clean(
                data?.quantity
            ),

        features:
            Array.isArray(
                data?.features
            )
                ? data.features
                    .map(
                        clean
                    )
                    .filter(Boolean)
                : [],

        usage:
            clean(
                data?.usage
            ),

        suitableFor:
            clean(
                data?.suitableFor
            )

    };

}


// ==========================================
// REELS
// ==========================================

function generateReelsCaption(
    product
) {

    const type =
        product.type ||
        "ของใช้ชิ้นนี้";


    const hook =
        createHook(
            product
        );


    const details =
        createDetails(
            product
        );


    const features =
        createFeatures(
            product
        );


    const audience =
        product.suitableFor
            ? `\n\nเหมาะกับ ${product.suitableFor}`
            : "";


    return `🔗 [แปะ Affiliate Link ตรงนี้]

${hook}

🛍️ ${type}

${details}

${features}${audience}

ใครกำลังมองหาของแบบนี้อยู่ ลองกดเข้าไปดูรายละเอียดก่อนได้เลย 👇

#ของน่าใช้ #ป้ายยา #ของดีบอกต่อ #น่าใช้`;
}


// ==========================================
// FACEBOOK
// ==========================================

function generateFacebookCaption(
    product
) {

    const type =
        product.type ||
        "ของใช้ชิ้นนี้";


    const hook =
        createFacebookHook(
            product
        );


    const details =
        createDetails(
            product
        );


    const features =
        createFeatures(
            product
        );


    return `🔗 [แปะ Affiliate Link ตรงนี้]

${hook}

🛍️ ${type}

${details}

${features}

${product.usage
            ? `ใช้สำหรับ${product.usage}`
            : ""
        }

${product.suitableFor
            ? `\nเหมาะกับ${product.suitableFor}`
            : ""
        }

ใครกำลังหาของแบบนี้อยู่ ลองกดเข้าไปส่องรายละเอียดก่อนได้เลย 👇✨

#ของน่าใช้ #ของดีบอกต่อ #ป้ายยา #น่าใช้`;
}


// ==========================================
// HOOK
// ==========================================

function createHook(
    product
) {

    const type =
        product.type ||
        "ของชิ้นนี้";


    if (
        product.usage
    ) {

        return `👀 ใครกำลังหาตัวช่วยเรื่อง${product.usage}อยู่ หยุดเลื่อนก่อน!`;

    }


    return `👀 ใครกำลังมองหา${type}อยู่ อันนี้ลองส่องก่อน!`;

}


// ==========================================
// FACEBOOK HOOK
// ==========================================

function createFacebookHook(
    product
) {

    const type =
        product.type ||
        "ของใช้";


    if (
        product.suitableFor
    ) {

        return `✨ ใครกำลังหา${type}อยู่ ลองดูตัวนี้ก่อน`;

    }


    return `✨ เจอ${type}ที่น่าสนใจ เลยเอามาป้ายยา`;
}


// ==========================================
// PRODUCT DETAILS
// ==========================================

function createDetails(
    product
) {

    const parts = [];


    if (
        product.description
    ) {

        parts.push(
            product.description
        );

    }


    const specs = [];


    if (
        product.size
    ) {

        specs.push(
            `ขนาด ${product.size}`
        );

    }


    if (
        product.quantity
    ) {

        specs.push(
            product.quantity
        );

    }


    if (
        specs.length
    ) {

        parts.push(
            specs.join(
                " • "
            )
        );

    }


    if (
        parts.length === 0
    ) {

        return `รายละเอียดที่อ่านได้จากภาพยังไม่เพียงพอ`;

    }


    return parts.join(
        "\n"
    );

}


// ==========================================
// FEATURES
// ==========================================

function createFeatures(
    product
) {

    if (
        !product.features.length
    ) {

        return "";

    }


    const items =
        product.features
            .slice(
                0,
                4
            )
            .map(
                feature =>
                    `✨ ${feature}`
            )
            .join(
                "\n"
            );


    return `\nจุดที่น่าสนใจ 👇\n${items}`;

}


// ==========================================
// CLEAN
// ==========================================

function clean(
    value
) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(
        value
    )
        .replace(
            /\s+/g,
            " "
        )
        .trim();

}