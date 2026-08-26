// ==========================================
// PostAI V2
// Client-side Vision AI
// ==========================================

import {
    pipeline,
    env
} from "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.7.2";


// ==========================================
// CONFIG
// ==========================================

const MODEL_NAME =
    "Salesforce/blip-image-captioning-base";


env.allowLocalModels = false;
env.allowRemoteModels = true;


// ==========================================
// MODEL STATE
// ==========================================

let visionPipeline = null;

let loadingPromise = null;


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
        createPipeline("webgpu");


    try {

        visionPipeline =
            await loadingPromise;


        if (onProgress) {

            onProgress(100);

        }


        return visionPipeline;

    }

    catch (error) {

        console.warn(
            "WebGPU ใช้งานไม่ได้ กำลังเปลี่ยนเป็น WASM",
            error
        );


        loadingPromise =
            createPipeline("wasm");


        visionPipeline =
            await loadingPromise;


        return visionPipeline;

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
    device
) {

    return await pipeline(
        "image-to-text",
        MODEL_NAME,
        {

            device,

            dtype:
                device === "webgpu"
                    ? "q4"
                    : "q8"

        }
    );

}


// ==========================================
// ANALYZE IMAGE
// ==========================================

export async function analyzeImage(
    imageSource
) {

    const model =
        await loadVisionModel();


    const result =
        await model(
            imageSource,
            {

                max_new_tokens:
                    150,

                do_sample:
                    false

            }
        );


    return normalizeResult(
        result
    );

}


// ==========================================
// NORMALIZE RESULT
// ==========================================

function normalizeResult(
    result
) {

    if (!result) {

        return "";

    }


    if (
        Array.isArray(result)
    ) {

        return result
            .map(
                item =>
                    item?.generated_text ||
                    item?.text ||
                    ""
            )
            .filter(Boolean)
            .join("\n");

    }


    if (
        typeof result ===
        "object"
    ) {

        return (
            result.generated_text ||
            result.text ||
            ""
        );

    }


    return String(
        result
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