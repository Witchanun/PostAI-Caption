// ==========================================
// PostAI V2
// AI Vision Model
// Client-side only
// ==========================================

import {
    pipeline,
    env
} from "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.7.2";


// ==========================================
// CONFIG
// ==========================================

const MODEL_NAME =
    "HuggingFaceTB/SmolVLM-256M-Instruct";


// ไม่ใช้ Hugging Face server-side API
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
        pipeline(
            "image-text-to-text",
            MODEL_NAME,
            {
                device:
                    "webgpu",

                dtype:
                    "q4"
            }
        );


    try {

        visionPipeline =
            await loadingPromise;


        if (onProgress) {
            onProgress(100);
        }


        return visionPipeline;

    }

    catch (error) {

        console.error(
            "Vision model loading error:",
            error
        );


        // ==================================
        // FALLBACK
        // ==================================

        try {

            loadingPromise =
                pipeline(
                    "image-text-to-text",
                    MODEL_NAME,
                    {
                        device:
                            "wasm",

                        dtype:
                            "q8"
                    }
                );


            visionPipeline =
                await loadingPromise;


            return visionPipeline;

        }

        catch (fallbackError) {

            console.error(
                "Vision fallback error:",
                fallbackError
            );


            throw fallbackError;

        }

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
    imageSource,
    prompt
) {

    const model =
        await loadVisionModel();


    const result =
        await model(
            imageSource,
            {
                text:
                    prompt,

                max_new_tokens:
                    300,

                do_sample:
                    false
            }
        );


    return result;

}


// ==========================================
// MODEL STATUS
// ==========================================

export function isModelLoaded() {

    return Boolean(
        visionPipeline
    );

}