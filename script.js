const subscribeBtn = document.getElementById("subscribeBtn");
const unlockBtn = document.getElementById("unlockBtn");
const status = document.getElementById("status");
const message = document.getElementById("message");


// =====================================
// رابط قناتك
// =====================================

const youtubeChannel =
    "https://www.youtube.com/@RbxWild";


// =====================================
// قراءة اسم الملف من الرابط
// مثال:
// ?file=video1
// =====================================

const params = new URLSearchParams(
    window.location.search
);

const fileName = params.get("file");


// =====================================
// الحصول على رابط الملف
// =====================================

const fileLink = files[fileName];


// =====================================
// الوقت المطلوب
// 15 ثانية
// =====================================

const REQUIRED_TIME = 15000;


// =====================================
// حالة المستخدم
// =====================================

// الوقت الذي تم جمعه حتى الآن
let elapsedTime = 0;

// هل المستخدم ضغط Subscribe مرة واحدة؟
let subscribedStarted = false;

// هل نحن حاليًا ننتظر رجوع المستخدم؟
let waitingForReturn = false;

// وقت خروج المستخدم من الموقع
let leftAt = null;

// هل تم فتح الرابط النهائي؟
let completed = false;


// =====================================
// التأكد من وجود الملف
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
    // زر Subscribe
    // =====================================

    subscribeBtn.addEventListener(
        "click",
        () => {

            // لو المستخدم ضغط Subscribe قبل كده
            // لا نفتح YouTube مرة أخرى
            if (subscribedStarted) {
                return;
            }


            // =================================
            // تسجيل أن العملية بدأت
            // =================================

            subscribedStarted = true;


            // =================================
            // تعطيل الزر
            // =================================

            subscribeBtn.disabled = true;


            // =================================
            // تغيير الرسالة
            // =================================

            message.textContent =
                "Subscribe to our YouTube channel and enable all notifications.";


            status.textContent = "";

            status.className = "";


            // =================================
            // تسجيل وقت الخروج
            // =================================

            leftAt = Date.now();

            waitingForReturn = true;


            // =================================
            // فتح YouTube
            // =================================

            window.open(
                youtubeChannel,
                "_blank"
            );
        }
    );


    // =====================================
    // مراقبة رجوع المستخدم للموقع
    // =====================================

    document.addEventListener(
        "visibilitychange",
        () => {

            // =================================
            // المستخدم خرج من الموقع
            // =================================

            if (
                document.visibilityState ===
                "hidden"
            ) {

                // لازم يكون ضغط Subscribe أولاً
                if (
                    subscribedStarted &&
                    !completed
                ) {

                    // تسجيل وقت الخروج
                    leftAt = Date.now();

                    waitingForReturn = true;
                }

                return;
            }


            // =================================
            // المستخدم رجع للموقع
            // =================================

            if (
                document.visibilityState !==
                "visible"
            ) {
                return;
            }


            // لا يوجد خروج مسجل
            if (!leftAt) {
                return;
            }


            // =================================
            // حساب مدة الغياب
            // =================================

            const timeAway =
                Date.now() - leftAt;


            // =================================
            // إضافة الوقت للوقت السابق
            // =================================

            elapsedTime += timeAway;


            // تنظيف حالة الخروج الحالية
            leftAt = null;

            waitingForReturn = false;


            // =================================
            // هل وصلنا لـ 15 ثانية؟
            // =================================

            if (
                elapsedTime >=
                REQUIRED_TIME
            ) {

                completed = true;


                // =================================
                // فتح Unlock
                // =================================

                unlockBtn.disabled = false;

                unlockBtn.textContent =
                    "🔓 Unlock";


                // تشغيل الأنيميشن من جديد
                unlockBtn.classList.remove(
                    "unlock-ready"
                );

                void unlockBtn.offsetWidth;

                unlockBtn.classList.add(
                    "unlock-ready"
                );


                message.textContent =
                    "You're ready! Click Unlock to continue.";


                status.textContent = "";

                status.className = "";


                return;
            }


            // =================================
            // لم يكتمل الوقت بعد
            // =================================

            subscribeBtn.disabled = true;


            // مهم:
            // لا نطلب منه الضغط على Subscribe مرة ثانية
            // =================================

            status.textContent =
                "Please subscribe to unlock the link.";

            status.className =
                "status-error";


            message.textContent =
                "Keep the subscription process open until the link is unlocked.";
        }
    );


    // =====================================
    // زر Unlock
    // =====================================

    unlockBtn.addEventListener(
        "click",
        () => {

            if (!completed) {
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
