

"use strict";

const AUTH_STORAGE_KEY = "nexora_users";
const SESSION_KEY = "nexora_current_user";
const PORTFOLIO_KEY = "nexora_portfolios";
const TRANSACTIONS_KEY = "nexora_transactions";

const STARTING_BALANCE = 5000;
/* =====================================
   PRECONFIGURED DEMO INVESTOR
===================================== */

// These credentials are for a local demonstration account only.
// Never use hardcoded credentials for a real financial service.

const DEMO_INVESTOR = {

    email: "billionaire@gmail.com",
    password: "Billionaire2026!",

    firstName: "Alex",
    lastName: "Morgan",

    // =================================
    // ACCOUNT BALANCE CONFIGURATION
    // =================================

    cashBalance: 350000,
    
    

    // =================================
    // ILLUSTRATIVE INVESTMENT HOLDINGS
    // =================================

    holdings: [

        {
            symbol: "NVDA",
            quantity: 1,
            averagePrice: 100,
            firstPurchaseDate: "2024-02-15T12:00:00.000Z"
        },

        {
            symbol: "MSFT",
            quantity: 1,
            averagePrice: 350,
            firstPurchaseDate: "2023-08-10T12:00:00.000Z"
        },

        {
            symbol: "AAPL",
            quantity: 1,
            averagePrice: 180,
            firstPurchaseDate: "2023-11-20T12:00:00.000Z"
        },

        {
            symbol: "AMZN",
            quantity: 1,
            averagePrice: 160,
            firstPurchaseDate: "2024-01-12T12:00:00.000Z"
        },

        {
            symbol: "BTC",
            quantity: 1,
            averagePrice: 50000,
            firstPurchaseDate: "2023-06-18T12:00:00.000Z"
        },

        {
            symbol: "ETH",
            quantity: 1,
            averagePrice: 2500,
            firstPurchaseDate: "2023-09-05T12:00:00.000Z"
        },

        {
            symbol: "TSLA",
            quantity: 1,
            averagePrice: 200,
            firstPurchaseDate: "2024-03-22T12:00:00.000Z"
        },

        {
            symbol: "WTI",
            quantity: 1,
            averagePrice: 70,
            firstPurchaseDate: "2024-04-10T12:00:00.000Z"
        }

    ]

};


/* =====================================
   STORAGE HELPERS
===================================== */

function getStoredJSON(key, fallback) {
    try {
        const value = localStorage.getItem(key);

        if (!value) {
            return fallback;
        }

        return JSON.parse(value);

    } catch (error) {
        console.error("Storage read failed:", error);
        return fallback;
    }
}


function setStoredJSON(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}


function getUsers() {
    const users = getStoredJSON(AUTH_STORAGE_KEY, []);

    return Array.isArray(users) ? users : [];
}


function showAuthMessage(message, type = "error") {
    const element = document.getElementById("authMessage");

    if (!element) {
        return;
    }

    element.textContent = message;

    element.style.color =
        type === "success" ? "#32d6a0" : "#ff7185";
}


/* =====================================
   PASSWORD HASHING FOR THE DEMO
===================================== */

async function hashDemoPassword(password) {

    if (!window.crypto || !window.crypto.subtle) {
        throw new Error(
            "Secure browser cryptography is unavailable. " +
            "Open the project using localhost or HTTPS."
        );
    }

    const encodedPassword = new TextEncoder().encode(password);

    const hashBuffer = await crypto.subtle.digest(
        "SHA-256",
        encodedPassword
    );

    return Array.from(new Uint8Array(hashBuffer))
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("");
}


/* =====================================
   DEMO ACCOUNT INITIALIZATION
===================================== */

function initializeDemoAccount(user) {

    // Never initialize ordinary users with predefined investor holdings.
    const portfolios = getStoredJSON(PORTFOLIO_KEY, {});

    if (!portfolios[user.id]) {

        portfolios[user.id] = {
            cashBalance: STARTING_BALANCE,
            holdings: [],
            currency: "USD",
            createdAt: new Date().toISOString(),
            demoPortfolio: true
        };

        setStoredJSON(PORTFOLIO_KEY, portfolios);
    }

    const transactions = getStoredJSON(TRANSACTIONS_KEY, {});

    if (!transactions[user.id]) {

        transactions[user.id] = [];

        setStoredJSON(TRANSACTIONS_KEY, transactions);
    }
}

/* =====================================
   INITIALIZE PRECONFIGURED INVESTOR
===================================== */

