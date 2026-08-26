// ==========================================
// PostAI
// Natural Caption Generator
// ==========================================

import {
    analyzeImage
} from "./model.js";


// ==========================================
// GENERATE BOTH
// ==========================================

export async function generateCaptions(
    imageData
) {

    if (!imageData) {

        throw new Error(
            "ไม่พบรูปสินค้า"
        );

    }

    // ======================================
    // ANALYZE IMAGE
    // ======================================

    const productInfo =
        await analyzeImage(
            imageData
        );


    // ======================================
    // NORMALIZE DATA
    // ======================================

    const product =
        normalizeProductInfo(
            productInfo
        );


    // ======================================
    // GENERATE BOTH
    // ======================================

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
// NORMALIZE PRODUCT INFO
// ==========================================

function normalizeProductInfo(
    data
) {

    if (!data) {

        return {

            name: "",
            description: "",
            price: "",
            features: []

        };

    }


    // --------------------------------------
    // STRING RESULT
    // --------------------------------------

    if (
        typeof data === "string"
    ) {

        return {

            name: data.trim(),
            description: data.trim(),
            price: "",
            features: []

        };

    }


    // --------------------------------------
    // ARRAY RESULT
    // --------------------------------------

    if (
        Array.isArray(data)
    ) {

        const text =
            data
                .map(
                    item =>
                        item?.generated_text ||
                        item?.text ||
                        ""
                )
                .filter(Boolean)
                .join(" ")
                .trim();

        return {

            name: text,
            description: text,
            price: "",
            features: []

        };

    }


    // --------------------------------------
    // OBJECT RESULT
    // --------------------------------------

    return {

        name:
            data.name ||
            data.title ||
            data.product_name ||
            data.generated_text ||
            data.text ||
            "",

        description:
            data.description ||
            data.generated_text ||
            data.text ||
            "",

        price:
            data.price ||
            "",

        features:
            Array.isArray(
                data.features
            )
                ? data.features
                : []

    };

}


// ==========================================
// REELS CAPTION
// ==========================================

function generateReelsCaption(
    product
) {

    const productName =
        product.name ||
        "ของชิ้นนี้";


    const description =
        makeNaturalDescription(
            product
        );


    return `🔥 เห็นแล้วแบบ… เออ อันนี้น่าใช้

ใครกำลังหาของแบบนี้อยู่ ขอป้ายยาตัวนี้ไว้ก่อนเลย 👀

${description}

เป็นของที่ดูแล้วรู้สึกว่า
“มีไว้ก็น่าจะได้ใช้บ่อยกว่าที่คิด” 😂

ใครสนใจลองส่องรายละเอียดดูก่อนได้เลย
เผื่อเจอของที่กำลังหาอยู่ 👇

[ใส่ Affiliate Link ตรงนี้]

#ของน่าใช้ #ของใช้ในบ้าน #ป้ายยา #ของดีบอกต่อ`;
}


// ==========================================
// FACEBOOK CAPTION
// ==========================================

function generateFacebookCaption(
    product
) {

    const description =
        makeNaturalDescription(
            product
        );


    const priceText =
        product.price
            ? `\n\n💸 ${product.price}`
            : "";


    return `[ใส่ Affiliate Link ตรงนี้]

👀 เจอของน่าใช้มาอีกแล้ว

${description}${priceText}

ชอบตรงที่เป็นของที่ดูแล้วเอาไปใช้ในชีวิตประจำวันได้จริง
ใครกำลังมองหาของประมาณนี้ ลองเข้าไปดูรายละเอียดก่อนก็ได้

บางทีของที่ดูเหมือนธรรมดา
แต่พอมีติดบ้านไว้แล้วมันสะดวกขึ้นเยอะเลย 😂

👇 ใครสนใจกดเข้าไปส่องได้เลย

[ใส่ Affiliate Link ตรงนี้]

#ของน่าใช้ #ของใช้ในบ้าน #ป้ายยา #ของดีบอกต่อ`;
}


// ==========================================
// NATURAL DESCRIPTION
// ==========================================

function makeNaturalDescription(
    product
) {

    const name =
        cleanText(
            product.name
        );


    const description =
        cleanText(
            product.description
        );


    // --------------------------------------
    // HAVE NAME + DESCRIPTION
    // --------------------------------------

    if (
        name &&
        description &&
        description !== name
    ) {

        return `${name} 👀

จากที่เห็นในรูป จุดที่น่าสนใจคือ ${description}`;

    }


    // --------------------------------------
    // HAVE NAME
    // --------------------------------------

    if (name) {

        return `ตัวนี้คือ ${name} 👀`;

    }


    // --------------------------------------
    // HAVE DESCRIPTION
    // --------------------------------------

    if (description) {

        return `จากรูปแล้วตัวนี้ดูน่าสนใจตรงที่ ${description} 👀`;

    }


    // --------------------------------------
    // NOTHING
    // --------------------------------------

    return "ตัวนี้เห็นแล้วรู้สึกว่าน่าเอามาลองใช้ดูเลย 👀";

}


// ==========================================
// CLEAN TEXT
// ==========================================

function cleanText(
    value
) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }

    return String(value)
        .replace(
            /\s+/g,
            " "
        )
        .replace(
            /^["'`]+|["'`]+$/g,
            ""
        )
        .trim();

}