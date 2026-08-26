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


            resultText.value =
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


        resultText.value =
            "";

    }
);


// ==========================================
// REELS
// ==========================================

reelsBtn.addEventListener(
    "click",
    () => {

        generate(
            "reels"
        );

    }
);


// ==========================================
// FACEBOOK
// ==========================================

facebookBtn.addEventListener(
    "click",
    () => {

        generate(
            "facebook"
        );

    }
);


// ==========================================
// GENERATE
// ==========================================

async function generate(
    type
) {

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
                imageData,
                type
            );


        resultText.value =
            result;


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
            error
        );


        alert(
            error.message ||
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

        loadingSection.classList.remove(
            "hidden"
        );


        reelsBtn.disabled =
            true;


        facebookBtn.disabled =
            true;

    }

    else {

        loadingSection.classList.add(
            "hidden"
        );


        reelsBtn.disabled =
            false;


        facebookBtn.disabled =
            false;

    }

}


// ==========================================
// COPY
// ==========================================

copyBtn.addEventListener(
    "click",
    async () => {

        if (
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

        catch {

            resultText.select();

            document.execCommand(
                "copy"
            );

        }

    }
);