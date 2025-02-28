import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

import crossIcon from "../img/cross.png";
import closeIcon from "../img/close.png";

const datePicker = document.querySelector("#datetime-picker");
const startButton = document.querySelector("[data-start]");
const daysEl = document.querySelector("[data-days]");
const hoursEl = document.querySelector("[data-hours]");
const minutesEl = document.querySelector("[data-minutes]");
const secondsEl = document.querySelector("[data-seconds]");

let userSelectedDate = null;
let countdownInterval = null;

const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
        const selectedTime = selectedDates[0];
        if (selectedTime <= new Date()) {
            iziToast.error({
                title: "Error",
                message: "Please choose a date in the future",
                position: "topRight",
                backgroundColor: "#ef4040",
                titleColor: "#ffffff",
                messageColor: "#ffffff",
                iconUrl: crossIcon,
                close: false,
                buttons: [
                    [
                        `<button class="toast-close-btn">
                <img src="${closeIcon}" style="width: 12px; height: 12px;">
            </button>`,
                        function (instance, toast) {
                            instance.hide({ transitionOut: "fadeOut" }, toast);
                        },
                    ],
                ],
            });
            startButton.disabled = true;
        } else {
            userSelectedDate = selectedTime;
            startButton.disabled = false;
        }
    },
};

flatpickr(datePicker, options);

startButton.addEventListener("click", () => {
    if (!userSelectedDate) return;

    startButton.disabled = true;
    datePicker.disabled = true;

    countdownInterval = setInterval(() => {
        const timeLeft = userSelectedDate - new Date();
        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            updateTimerUI(0, 0, 0, 0);
            datePicker.disabled = false;
            return;
        }

        const { days, hours, minutes, seconds } = convertMs(timeLeft);
        updateTimerUI(days, hours, minutes, seconds);
    }, 1000);
});

function convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    return {
        days: Math.floor(ms / day),
        hours: Math.floor((ms % day) / hour),
        minutes: Math.floor(((ms % day) % hour) / minute),
        seconds: Math.floor((((ms % day) % hour) % minute) / second),
    };
}

function addLeadingZero(value) {
    return String(value).padStart(2, "0");
}

function updateTimerUI(days, hours, minutes, seconds) {
    daysEl.textContent = addLeadingZero(days);
    hoursEl.textContent = addLeadingZero(hours);
    minutesEl.textContent = addLeadingZero(minutes);
    secondsEl.textContent = addLeadingZero(seconds);
}
