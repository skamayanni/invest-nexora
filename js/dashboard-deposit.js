"use strict";

document.addEventListener("DOMContentLoaded", function () {

    const depositModal = document.getElementById("depositModal");
    const depositPaymentModal = document.getElementById("depositPaymentModal");

    const openDeposit = document.getElementById("openDeposit");
    const openWithdraw = document.getElementById("openWithdraw");

    const depositClose = document.getElementById("depositClose");
    const depositPaymentClose = document.getElementById("depositPaymentClose");

    const depositForm = document.getElementById("depositForm");
    const depositAmount = document.getElementById("depositAmount");

    const estimatedAmount = document.getElementById("depositEstimatedAmount");
    const paymentAmount = document.getElementById("depositPaymentAmount");

    const depositMessage = document.getElementById("depositMessage");

    const instructions = document.getElementById("depositPaymentInstructions");
    const instructionsTitle = document.getElementById("depositInstructionsTitle");
    const instructionsDescription = document.getElementById("depositInstructionsDescription");

    const supportButton = document.getElementById("depositSupportButton");

    let selectedDepositAmount = 0;

    function formatDepositMoney(amount) {

        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD"
        }).format(amount);

    }

    function openModal(modal) {

        if (modal.classList.contains("trade-modal")) {
            modal.classList.add("show");
        }

        if (modal.classList.contains("modal-overlay")) {
            modal.classList.add("open");
        }

        modal.setAttribute("aria-hidden", "false");

        document.body.classList.add("modal-open");

    }

    function closeModal(modal) {

        modal.classList.remove("show", "active", "open");

        modal.setAttribute("aria-hidden", "true");

        if (
            !document.querySelector(
                ".trade-modal.show, .modal-overlay.open"
            )
        ) {
            document.body.classList.remove("modal-open");
        }

    }

    // OPEN DEPOSIT

    if (openDeposit) {

        openDeposit.addEventListener("click", function () {

            depositForm.reset();

            estimatedAmount.textContent = formatDepositMoney(0);

            depositMessage.textContent = "";

            openModal(depositModal);

            depositAmount.focus();

        });

    }



    // WITHDRAWAL NOTICE

    const withdrawalNotice = document.getElementById("withdrawalNotice");

    if (openWithdraw && withdrawalNotice) {

        openWithdraw.addEventListener("click", function () {
            withdrawalNotice.style.display = "flex";
            document.body.classList.add("modal-open");
        });

    }

    window.closeWithdrawalNotice = function () {

        if (withdrawalNotice) {
            withdrawalNotice.style.display = "none";
            document.body.classList.remove("modal-open");
        }

    };

    // UPDATE DEPOSIT AMOUNT

    depositAmount.addEventListener("input", function () {

        const amount = Number(depositAmount.value);

        estimatedAmount.textContent =
            Number.isFinite(amount) && amount > 0
                ? formatDepositMoney(amount)
                : formatDepositMoney(0);

    });

    // SUBMIT DEPOSIT AMOUNT

    depositForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const amount = Number(depositAmount.value);

        if (!Number.isFinite(amount) || amount <= 0 || amount > 100000000) {

            depositMessage.textContent = "Please enter a valid deposit amount.";

            return;

        }

        selectedDepositAmount = amount;

        paymentAmount.textContent = formatDepositMoney(amount);

        instructions.hidden = true;

        closeModal(depositModal);

        openModal(depositPaymentModal);

    });

    // PAYMENT METHOD SELECTION

    document.querySelectorAll("[data-deposit-method]").forEach(function (button) {

        button.addEventListener("click", function () {

            const method = button.dataset.depositMethod;

            instructions.hidden = false;

            if (method === "crypto") {

                instructionsTitle.textContent = "Cryptocurrency";

                instructionsDescription.textContent =
                    "You selected cryptocurrency for your deposit.";

            } else {

                instructionsTitle.textContent = "Bank Transfer";

                instructionsDescription.textContent =
                    "You selected bank transfer for your deposit.";

            }

            instructions.scrollIntoView({
                behavior: "smooth",
                block: "nearest"
            });

        });

    });

    // CLOSE DEPOSIT MODALS

    if (depositClose) {

        depositClose.addEventListener("click", function () {
            closeModal(depositModal);
        });

    }

    if (depositPaymentClose) {

        depositPaymentClose.addEventListener("click", function () {
            closeModal(depositPaymentModal);
        });

    }

    depositPaymentModal.addEventListener("click", function (event) {

        if (event.target === depositPaymentModal) {
            closeModal(depositPaymentModal);
        }

    });

    // OPEN TAWK.TO CUSTOMER SUPPORT

    if (supportButton) {

        supportButton.addEventListener("click", function () {

            if (
                window.Tawk_API &&
                typeof window.Tawk_API.maximize === "function"
            ) {

                if (typeof window.Tawk_API.showWidget === "function") {
                    window.Tawk_API.showWidget();
                }

                window.Tawk_API.maximize();

            } else {

                alert("Customer support chat is still loading. Please try again shortly.");

            }

        });

    }


    // ESCAPE KEY

    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {

            closeModal(depositModal);
            closeModal(depositPaymentModal);

            if (withdrawalNotice) {
                withdrawalNotice.style.display = "none";
                document.body.classList.remove("modal-open");
            }

        }

    });

});