// ==========================================
// PostAI
// Qwen2.5-VL-3B Vision Model
// Client-side only
// ==========================================

import {
    pipeline,
    env
} from "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1";


// ==========================================
// CONFIG
// ==========================================

// ONNX checkpoint hosted on Hugging Face.
// The model files are downloaded by the browser.
// The image itself is processed locally.

const MODEL_NAME =
    "huggingworld/Qwen2.5-VL-3B-Instruct-ONNX";


// ==========================================
// ENVIRONMENT
// ==========================================

env.allowLocalModels =
    false;

env.allowRemoteModels =
    true;


// ==========================================
// STATE
// ==========================================

let visionPipeline =
    null;

let loadingPromise =
    null;


// ==========================================
// LOAD MODEL
// ==========================================

export async function loadVisionModel(
    onProgress = null
) {

    if (visionPipeline) {

        return visionPipeline;

    }


    if (loadingPromise) {

        return loadingPromise;

    }


    loadingPromise =
        createPipeline(
            onProgress
        );


    try {

        visionPipeline =
            await loadingPromise;


        return visionPipeline;

    }

    catch (error) {

        console.error(
            "Qwen Vision loading error:",
            error
        );

        throw new Error(
            "ไม่สามารถโหลด Qwen Vision Model ได้: " +
            (
                error?.message ||
                error
            )
        );

    }

    finally {

        loadingPromise =
            null;

    }

}


// ==========================================
// CREATE PIPELINE
// ==========================================

async function createPipeline(
    onProgress
) {

    // IMPORTANT:
    // We intentionally use the task declared
    // by the current ONNX checkpoint.

    const pipe =
        await pipeline(
            "image-text-to-image",
            MODEL_NAME,
            {

                device:
                    "webgpu",

                dtype:
                    "q4f16",

                progress_callback:
                    progress => {

                        if (
                            !onProgress
                        ) {

                            return;

                        }


                        if (
                            typeof progress?.progress
                            === "number"
                        ) {

                            onProgress(
                                progress.progress
                            );

                        }

                    }

            }
        );


    return pipe;

}


// ==========================================
// ANALYZE IMAGE
// ==========================================

export async function analyzeImage(
    imageSource
) {

    if (!imageSource) {

        throw new Error(
            "ไม่พบรูปสินค้า"
        );

    }


    const model =
        await loadVisionModel();


    // ======================================
    // PRODUCT ANALYSIS PROMPT
    // ======================================

    const prompt = `
Analyze this product screenshot carefully.

Extract ONLY information that is actually visible
or clearly readable in the image.

Focus on:

1. Product type
2. Product purpose
3. Size / volume / capacity
4. Quantity / number of pieces
5. Important functions
6. Visible product features
7. How the product is used
8. Who the product is suitable for

Do NOT invent information.

Do NOT guess prices.

Do NOT invent brand names.

Return the information clearly in Thai.

Use this format:

ประเภทสินค้า:
รายละเอียด:
ขนาด:
จำนวน:
ฟังก์ชัน:
จุดเด่น:
การใช้งาน:
เหมาะกับใคร:

If something cannot be read from the image,
leave it blank.
`;


    try {

        const result =
            await model(
                imageSource,
                {
                    text:
                        prompt,

                    max_new_tokens:
                        500,

                    do_sample:
                        false

                }
            );


        console.log(
            "Qwen raw result:",
            result
        );


        return parseModelResult(
            result
        );

    }

    catch (error) {

        console.error(
            "Qwen image analysis error:",
            error
        );


        throw new Error(
            "Qwen ไม่สามารถวิเคราะห์รูปภาพได้: " +
            (
                error?.message ||
                error
            )
        );

    }

}


// ==========================================
// PARSE MODEL RESULT
// ==========================================

function parseModelResult(
    result
) {

    let text =
        extractText(
            result
        );


    if (!text) {

        return {

            type: "",

            description: "",

            size: "",

            quantity: "",

            features: [],

            usage: "",

            suitableFor: "",

            raw: ""

        };

    }


    text =
        text.trim();


    console.log(
        "Qwen extracted text:",
        text
    );


    return {

        type:
            extractField(
                text,
                "ประเภทสินค้า"
            ),

        description:
            extractField(
                text,
                "รายละเอียด"
            ),

        size:
            extractField(
                text,
                "ขนาด"
            ),

        quantity:
            extractField(
                text,
                "จำนวน"
            ),

        features:
            extractFeatures(
                text
            ),

        usage:
            extractField(
                text,
                "การใช้งาน"
            ),

        suitableFor:
            extractField(
                text,
                "เหมาะกับใคร"
            ),

        raw:
            text

    };

}


// ==========================================
// EXTRACT TEXT
// ==========================================

function extractText(
    result
) {

    if (!result) {

        return "";

    }


    if (
        typeof result === "string"
    ) {

        return result;

    }


    if (
        Array.isArray(result)
    ) {

        return result
            .map(
                item => {

                    if (
                        typeof item ===
                        "string"
                    ) {

                        return item;

                    }


                    return (
                        item?.generated_text ||
                        item?.text ||
                        ""
                    );

                }
            )
            .filter(Boolean)
            .join("\n");

    }


    if (
        result.generated_text
    ) {

        return String(
            result.generated_text
        );

    }


    if (
        result.text
    ) {

        return String(
            result.text
        );

    }


    return "";

}


// ==========================================
// EXTRACT FIELD
// ==========================================

function extractField(
    text,
    field
) {

    const escaped =
        field.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        );


    const regex =
        new RegExp(
            `${escaped}\\s*[:：]\\s*([^\\n]+)`,
            "i"
        );


    const match =
        text.match(
            regex
        );


    if (!match) {

        return "";

    }


    const value =
        match[1]
            .trim();


    if (
        value === "-" ||
        value === "ไม่พบ" ||
        value === "ไม่ระบุ"
    ) {

        return "";

    }


    return value;

}


// ==========================================
// FEATURES
// ==========================================

function extractFeatures(
    text
) {

    const value =
        extractField(
            text,
            "จุดเด่น"
        );


    if (!value) {

        return [];

    }


    return value
        .split(
            /[,،|/•]+/
        )
        .map(
            item =>
                item.trim()
        )
        .filter(Boolean)
        .slice(
            0,
            5
        );

}


// ==========================================
// MODEL STATUS
// ==========================================

export function isModelLoaded() {

    return Boolean(
        visionPipeline
    );

}