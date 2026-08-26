import {
    generateCaptions
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

let selectedFile = null;

let imageData = null;


// ==========================================
// FILE SELECT
// ==========================================

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

dropZone.addEventListener(
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

dropZone.addEventListener(
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

dropZone.addEventListener(
    "drop",
    event => {

        event.preventDefault();

        dropZone.classList.remove(
            "dragover"
        );

        const file =
            event.dataTransfer.files?.[0];

        if (!file) {

            return;

        }

        loadImage(file);

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

    selectedFile =
        file;

    const reader =
        new FileReader();

    reader.onload =
        event => {

            imageData =
                event.target.result;

            previewImage.src =
                imageData;

            previewSection.classList.remove(
                "hidden"
            );

            actionsSection.classList.remove(
                "hidden"
            );

            resultSection.classList.add(
                "hidden"
            );

            reelsResult.value =
                "";

            facebookResult.value =
                "";

            previewSection.scrollIntoView({
                behavior:
                    "smooth",
                block:
                    "center"
            });

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

removeImageBtn.addEventListener(
    "click",
    () => {

        selectedFile =
            null;

        imageData =
            null;

        imageInput.value =
            "";

        previewImage.src =
            "";

        previewSection.classList.add(
            "hidden"
        );

        actionsSection.classList.add(
            "hidden"
        );

        resultSection.classList.add(
            "hidden"
        );

        reelsResult.value =
            "";

        facebookResult.value =
            "";

    }
);


// ==========================================
// GENERATE
// ==========================================

generateBtn.addEventListener(
    "click",
    () => {

        generate();

    }
);


// ==========================================
// GENERATE BOTH
// ==========================================

async function generate() {

    if (!imageData) {

        alert(
            "กรุณาใส่รูปสินค้าก่อน"
        );

        return;

    }

    setLoading(true);

    try {

        const result =
            await generateCaptions(
                imageData
            );

        reelsResult.value =
            result.reels;

        facebookResult.value =
            result.facebook;

        resultSection.classList.remove(
            "hidden"
        );

        resultSection.scrollIntoView({
            behavior:
                "smooth"
        });

    }

    catch (error) {

        console.error(
            "Caption generation error:",
            error
        );

        alert(
            error.message ||
            "เกิดข้อผิดพลาดในการสร้างแคปชัน"
        );

    }

    finally {

        setLoading(false);

    }

}


// ==========================================
// LOADING
// ==========================================

function setLoading(
    loading
) {

    if (loading) {

        loadingSection.classList.remove(
            "hidden"
        );

        generateBtn.disabled =
            true;

    }

    else {

        loadingSection.classList.add(
            "hidden"
        );

        generateBtn.disabled =
            false;

    }

}


// ==========================================
// COPY REELS
// ==========================================

copyReelsBtn.addEventListener(
    "click",
    async () => {

        await copyText(
            reelsResult,
            copyReelsBtn
        );

    }
);


// ==========================================
// COPY FACEBOOK
// ==========================================

copyFacebookBtn.addEventListener(
    "click",
    async () => {

        await copyText(
            facebookResult,
            copyFacebookBtn
        );

    }
);


// ==========================================
// COPY TEXT
// ==========================================

async function copyText(
    textarea,
    button
) {

    if (!textarea.value) {

        return;

    }

    const oldText =
        button.textContent;

    try {

        await navigator.clipboard.writeText(
            textarea.value
        );

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

}