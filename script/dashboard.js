const socket = io("https://one337-chat.onrender.com/", {
    transports: ["websocket"],
});

socket.on("receivedMsg", (msg, userId) => {
    const ul = document.getElementById(userId);
    const li = document.createElement("li");
    li.className = "receive";
    const today = new Date();
    const time = today.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
    li.textContent = msg + " - " + time;
    ul.append(li);
    var br = document.createElement("br");
    ul.appendChild(br);
});

const searchBtn = document.getElementById("searchBtn");
const query = document.getElementById("query");
const search_users_list = document.getElementById("search_users_list");
const users_list = document.getElementsByClassName("users_list")[0];
const activeUserName = document.getElementById("profile_name");
const profile_pic = document.getElementById("profile_pic");
const groupBtn = document.getElementById("groupBtn");
const groupDiv = document.getElementById("groupDiv");
const logout = document.getElementById("logout");
logout.addEventListener("click", () => {
    window.location.href = "./index.html";
    localStorage.removeItem("token");
});
const url = new URLSearchParams(window.location.search);
const userId = url.get("id");

fetch(`https://one337-chat.onrender.com/user/alreadyConnectedUser?userId=${userId}`)
    .then((response) => response.json())
    .then((response) => {
        activeUserName.textContent = response[1];
        profile_pic.src = response[2];
        renderConnectedUsers(response[0]);
    });

function openProfile(el, data_id, msg) {
    usersProfile.innerHTML = null;
    // header
    const nav = document.createElement("nav");
    nav.setAttribute("id", "usersHeader");

    const img = document.createElement("img");
    img.src = el.picture;
    img.style.width = "40px";
    const name = document.createElement("span");
    name.innerText = el.name;

    // body
    const div = document.createElement("div");
    div.setAttribute("id", "usersChat");
    const ul = document.createElement("ul");
    ul.setAttribute("id", data_id);

    // msg li
    if (msg != undefined) {
        msg.forEach(({ data, type }) => {
            console.log(data, type);
            const li = document.createElement("li");
            const timestamp = new Date(data.timestamp);
            const time = timestamp.toLocaleTimeString([], { timeStyle: 'short' });
            li.textContent = data.message + " - " + time;
            li.className = type;
            ul.append(li);
            var br = document.createElement("br");
            ul.appendChild(br);
        });
    }

// message input

const footer = document.createElement("footer");
footer.setAttribute("id", "usersFooter");
footer.style.bottom = "0";
footer.style.left = "0";
footer.style.width = "100%";
const input = document.createElement("input");
input.setAttribute("type", "text");
const button = document.createElement("button");
button.innerHTML = '<i class="fa-sharp fa-solid fa-paper-plane"></i>';
input.placeholder = "Chat to " + el.name + "...";

    button.addEventListener("click", () => {
        sendMessage(el, input, ul);
    });

    input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            sendMessage(el, input, ul);
        }
    });

    nav.append(img, name);

    div.append(ul);
    footer.append(input, button);
    usersProfile.append(nav, div, footer);

    ul.scrollTop = ul.scrollHeight; // scroll to bottom of the messages
} 

function renderConnectedUsers(data) {
    users_list.innerHTML = null;
    data.forEach((user) => {
        const li = document.createElement("li");
        li.setAttribute("class", "users_list_item");
        const img = document.createElement("img");
        img.src = user.picture;
        img.setAttribute("class", "profile_pic");
        img.setAttribute("width", "50px");
        img.setAttribute("height", "50px");
        const name = document.createElement("p");
        name.textContent = user.name;
        const preview = document.createElement("p");
        preview.className = "message-preview";
        li.addEventListener("click", () => {
            fetch(
                `https://one337-chat.onrender.com/user/getAllMessages?user1=${userId}&user2=${user._id}`
            )
                .then((res) => res.json())
                .then((res) => {
                    openProfile(user, user._id, res);
                });
        });
        li.append(img, name);
        users_list.append(li);
    });
}
socket.emit("createConnection", userId);

searchBtn.addEventListener("click", () => {
    let search = query.value ? query.value : "";
    fetch(
        `https://one337-chat.onrender.com/user/searchUser?search=${search}&userId=${userId}`,
        {
            method: "GET",
            headers: {
                "Content-type": "application/json",
            },
        }
    )
        .then((res) => res.json())
        .then((response) => {
            users_list.innerHTML = null;
            renderUsers(response);
        });
});

function renderUsers(users) {
    console.log(users);
    search_users_list.innerHTML = null;
    users.forEach((el) => {
        console.log(el.name, el.email);
        const div = document.createElement("div");
        div.setAttribute("class", "users_list_container");
        const name = document.createElement("span");
        name.textContent = el.name;
        const img = document.createElement("img");
        img.src = el.picture;
        img.style.width = "50px";
        div.addEventListener("click", () => {
            query.value = "";
            search_users_list.innerHTML = null;

            fetch(
                `https://one337-chat.onrender.com/user/getAllMessages?user1=${userId}&user2=${el._id}`
            )
                .then((res) => res.json())
                .then((res) => {
                    if (res.length == 0) {
                        const li = document.createElement("li");
                        li.setAttribute("class", "users_list_item");
                        const img = document.createElement("img");
                        img.src = el.picture;
                        img.setAttribute("class", "profile_pic");
                        img.setAttribute("width", "50px");
                        img.setAttribute("height", "50px");
                        const name = document.createElement("p");
                        name.textContent = el.name;
                        li.addEventListener("click", () => {
                            fetch(
                                `https://one337-chat.onrender.com/user/getAllMessages?user1=${userId}&user2=${el._id}`
                            )
                                .then((res) => res.json())
                                .then((res) => {
                                    openProfile(el, el._id, res);
                                });
                        });
                        li.append(img, name);
                        users_list.append(li);
                    }
                    openProfile(el, el._id);
                });
        });
        div.append(img, name);
        search_users_list.append(div);
    });
}

function sendMessage(el, input, ul) {
    console.log(input.value, el);
    const li = document.createElement("li");
    const today = new Date();
    const time = today.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
    li.className = "send";
    li.style.whiteSpace = "normal";
    li.textContent = input.value + " - " + time;
    ul.append(li);
    var br = document.createElement("br");
    ul.appendChild(br);
    socket.emit("chatMsg", input.value, el._id, userId);
    input.value = "";
    input.placeholder = "Chat to " + el.name + "...";
    ul.scrollTop = ul.scrollHeight; // scroll to bottom of the messages
}

function createGroup() {
    const url = new URLSearchParams(window.location.search);
    const userId = url.get("id");
    fetch(`https://one337-chat.onrender.com/user/allUser?userId=${userId}`)
        .then((res) => res.json())
        .then((response) => {
            renderGroupUsers(response);
        });
}

function renderGroupUsers(users) {
    groupDiv.innerHTML = null;
    users.forEach((el) => {
        const img = document.createElement("img");
        img.src = el.picture;
        img.style.width = "60px";
        const name = document.createElement("span");
        name.innerText = el.name;
        const addBtn = document.createElement("button");
        addBtn.textContent = "Add";
        groupDiv.append(img, name, addBtn);
    });
}