function initializePreconfiguredInvestor(user) {

    const portfolios = getStoredJSON(PORTFOLIO_KEY, {});
    const transactions = getStoredJSON(TRANSACTIONS_KEY, {});

    // Only seed the account when it has no saved portfolio.
    // This prevents ordinary logins from resetting balances.
    if (portfolios[user.id]) {
        return;
    }

    const holdings = DEMO_INVESTOR.holdings.map(holding => ({
        ...holding
    }));

    const portfolio = {
        cashBalance: DEMO_INVESTOR.cashBalance,
        holdings,
        currency: "USD",
        createdAt: new Date().toISOString(),
        demoPortfolio: true
    };

    portfolios[user.id] = portfolio;

    transactions[user.id] = createIllustrativeTransactions(holdings);

    setStoredJSON(PORTFOLIO_KEY, portfolios);
    setStoredJSON(TRANSACTIONS_KEY, transactions);
}

/* =====================================
   ILLUSTRATIVE TRANSACTION HISTORY
===================================== */

function createIllustrativeTransactions(holdings) {

    const transactions = [];

    holdings.forEach((holding, index) => {

        const assetNames = {
            NVDA: "NVIDIA",
            MSFT: "Microsoft",
            AAPL: "Apple",
            AMZN: "Amazon",
            BTC: "Bitcoin",
            ETH: "Ethereum",
            TSLA: "Tesla",
            WTI: "WTI Crude Oil"
        };

        const total = holding.quantity * holding.averagePrice;

        const purchaseDate = new Date(holding.firstPurchaseDate);

        transactions.push({
            id: `demo-buy-${holding.symbol}`,
            type: "BUY",
            symbol: holding.symbol,
            name: assetNames[holding.symbol] || holding.symbol,
            quantity: holding.quantity,
            price: holding.averagePrice,
            total,
            date: purchaseDate.toISOString(),
            simulated: true,
            illustrative: true
        });

        // Illustrative partial-sale and reinvestment examples.
        // These entries are educational sample activity, not verified trades.
        if (index < 3) {

            const saleQuantity = holding.quantity * 0.05;
            const saleTotal = saleQuantity * holding.averagePrice * 1.12;

            const saleDate = new Date(purchaseDate);
            saleDate.setMonth(saleDate.getMonth() + 8);

            transactions.push({
                id: `demo-sell-${holding.symbol}`,
                type: "SELL",
                symbol: holding.symbol,
                name: assetNames[holding.symbol] || holding.symbol,
                quantity: saleQuantity,
                price: holding.averagePrice * 1.12,
                total: saleTotal,
                costBasisSold: saleQuantity * holding.averagePrice,
                realizedProfit: saleTotal -
                    saleQuantity * holding.averagePrice,
                date: saleDate.toISOString(),
                simulated: true,
                illustrative: true
            });
        }
    });

    return transactions.sort(
        (a, b) => new Date(a.date) - new Date(b.date)
    );
}


/* =====================================
   CURRENT DEMO SESSION
===================================== */

function getCurrentUser() {

    const userId = sessionStorage.getItem(SESSION_KEY);

    if (!userId) {
        return null;
    }

    const user = getUsers().find(item => item.id === userId);

    return user || null;
}


function setCurrentUser(user) {
    sessionStorage.setItem(SESSION_KEY, user.id);
}


function logoutDemoUser() {
    sessionStorage.removeItem(SESSION_KEY);

    window.location.href = "login.html";
}


/* =====================================
   REGISTRATION
===================================== */

async function handleRegistration(event) {

    event.preventDefault();

    const form = event.currentTarget;

    const firstName =
        document.getElementById("firstName").value.trim();

    const lastName =
        document.getElementById("lastName").value.trim();

    const email =
        document.getElementById("registerEmail").value
            .trim()
            .toLowerCase();

    const password =
        document.getElementById("registerPassword").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;


    if (!firstName || !lastName || !email) {

        showAuthMessage("Please complete all required fields.");

        return;
    }


    if (password.length < 12) {

        showAuthMessage(
            "Please use a password with at least 12 characters."
        );

        return;
    }


    if (password !== confirmPassword) {

        showAuthMessage(
            "Your passwords do not match."
        );

        return;
    }


    const users = getUsers();

    const emailExists = users.some(
        user => user.email === email
    );


    if (emailExists) {

        showAuthMessage(
            "An account with this email already exists in this browser."
        );

        return;
    }


    const submitButton =
        form.querySelector('button[type="submit"]');

    submitButton.disabled = true;
    submitButton.textContent = "Creating demo account...";


    try {

        const passwordHash = await hashDemoPassword(password);

        const user = {

            id: crypto.randomUUID(),

            firstName,
            lastName,
            email,

            passwordHash,

            accountType: "demo",

            createdAt: new Date().toISOString()

        };


        users.push(user);

        setStoredJSON(AUTH_STORAGE_KEY, users);

        initializeDemoAccount(user);

        setCurrentUser(user);

        showAuthMessage(
            "Your demo account has been created.",
            "success"
        );


        window.location.href = "dashboard.html";


    } catch (error) {

        console.error(error);

        showAuthMessage(
            error.message || "Unable to create the demo account."
        );

    } finally {

        submitButton.disabled = false;

        submitButton.innerHTML =
            'Create demo account <i class="fa-solid fa-arrow-right"></i>';

    }

}


