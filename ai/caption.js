// ==========================================
// PostAI
// Natural Affiliate Caption Generator
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
    // NORMALIZE
    // ======================================

    const product =
        normalizeProductInfo(
            productInfo
        );


    // ======================================
    // RETURN BOTH
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
// NORMALIZE PRODUCT DATA
// ==========================================

function normalizeProductInfo(
    data
) {

    const emptyProduct = {

        type: "",
        description: "",
        size: "",
        quantity: "",
        features: [],
        usage: "",
        extra: ""

    };


    if (!data) {

        return emptyProduct;

    }


    // ======================================
    // STRING
    // ======================================

    if (
        typeof data === "string"
    ) {

        return parseText(
            data
        );

    }


    // ======================================
    // ARRAY
    // ======================================

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

        return parseText(
            text
        );

    }


    // ======================================
    // OBJECT
    // ======================================

    return {

        type:
            cleanText(
                data.type ||
                data.product_type ||
                data.category ||
                ""
            ),

        description:
            cleanText(
                data.description ||
                data.generated_text ||
                data.text ||
                ""
            ),

        size:
            cleanText(
                data.size ||
                data.volume ||
                data.capacity ||
                ""
            ),

        quantity:
            cleanText(
                data.quantity ||
                data.amount ||
                ""
            ),

        features:
            normalizeFeatures(
                data.features
            ),

        usage:
            cleanText(
                data.usage ||
                data.use ||
                ""
            ),

        extra:
            cleanText(
                data.extra ||
                data.details ||
                ""
            )

    };

}


// ==========================================
// PARSE RAW TEXT
// ==========================================

function parseText(
    text
) {

    const clean =
        cleanText(
            text
        );


    return {

        type:
            detectProductType(
                clean
            ),

        description:
            clean,

        size:
            detectSize(
                clean
            ),

        quantity:
            detectQuantity(
                clean
            ),

        features:
            [],

        usage:
            "",

        extra:
            ""

    };

}


// ==========================================
// PRODUCT TYPE
// ==========================================

function detectProductType(
    text
) {

    const lower =
        text.toLowerCase();


    const types = [

        [
            [
                "cleansing milk",
                "คลีนซิ่งมิลค์",
                "cleansing"
            ],
            "คลีนซิ่งมิลค์"
        ],

        [
            [
                "micellar",
                "ไมเซลล่า"
            ],
            "ไมเซลล่า วอเตอร์"
        ],

        [
            [
                "sunscreen",
                "กันแดด"
            ],
            "ครีมกันแดด"
        ],

        [
            [
                "shampoo",
                "แชมพู"
            ],
            "แชมพู"
        ],

        [
            [
                "conditioner",
                "ครีมนวด"
            ],
            "ครีมนวดผม"
        ],

        [
            [
                "face wash",
                "facial cleanser",
                "โฟมล้างหน้า",
                "คลีนเซอร์"
            ],
            "โฟมล้างหน้า"
        ],

        [
            [
                "serum",
                "เซรั่ม"
            ],
            "เซรั่ม"
        ],

        [
            [
                "lotion",
                "โลชั่น"
            ],
            "โลชั่น"
        ],

        [
            [
                "cream",
                "ครีม"
            ],
            "ครีมบำรุงผิว"
        ],

        [
            [
                "mop",
                "ไม้ถูพื้น"
            ],
            "ไม้ถูพื้น"
        ],

        [
            [
                "broom",
                "ไม้กวาด"
            ],
            "ไม้กวาด"
        ],

        [
            [
                "storage",
                "กล่องเก็บของ",
                "กล่องจัดเก็บ"
            ],
            "กล่องจัดเก็บของ"
        ],

        [
            [
                "rack",
                "shelf",
                "ชั้นวาง"
            ],
            "ชั้นวางของ"
        ],

        [
            [
                "egg cooker",
                "เครื่องต้มไข่"
            ],
            "เครื่องต้มไข่"
        ],

        [
            [
                "vacuum",
                "เครื่องดูดฝุ่น"
            ],
            "เครื่องดูดฝุ่น"
        ]

    ];


    for (
        const [keywords, result]
        of types
    ) {

        for (
            const keyword
            of keywords
        ) {

            if (
                lower.includes(
                    keyword
                )
            ) {

                return result;

            }

        }

    }


    return "ของใช้ชิ้นนี้";

}


// ==========================================
// SIZE
// ==========================================

function detectSize(
    text
) {

    const match =
        text.match(
            /(\d+(?:\.\d+)?)\s*(ml|มล|g|กรัม|kg|กก|l|ลิตร)/i
        );


    if (!match) {

        return "";

    }


    return match[0];

}


// ==========================================
// QUANTITY
// ==========================================

