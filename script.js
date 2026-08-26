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

let selectedFile =
    null;

let imageData =
    null;


// ==========================================
// FILE SELECT
// ==========================================

if (imageInput) {

    imageInput.addEventListener(
        "change",
        event => {

            const file =
                event.target.files?.[0];


            if (!file) {

                return;

            }


            loadImage(
                file
            );

        }
    );

}


// ==========================================
// CTRL + V
// ==========================================

document.addEventListener(
    "paste",
    event => {

        const clipboardData =
            event.clipboardData;


        if (!clipboardData) {

            return;

        }


        const items =
            clipboardData.items;


        if (!items) {

            return;

        }


        for (
            const item of items
        ) {

            if (
                item.type &&
                item.type.startsWith(
                    "image/"
                )
            ) {

                const file =
                    item.getAsFile();


                if (!file) {

                    return;

                }


                loadImage(
                    file
                );


                event.preventDefault();


                return;

            }

        }

    }
);


// ==========================================
// DRAG OVER
// ==========================================

if (dropZone) {

    dropZone.addEventListener(
        "dragover",
        event => {

            event.preventDefault();


            dropZone.classList.add(
                "dragover"
            );

        }
    );

}


// ==========================================
// DRAG LEAVE
// ==========================================

if (dropZone) {

    dropZone.addEventListener(
        "dragleave",
        () => {

            dropZone.classList.remove(
                "dragover"
            );

        }
    );

}


// ==========================================
// DROP
// ==========================================

if (dropZone) {

    dropZone.addEventListener(
        "drop",
        event => {

            event.preventDefault();


            dropZone.classList.remove(
                "dragover"
            );


            const file =
                event.dataTransfer
                    ?.files?.[0];


            if (!file) {

                return;

            }


            loadImage(
                file
            );

        }
    );

}


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


    selectedFile =
        file;


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


            if (previewSection) {

                previewSection.classList.remove(
                    "hidden"
                );

            }


            if (actionsSection) {

                actionsSection.classList.remove(
                    "hidden"
                );

            }


            if (resultSection) {

                resultSection.classList.add(
                    "hidden"
                );

            }


            if (resultText) {

                resultText.value =
                    "";

            }


            if (previewSection) {

                previewSection.scrollIntoView({
                    behavior:
                        "smooth",

                    block:
                        "center"
                });

            }

        };


    reader.onerror =
        () => {

            alert(
                "ไม่สามารถอ่านรูปภาพได้"
            );

        };


    reader.readAsDataURL(
        file
    );

}


// ==========================================
// REMOVE IMAGE
// ==========================================

if (removeImageBtn) {

    removeImageBtn.addEventListener(
        "click",
        () => {

            selectedFile =
                null;


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


            if (previewSection) {

                previewSection.classList.add(
                    "hidden"
                );

            }


            if (actionsSection) {

                actionsSection.classList.add(
                    "hidden"
                );

            }


            if (resultSection) {

                resultSection.classList.add(
                    "hidden"
                );

            }


            if (resultText) {

                resultText.value =
                    "";

            }

        }
    );

}


// ==========================================
// REELS BUTTON
// ==========================================
//
// Generate ทั้ง Reel + Facebook
// ในการกดครั้งเดียว
//

if (reelsBtn) {

    reelsBtn.addEventListener(
        "click",
        () => {

            generate();

        }
    );

}


// ==========================================
// FACEBOOK BUTTON
// ==========================================
//
// Generate ทั้ง Reel + Facebook
// ในการกดครั้งเดียว
//

if (facebookBtn) {

    facebookBtn.addEventListener(
        "click",
        () => {

            generate();

        }
    );

}


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


        // ==================================
        // RESULT
        // ==================================

        const reels =
            result?.reels ||
            "ไม่สามารถสร้างแคปชัน Reel ได้";


        const facebook =
            result?.facebook ||
            "ไม่สามารถสร้าง Facebook Post ได้";


        // ==================================
        // SHOW BOTH
        // ==================================

        if (resultText) {

            resultText.value =
                `🎬 REELS CAPTION

${reels}


━━━━━━━━━━━━━━━━━━━━━━━━━━━━


📘 FACEBOOK POST

${facebook}`;

        }


        // ==================================
        // SHOW RESULT
        // ==================================

        if (resultSection) {

            resultSection.classList.remove(
                "hidden"
            );


            resultSection.scrollIntoView({
                behavior:
                    "smooth",

                block:
                    "start"
            });

        }

    }

    catch (error) {

        console.error(
            "PostAI Generate Error:",
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

    if (loading) {

        if (loadingSection) {

            loadingSection.classList.remove(
                "hidden"
            );

        }


        if (reelsBtn) {

            reelsBtn.disabled =
                true;

        }


        if (facebookBtn) {

            facebookBtn.disabled =
                true;

        }

    }

    else {

        if (loadingSection) {

            loadingSection.classList.add(
                "hidden"
            );

        }


        if (reelsBtn) {

            reelsBtn.disabled =
                false;

        }


        if (facebookBtn) {

            facebookBtn.disabled =
                false;

        }

    }

}


// ==========================================
// COPY
// ==========================================

if (copyBtn) {

    copyBtn.addEventListener(
        "click",
        async () => {

            if (
                !resultText ||
                !resultText.value
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

            catch (
            error
            ) {

                console.error(
                    "Copy error:",
                    error
                );


                resultText.select();


                document.execCommand(
                    "copy"
                );

            }

        }
    );

}