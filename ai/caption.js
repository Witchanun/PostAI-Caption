// ==========================================
// PostAI
// Caption Generator
// Gemini via Vercel API
// ==========================================

const API_URL =
    "https://post-ai-caption.vercel.app/api/generate";


// ==========================================
// GENERATE CAPTION
// ==========================================

export async function generateCaption(
    imageData
) {

    if (!imageData) {

        throw new Error(
            "ไม่พบรูปสินค้า"
        );

    }


    try {

        const response =
            await fetch(
                API_URL,
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


        // ==================================
        // READ RESPONSE
        // ==================================

        const data =
            await response.json();


        // ==================================
        // ERROR
        // ==================================

        if (!response.ok) {

            console.error(
                "PostAI API Error:",
                data
            );


            throw new Error(
                data?.error ||
                "ไม่สามารถสร้างแคปชันได้"
            );

        }


        // ==================================
        // RESULT
        // ==================================

        if (!data?.result) {

            throw new Error(
                "Gemini ไม่ได้ส่งแคปชันกลับมา"
            );

        }


        return data.result;

    }

    catch (error) {

        console.error(
            "Caption generation error:",
            error
        );


        if (
            error instanceof TypeError
        ) {

            throw new Error(
                "ไม่สามารถเชื่อมต่อ Vercel API ได้"
            );

        }


        throw error;

    }

}