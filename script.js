const subscribeBtn = document.getElementById("subscribeBtn");
const unlockBtn = document.getElementById("unlockBtn");
const status = document.getElementById("status");
const message = document.getElementById("message");


// =====================================
// YOUR YOUTUBE CHANNEL
// =====================================

const youtubeChannel =
    "https://www.youtube.com/@RbxWild";


// =====================================
// GET FILE NAME FROM URL
// =====================================

const params = new URLSearchParams(
    window.location.search
);

const fileName = params.get("file");


// =====================================
// GET FILE LINK
// =====================================

const fileLink = files[fileName];


// =====================================
// REQUIRED TIME
// =====================================

const REQUIRED_TIME = 15000;


// =====================================
// STORAGE KEY
// =====================================

const storageKey =
    `youtube_unlock_${fileName}`;


// =====================================
// LOAD SAVED PROGRESS
// =====================================

let progress;

try {

    progress = JSON.parse(
        localStorage.getItem(storageKey)
    );

} catch (error) {

    progress = null;
}


if (!progress) {

    progress = {
        started: false,
        elapsed: 0,
        completed: false
    };
}


// =====================================
// SESSION VARIABLES
// =====================================

let waitingForReturn = false;

let leftAt = null;


// =====================================
// SAVE PROGRESS
// =====================================

function saveProgress() {

    localStorage.setItem(
        storageKey,
        JSON.stringify(progress)
    );
}


// =====================================
// CHECK FILE
// =====================================

if (!fileLink) {

    document.querySelector(".container").innerHTML = `
        <h1>File Not Found</h1>

        <p>
            The requested file does not exist.
        </p>
    `;

} else {


    // =====================================
    // RESTORE COMPLETED STATE
    // =====================================

    if (progress.completed) {

        unlockBtn.disabled = false;

        unlockBtn.textContent =
            "🔓 Unlock";

        unlockBtn.classList.add(
            "unlock-ready"
        );

        message.textContent =
            "You're ready! Click Unlock to continue.";

        status.textContent = "";

    }


    // =====================================
    // SUBSCRIBE BUTTON
    // =====================================

    subscribeBtn.addEventListener(
        "click",
        () => {

            // Already completed
            if (progress.completed) {
                return;
            }


            // =================================
            // START ONLY ONCE
            // =================================

            if (!progress.started) {

                progress.started = true;

                progress.elapsed = 0;

                saveProgress();
            }


            // =================================
            // DON'T RESET PREVIOUS TIME
            // =================================

            subscribeBtn.disabled = true;

            unlockBtn.disabled = true;

            unlockBtn.textContent =
                "🔒 Unlock";

            status.textContent = "";

            status.className = "";


            message.textContent =
                "Subscribe to our YouTube channel and enable all notifications.";


            // =================================
            // RECORD DEPARTURE
            // =================================

            leftAt = Date.now();

            waitingForReturn = true;


            // =================================
            // OPEN YOUTUBE
            // =================================

            window.open(
                youtubeChannel,
                "_blank"
            );

        }
    );


    // =====================================
    // USER RETURNS TO WEBSITE
    // =====================================

    document.addEventListener(
        "visibilitychange",
        () => {

            if (!waitingForReturn) {
                return;
            }


            if (
                document.visibilityState !==
                "visible"
            ) {
                return;
            }


            if (!leftAt) {
                return;
            }


            // =================================
            // CALCULATE THIS SESSION
            // =================================

            const timeAway =
                Date.now() - leftAt;


            // =================================
            // ADD TO PREVIOUS TIME
            // =================================

            progress.elapsed += timeAway;


            // Stop current session
            waitingForReturn = false;

            leftAt = null;


            // Save progress
            saveProgress();


            // =================================
            // CHECK 15 SECONDS
            // =================================

            if (
                progress.elapsed >=
                REQUIRED_TIME
            ) {

                // Completed
                progress.completed = true;

                saveProgress();


                // Enable Unlock
                unlockBtn.disabled = false;

                unlockBtn.textContent =
                    "🔓 Unlock";


                // Restart animation
                unlockBtn.classList.remove(
                    "unlock-ready"
                );

                void unlockBtn.offsetWidth;

                unlockBtn.classList.add(
                    "unlock-ready"
                );


                status.textContent = "";

                status.className = "";


                message.textContent =
                    "You're ready! Click Unlock to continue.";


                return;
            }


            // =================================
            // NOT ENOUGH TIME YET
            // =================================

            subscribeBtn.disabled = false;

            unlockBtn.disabled = true;

            unlockBtn.textContent =
                "🔒 Unlock";


            status.textContent =
                "Please subscribe and enable all notifications to unlock the link.";

            status.className =
                "status-error";


            message.textContent =
                "Subscribe to our YouTube channel and enable all notifications.";

        }
    );


    // =====================================
    // UNLOCK BUTTON
    // =====================================

    unlockBtn.addEventListener(
        "click",
        () => {

            if (!progress.completed) {
                return;
            }


            unlockBtn.textContent =
                "Opening...";


            setTimeout(
                () => {

                    window.location.href =
                        fileLink;

                },
                250
            );

        }
    );

}
