// ==========================================
// PostAI
// Frontend
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

const generateBtn =
    document.getElementById(
        "generateBtn"
    );

const loadingSection =
    document.getElementById(
        "loadingSection"
    );

const resultSection =
    document.getElementById(
        "resultSection"
    );

const reelsResult =
    document.getElementById(
        "reelsResult"
    );

const facebookResult =
    document.getElementById(
        "facebookResult"
    );

const copyReelsBtn =
    document.getElementById(
        "copyReelsBtn"
    );

const copyFacebookBtn =
    document.getElementById(
        "copyFacebookBtn"
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

            loadImage(file);

        }
    );

}


// ==========================================
// PASTE IMAGE
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


                loadImage(file);

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


            loadImage(file);

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

            const originalData =
                event.target.result;


            // Resize/compress ก่อนส่ง API
            prepareImage(
                originalData
            );

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
// PREPARE IMAGE
// ==========================================

function prepareImage(
    originalData
) {

    const img =
        new Image();


    img.onload =
        () => {

            const maxSize =
                1600;


            let width =
                img.naturalWidth;

            let height =
                img.naturalHeight;


            // ==============================
            // RESIZE
            // ==============================

            if (
                width > maxSize ||
                height > maxSize
            ) {

                if (
                    width > height
                ) {

                    height =
                        Math.round(
                            height *
                            maxSize /
                            width
                        );

                    width =
                        maxSize;

                }

                else {

                    width =
                        Math.round(
                            width *
                            maxSize /
                            height
                        );

                    height =
                        maxSize;

                }

            }


            const canvas =
                document.createElement(
                    "canvas"
                );


            canvas.width =
                width;

            canvas.height =
                height;


            const ctx =
                canvas.getContext(
                    "2d"
                );


            ctx.drawImage(
                img,
                0,
                0,
                width,
                height
            );


            // ==============================
            // JPEG
            // ==============================

            imageData =
                canvas.toDataURL(
                    "image/jpeg",
                    0.82
                );


            // ==============================
            // PREVIEW
            // ==============================

            if (previewImage) {

                previewImage.src =
                    imageData;

            }


            // ==============================
            // SHOW
            // ==============================

            previewSection?.classList.remove(
                "hidden"
            );

            actionsSection?.classList.remove(
                "hidden"
            );


            resultSection?.classList.add(
                "hidden"
            );


            if (reelsResult) {

                reelsResult.value =
                    "";

            }


            if (facebookResult) {

                facebookResult.value =
                    "";

            }


            previewSection?.scrollIntoView({
                behavior:
                    "smooth",

                block:
                    "center"

            });

        };


    img.onerror =
        () => {

            alert(
                "ไม่สามารถประมวลผลรูปภาพได้"
            );

        };


    img.src =
        originalData;

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


            previewSection?.classList.add(
                "hidden"
            );

            actionsSection?.classList.add(
                "hidden"
            );

            resultSection?.classList.add(
                "hidden"
            );


            if (reelsResult) {

                reelsResult.value =
                    "";

            }


            if (facebookResult) {

                facebookResult.value =
                    "";

            }

        }
    );

}


// ==========================================
// GENERATE
// ==========================================

if (generateBtn) {

    generateBtn.addEventListener(
        "click",
        generate
    );

}


// ==========================================
// GENERATE FUNCTION
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


        // ==============================
        // SPLIT RESULT
        // ==============================

        const reels =
            extractSection(
                result,
                "=== REELS ===",
                "=== FACEBOOK ==="
            );


        const facebook =
            extractSection(
                result,
                "=== FACEBOOK ===",
                null
            );


        // ==============================
        // DISPLAY
        // ==============================

        if (reelsResult) {

            reelsResult.value =
                reels.trim();

        }


        if (facebookResult) {

            facebookResult.value =
                facebook.trim();

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
            "Generate error:",
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
// EXTRACT SECTION
// ==========================================

function extractSection(
    text,
    startMarker,
    endMarker
) {

    if (!text) {
        return "";
    }


    const startIndex =
        text.indexOf(
            startMarker
        );


    if (startIndex === -1) {

        return text;

    }


    const contentStart =
        startIndex +
        startMarker.length;


    if (!endMarker) {

        return text
            .slice(
                contentStart
            )
            .trim();

    }


    const endIndex =
        text.indexOf(
            endMarker,
            contentStart
        );


    if (endIndex === -1) {

        return text
            .slice(
                contentStart
            )
            .trim();

    }


    return text
        .slice(
            contentStart,
            endIndex
        )
        .trim();

}


// ==========================================
// LOADING
// ==========================================

function setLoading(
    loading
) {

    if (loading) {

        loadingSection?.classList.remove(
            "hidden"
        );


        if (generateBtn) {

            generateBtn.disabled =
                true;

            generateBtn.textContent =
                "🧠 กำลังคิดแคปชัน...";

        }

    }

    else {

        loadingSection?.classList.add(
            "hidden"
        );


        if (generateBtn) {

            generateBtn.disabled =
                false;

            generateBtn.textContent =
                "✨ สร้างแคปชัน";

        }

    }

}


// ==========================================
// COPY REELS
// ==========================================

if (copyReelsBtn) {

    copyReelsBtn.addEventListener(
        "click",
        () => {

            copyText(
                reelsResult,
                copyReelsBtn
            );

        }
    );

}


// ==========================================
// COPY FACEBOOK
// ==========================================

if (copyFacebookBtn) {

    copyFacebookBtn.addEventListener(
        "click",
        () => {

            copyText(
                facebookResult,
                copyFacebookBtn
            );

        }
    );

}


// ==========================================
// COPY TEXT
// ==========================================

async function copyText(
    textarea,
    button
) {

    if (
        !textarea ||
        !textarea.value
    ) {

        return;

    }


    try {

        await navigator
            .clipboard
            .writeText(
                textarea.value
            );


        const oldText =
            button.textContent;


        button.textContent =
            "✅ คัดลอกแล้ว";


        setTimeout(
            () => {

                button.textContent =
                    oldText;

            },
            1500
        );

    }

    catch {

        textarea.select();

        document.execCommand(
            "copy"
        );

    }

}