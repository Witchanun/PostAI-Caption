// ==========================================
// PostAI
// Client-side OCR
// ==========================================

import {
    pipeline
} from "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.7.2";


// ==========================================
// CONFIG
// ==========================================

const MODEL_NAME =
    "Xenova/trocr-small-printed";


// ==========================================
// MODEL STATE
// ==========================================

let ocrPipeline = null;

let loadingPromise = null;


// ==========================================
// LOAD OCR MODEL
// ==========================================

export async function loadVisionModel() {

    if (ocrPipeline) {

        return ocrPipeline;

    }

    if (loadingPromise) {

        return loadingPromise;

    }

    loadingPromise =
        pipeline(
            "image-to-text",
            MODEL_NAME,
            {
                device: "wasm"
            }
        );

    try {

        ocrPipeline =
            await loadingPromise;

        return ocrPipeline;

    } catch (error) {

        console.error(
            "OCR model loading error:",
            error
        );

        throw error;

    } finally {

        loadingPromise = null;

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

    const result =
        await model(
            imageSource,
            {
                max_new_tokens: 256
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
        typeof result === "object"
    ) {

        return (
            result.generated_text ||
            result.text ||
            ""
        );

    }

    return String(result);

}


// ==========================================
// MODEL STATUS
// ==========================================

export function isModelLoaded() {

    return Boolean(
        ocrPipeline
    );

}