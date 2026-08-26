// ==========================================
// PostAI
// Caption Generator
// Gemini 2.5 Flash via Vercel API
// ==========================================

export async function generateCaption(
    imageData
) {

    if (!imageData) {

        throw new Error(
            "ไม่พบรูปสินค้า"
        );

    }


    // ======================================
    // CALL VERCEL API
    // ======================================

    const response =
        await fetch(
            "/api/generate",
            {

                method:
                    "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify({

                        image:
                            imageData

                    })

            }
        );


    // ======================================
    // READ RESPONSE
    // ======================================

    const data =
        await response.json();


    // ======================================
    // ERROR
    // ======================================

    if (!response.ok) {

        console.error(
            "PostAI API Error:",
            data
        );

        throw new Error(
            data.error ||
            "ไม่สามารถสร้างแคปชันได้"
        );

    }


    // ======================================
    // RESULT
    // ======================================

    if (!data.result) {

        throw new Error(
            "Gemini ไม่ได้ส่งแคปชันกลับมา"
        );

    }


    return data.result;

}