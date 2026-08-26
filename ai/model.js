// ==========================================
// PostAI
// Vision Model
// Client-side
// ==========================================

import {
    pipeline,
    env
} from "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1";


// ==========================================
// CONFIG
// ==========================================

const MODEL_NAME =
    "HuggingFaceTB/SmolVLM-256M-Instruct";

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
        pipeline(
            "image-text-to-text",
            MODEL_NAME,
            {

                device:
                    "webgpu",

                dtype:
                    "q4",

                progress_callback:
                    progress => {

                        if (
                            onProgress &&
                            typeof progress?.progress ===
                            "number"
                        ) {

                            onProgress(
                                progress.progress
                            );

                        }

                    }

            }
        );


    try {

        visionPipeline =
            await loadingPromise;


        return visionPipeline;

    }

    catch (error) {

        console.error(
            "Vision model error:",
            error
        );

        throw error;

    }

    finally {

        loadingPromise =
            null;

    }

}


// ==========================================
// ANALYZE IMAGE
// ==========================================

export async function analyzeImage(
    imageSource
) {

    const model =
        await loadVisionModel();


    const prompt = `
อ่านข้อความและรายละเอียดจากภาพสินค้านี้อย่างละเอียด

ดึงเฉพาะข้อมูลที่มองเห็นหรืออ่านข้อความได้จริง

ต้องการข้อมูล:
- ประเภทสินค้า
- รายละเอียดสินค้า
- ขนาดหรือความจุ
- จำนวน
- ฟังก์ชัน
- จุดเด่น
- วิธีใช้งาน
- เหมาะกับใคร

ห้ามแต่งข้อมูลที่ไม่มีในภาพ
ห้ามเดาราคา
ห้ามเดาชื่อแบรนด์

ตอบเป็นภาษาไทยตามรูปแบบ:

ประเภทสินค้า:
รายละเอียด:
ขนาด:
จำนวน:
ฟังก์ชัน:
จุดเด่น:
การใช้งาน:
เหมาะกับใคร:
`;


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
        "Vision result:",
        result
    );


    return parseResult(
        result
    );

}


// ==========================================
// PARSE RESULT
// ==========================================

function parseResult(
    result
) {

    let text = "";


    if (
        Array.isArray(result)
    ) {

        text =
            result
                .map(
                    item =>
                        item?.generated_text ||
                        item?.text ||
                        ""
                )
                .filter(Boolean)
                .join("\n");

    }

    else if (
        typeof result === "string"
    ) {

        text =
            result;

    }

    else {

        text =
            result?.generated_text ||
            result?.text ||
            "";

    }


    text =
        String(text)
            .trim();


    console.log(
        "Vision text:",
        text
    );


    return {

        type:
            getField(
                text,
                "ประเภทสินค้า"
            ),

        description:
            getField(
                text,
                "รายละเอียด"
            ),

        size:
            getField(
                text,
                "ขนาด"
            ),

        quantity:
            getField(
                text,
                "จำนวน"
            ),

        function:
            getField(
                text,
                "ฟังก์ชัน"
            ),

        features:
            getField(
                text,
                "จุดเด่น"
            ),

        usage:
            getField(
                text,
                "การใช้งาน"
            ),

        suitableFor:
            getField(
                text,
                "เหมาะกับใคร"
            ),

        raw:
            text

    };

}


// ==========================================
// FIELD
// ==========================================

function getField(
    text,
    field
) {

    const regex =
        new RegExp(
            `${field}\\s*[:：]\\s*([^\\n]+)`,
            "i"
        );


    const match =
        text.match(
            regex
        );


    return match
        ? match[1].trim()
        : "";

}


// ==========================================
// STATUS
// ==========================================

export function isModelLoaded() {

    return Boolean(
        visionPipeline
    );

}