// ==========================================
// PostAI
// Main Script
// ==========================================

import {
    generateCaption
} from "./ai/caption.js";


// ==========================================
// ELEMENTS
// ==========================================

const imageInput =
    document.getElementById(
        "imageInput"
    );

const dropZone =
    document.getElementById(
        "dropZone"
    );

const previewSection =
    document.getElementById(
        "previewSection"
    );

const previewImage =
    document.getElementById(
        "previewImage"
    );

const removeImageBtn =
    document.getElementById(
        "removeImageBtn"
    );

const actionsSection =
    document.getElementById(
        "actionsSection"
    );

const reelsBtn =
    document.getElementById(
        "reelsBtn"
    );

const facebookBtn =
    document.getElementById(
        "facebookBtn"
    );

const loadingSection =
    document.getElementById(
        "loadingSection"
    );

const resultSection =
    document.getElementById(
        "resultSection"
    );

const resultText =
    document.getElementById(
        "resultText"
    );

const copyBtn =
    document.getElementById(
        "copyBtn"
    );


// ==========================================
// STATE
// ==========================================

let imageData =
    null;


// ==========================================
// FILE SELECT
// ==========================================

imageInput?.addEventListener(
    "change",
    event => {

        const file =
            event.target.files?.[0];


        if (file) {

            loadImage(
                file
            );

        }

    }
);


// ==========================================
// CTRL + V
// ==========================================

document.addEventListener(
    "paste",
    event => {

        const items =
            event.clipboardData?.items;


        if (!items) {

            return;

        }


        for (
            const item of items
        ) {

            if (
                item.type.startsWith(
                    "image/"
                )
            ) {

                const file =
                    item.getAsFile();


                if (file) {

                    loadImage(
                        file
                    );

                    event.preventDefault();

                }


                return;

            }

        }

    }
);


// ==========================================
// DRAG OVER
// ==========================================

dropZone?.addEventListener(
    "dragover",
    event => {

        event.preventDefault();

        dropZone.classList.add(
            "dragover"
        );

    }
);


// ==========================================
// DRAG LEAVE
// ==========================================

dropZone?.addEventListener(
    "dragleave",
    () => {

        dropZone.classList.remove(
            "dragover"
        );

    }
);


// ==========================================
// DROP
// ==========================================

dropZone?.addEventListener(
    "drop",
    event => {

        event.preventDefault();


        dropZone.classList.remove(
            "dragover"
        );


        const file =
            event.dataTransfer
                ?.files?.[0];


        if (file) {

            loadImage(
                file
            );

        }

    }
);


// ==========================================
// LOAD IMAGE
// ==========================================

function loadImage(
    file
) {

    if (
        !file.type.startsWith(
            "image/"
        )
    ) {

        alert(
            "กรุณาเลือกไฟล์รูปภาพ"
        );

        return;

    }


    const reader =
        new FileReader();


    reader.onload =
        event => {

            imageData =
                event.target.result;


            if (previewImage) {

                previewImage.src =
                    imageData;

            }


            previewSection?.classList.remove(
                "hidden"
            );


            actionsSection?.classList.remove(
                "hidden"
            );


            resultSection?.classList.add(
                "hidden"
            );


            if (resultText) {

                resultText.value =
                    "";

            }

        };


    reader.readAsDataURL(
        file
    );

}


// ==========================================
// REMOVE
// ==========================================

removeImageBtn?.addEventListener(
    "click",
    () => {

        imageData =
            null;


        if (imageInput) {

            imageInput.value =
                "";

        }


        if (previewImage) {

            previewImage.src =
                "";

        }


        previewSection?.classList.add(
            "hidden"
        );


        actionsSection?.classList.add(
            "hidden"
        );


        resultSection?.classList.add(
            "hidden"
        );


        if (resultText) {

            resultText.value =
                "";

        }

    }
);


// ==========================================
// GENERATE BUTTONS
// ==========================================

reelsBtn?.addEventListener(
    "click",
    generate
);


facebookBtn?.addEventListener(
    "click",
    generate
);


// ==========================================
// GENERATE
// ==========================================

async function generate() {

    if (!imageData) {

        alert(
            "กรุณาใส่รูปสินค้าก่อน"
        );

        return;

    }


    setLoading(
        true
    );


    try {

        const result =
            await generateCaption(
                imageData
            );


        if (resultText) {

            resultText.value =
                `🎬 REELS CAPTION

${result.reels}


━━━━━━━━━━━━━━━━━━━━


📘 FACEBOOK POST

${result.facebook}`;

        }


        resultSection?.classList.remove(
            "hidden"
        );


        resultSection?.scrollIntoView({
            behavior:
                "smooth",

            block:
                "start"
        });

    }

    catch (error) {

        console.error(
            "PostAI error:",
            error
        );


        alert(
            error?.message ||
            "เกิดข้อผิดพลาดในการสร้างแคปชัน"
        );

    }

    finally {

        setLoading(
            false
        );

    }

}


// ==========================================
// LOADING
// ==========================================

function setLoading(
    loading
) {

    loadingSection?.classList.toggle(
        "hidden",
        !loading
    );


    if (reelsBtn) {

        reelsBtn.disabled =
            loading;

    }


    if (facebookBtn) {

        facebookBtn.disabled =
            loading;

    }

}


// ==========================================
// COPY
// ==========================================

copyBtn?.addEventListener(
    "click",
    async () => {

        if (
            !resultText?.value
        ) {

            return;

        }


        try {

            await navigator.clipboard.writeText(
                resultText.value
            );


            const oldText =
                copyBtn.textContent;


            copyBtn.textContent =
                "✅ คัดลอกแล้ว";


            setTimeout(
                () => {

                    copyBtn.textContent =
                        oldText;

                },
                1500
            );

        }

        catch {

            resultText.select();

            document.execCommand(
                "copy"
            );

        }

    }
);