function detectQuantity(
    text
) {

    const patterns = [

        /แพ็ก\s*(\d+)/i,

        /pack\s*(\d+)/i,

        /(\d+)\s*ชิ้น/i,

        /(\d+)\s*ขวด/i,

        /(\d+)\s*กล่อง/i,

        /(\d+)\s*อัน/i,

        /(\d+)\s*pcs/i

    ];


    for (
        const pattern
        of patterns
    ) {

        const match =
            text.match(
                pattern
            );


        if (match) {

            if (
                match[0]
                    .toLowerCase()
                    .includes("แพ็ก")
            ) {

                return match[0];

            }


            return `${match[1]} ชิ้น`;

        }

    }


    return "";

}


// ==========================================
// FEATURES
// ==========================================

function normalizeFeatures(
    features
) {

    if (
        !Array.isArray(features)
    ) {

        return [];

    }


    return features
        .map(
            feature =>
                cleanText(
                    feature
                )
        )
        .filter(Boolean)
        .slice(
            0,
            5
        );

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


    const details =
        buildProductDetails(
            product
        );


    const featureText =
        buildFeatureText(
            product
        );


    return `🔗 [แปะ Affiliate Link ตรงนี้]

👀 อันนี้คนที่กำลังหาอยู่ต้องลองส่อง!

${type} ที่ดูแล้วน่าใช้กว่าที่คิด ✨

${details}

${featureText}

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


    const details =
        buildProductDetails(
            product
        );


    const featureText =
        buildFeatureText(
            product
        );


    return `🔗 [แปะ Affiliate Link ตรงนี้]

✨ ใครกำลังหาของแบบนี้อยู่ ลองดูตัวนี้ก่อน!

🛍️ ${capitalizeFirst(
        type
    )}

${details}

${featureText}

จุดที่น่าสนใจคือเป็นของที่เอาไปใช้ในชีวิตประจำวันได้จริง เหมาะกับคนที่กำลังมองหาตัวช่วยดี ๆ แบบนี้อยู่ 👀

ถ้าดูแล้วตรงกับที่กำลังหาอยู่ ลองกดเข้าไปส่องรายละเอียดเพิ่มเติมก่อนได้เลย 👇

#ของน่าใช้ #ของใช้ในบ้าน #ป้ายยา #ของดีบอกต่อ`;
}


// ==========================================
// BUILD PRODUCT DETAILS
// ==========================================

function buildProductDetails(
    product
) {

    const parts = [];


    if (
        product.description
    ) {

        const description =
            cleanDescription(
                product.description
            );


        if (
            description
        ) {

            parts.push(
                description
            );

        }

    }


    if (
        product.size &&
        !containsValue(
            product.description,
            product.size
        )
    ) {

        parts.push(
            `ขนาด ${product.size}`
        );

    }


    if (
        product.quantity &&
        !containsValue(
            product.description,
            product.quantity
        )
    ) {

        parts.push(
            product.quantity
        );

    }


    if (
        product.usage
    ) {

        parts.push(
            product.usage
        );

    }


    if (
        product.extra
    ) {

        parts.push(
            product.extra
        );

    }


    if (
        parts.length === 0
    ) {

        return `เป็น${product.type}ที่เหมาะสำหรับใช้ในชีวิตประจำวัน ✨`;

    }


    return parts
        .join(" ")
        .trim();

}


// ==========================================
// FEATURES TEXT
// ==========================================

function buildFeatureText(
    product
) {

    if (
        !product.features ||
        product.features.length === 0
    ) {

        return "";

    }


    const features =
        product.features
            .slice(
                0,
                4
            )
            .map(
                feature =>
                    `✨ ${feature}`
            )
            .join("\n");


    return `จุดที่น่าสนใจ 👇\n${features}`;

}


// ==========================================
// CLEAN DESCRIPTION
// ==========================================

function cleanDescription(
    text
) {

    if (!text) {

        return "";

    }


    let result =
        cleanText(
            text
        );


    // Remove common AI labels

    result =
        result.replace(
            /^(description|product description|รายละเอียดสินค้า|ข้อมูลสินค้า)\s*[:：-]?\s*/i,
            ""
        );


    // Remove price information

    result =
        result.replace(
            /(?:฿|บาท)\s*\d[\d,.]*/gi,
            ""
        );


    result =
        result.replace(
            /\d[\d,.]*\s*(?:บาท|฿)/gi,
            ""
        );


    // Remove URLs

    result =
        result.replace(
            /https?:\/\/\S+/gi,
            ""
        );


    return result.trim();

}


// ==========================================
// TEXT HELPERS
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


function containsValue(
    text,
    value
) {

    if (
        !text ||
        !value
    ) {

        return false;

    }


    return String(text)
        .toLowerCase()
        .includes(
            String(value)
                .toLowerCase()
        );

}


function capitalizeFirst(
    text
) {

    if (!text) {

        return "";

    }


    return text.charAt(0)
        .toUpperCase() +
        text.slice(1);

}