/* =====================================
   LOGIN
===================================== */

// Paste this function above your existing handleLogin(event) function:

/* =====================================
   PRECONFIGURED DEMO LOGIN
===================================== */

async function handlePreconfiguredDemoLogin(event) {

    event.preventDefault();

    const form = event.currentTarget;

    const email = document
        .getElementById("loginEmail")
        .value.trim()
        .toLowerCase();

    const password = document
        .getElementById("loginPassword")
        .value;

    if (
        email !== DEMO_INVESTOR.email ||
        password !== DEMO_INVESTOR.password
    ) {
        return false;
    }

    const submitButton = form.querySelector(
        'button[type="submit"]'
    );

    submitButton.disabled = true;
    submitButton.textContent = "Opening demo portfolio...";

    try {

        const users = getUsers();

        let user = users.find(
            item => item.email === DEMO_INVESTOR.email
        );

        if (!user) {

            user = {
                id: crypto.randomUUID(),
                firstName: DEMO_INVESTOR.firstName,
                lastName: DEMO_INVESTOR.lastName,
                email: DEMO_INVESTOR.email,
                passwordHash: await hashDemoPassword(
                    DEMO_INVESTOR.password
                ),
                accountType: "preconfigured-demo",
                createdAt: new Date().toISOString()
            };

            users.push(user);

            setStoredJSON(AUTH_STORAGE_KEY, users);
        }

        initializePreconfiguredInvestor(user);

        setCurrentUser(user);

        window.location.href = "dashboard.html";

    } catch (error) {

        console.error(error);

        showAuthMessage(
            error.message || "Unable to open the demo portfolio."
        );

        submitButton.disabled = false;
        submitButton.innerHTML =
            'Log in <i class="fa-solid fa-arrow-right"></i>';
    }

    return true;
}

/* =====================================
   LOGIN
===================================== */

async function handleLogin(event) {

    event.preventDefault();

    // Handle the predefined investor account first.
    const isPreconfiguredDemo =
        await handlePreconfiguredDemoLogin(event);

    if (isPreconfiguredDemo) {
        return;
    }

    const form = event.currentTarget;

    // This above 3 lines  lets the predefined credentials open the sample portfolio while other registered users continue through your existing login process.

    const email =
        document.getElementById("loginEmail").value
            .trim()
            .toLowerCase();

    const password =
        document.getElementById("loginPassword").value;


    const users = getUsers();

    const user = users.find(
        item => item.email === email
    );


    if (!user) {

        showAuthMessage(
            "Unable to log in with those details. Check your email and password."
        );

        return;
    }


    const submitButton =
        form.querySelector('button[type="submit"]');

    submitButton.disabled = true;
    submitButton.textContent = "Signing in...";


    try {

        const passwordHash = await hashDemoPassword(password);


        if (passwordHash !== user.passwordHash) {

            showAuthMessage(
                "Unable to log in with those details. Check your email and password."
            );

            return;
        }


        initializeDemoAccount(user);

        setCurrentUser(user);

        window.location.href = "dashboard.html";


    } catch (error) {

        console.error(error);

        showAuthMessage(
            error.message || "Unable to log in."
        );

    } finally {

        submitButton.disabled = false;

        submitButton.innerHTML =
            'Log in <i class="fa-solid fa-arrow-right"></i>';

    }

}


/* =====================================
   FORM EVENT LISTENERS
===================================== */

document.addEventListener("DOMContentLoaded", () => {

    const registrationForm =
        document.getElementById("registerForm");

    if (registrationForm) {

        registrationForm.addEventListener(
            "submit",
            handleRegistration
        );

    }


    const loginForm =
        document.getElementById("loginForm");

    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            handleLogin
        );

    }

});
