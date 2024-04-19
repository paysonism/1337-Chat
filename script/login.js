const signUpButton = document.getElementById("signUp");
const signInButton = document.getElementById("signIn");
const container = document.getElementById("container");

signUpButton.addEventListener("click", () => {
    container.classList.add("right-panel-active");
});

signInButton.addEventListener("click", () => {
    container.classList.remove("right-panel-active");
});

const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 5000,
});
Toast.fire({
    icon: "success",
    title: "Welcome to 1337!\n\nMade By Payson\ngithub.com/paysonism",
});

// signup

const signupForm = document.getElementById("signUpForm");
signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const payload = {
        name: signupForm.signUpName.value,
        email: signupForm.signUpEmail.value,
        password: signupForm.signUpPassword.value,
        picture:
            signupForm.signUpUrl.value == ""
                ? "https://i.ibb.co/n3Fdjtf/default-pfp.png"
                : signupForm.signUpUrl.value,
    };
    register(payload);
});

const register = async (payload) => {
    try {
        const res = await fetch("https://one337-chat.onrender.com/user/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });
        let data = await res.json();
        if (data.success) {
            Toast.fire({
                icon: "success",
                title: "Successfully Registered",
            });
            signupForm.signUpName.value = "";
            signupForm.signUpEmail.value = "";
            signupForm.signUpPassword.value = "";
            signupForm.signUpUrl.value = "";
        } else {
            Toast.fire({
                icon: "error",
                title: data.error,
            });
        }
    } catch (error) {
        Swal.fire({
            title: "Error!",
            text: "Bad request 404",
            icon: "error",
            confirmButtonText: "Retry",
        });
    }
};

// login

const loginForm = document.getElementById("loginForm");
loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const payload = {
        email: loginForm.loginEmail.value,
        password: loginForm.loginPassword.value,
    };
    login(payload);
});

const login = async (payload) => {
    try {
        const res = await fetch("https://one337-chat.onrender.com/user/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        let data = await res.json();
        if (data.success) {
            Toast.fire({
                icon: "success",
                title: "Successfully Logged in!",
            });
            localStorage.setItem("token", data.token);
            const user = data.userId;
            window.location.href = `dashboard.html?id=${user}`;
        } else {
            Swal.fire({
                title: "Error!",
                text: data.error,
                icon: "error",
                confirmButtonText: "Retry",
            });
        }
    } catch (error) {
        Swal.fire({
            title: "Error!",
            text: "Bad request 404",
            icon: "error",
            confirmButtonText: "Retry",
        });
    }
};
