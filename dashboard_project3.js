const Dashboard = (function () {

    let profiles = [];

    const form = document.getElementById("userForm");
    const nameInput = document.getElementById("nameInput");
    const emailInput = document.getElementById("emailInput");
    const colorInput = document.getElementById("colorInput");

    const displayName = document.getElementById("displayName");
    const displayEmail = document.getElementById("displayEmail");
    const displayColor = document.getElementById("displayColor");

    const message = document.createElement("p");
    form.appendChild(message);

    function showMessage(text, color) {
        message.textContent = text;
        message.style.color = color;
    }

    function validateInput(name, email) {

        if (name.trim() === "") {
            showMessage("Name is required.", "red");
            return false;
        }

        const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

        if (!emailPattern.test(email)) {
            showMessage("Enter a valid email.", "red");
            return false;
        }

        return true;
    }

    function renderLatestProfile() {

        if (!profiles.length) return;

        const latest = profiles[profiles.length - 1];

        displayName.textContent = latest.name;
        displayEmail.textContent = latest.email;
        displayColor.textContent = latest.color;

        displayColor.style.backgroundColor = latest.color;
        displayColor.style.padding = "4px 8px";
        displayColor.style.borderRadius = "6px";
    }

    function addProfile(profile) {

        profiles.push(profile);

        const jsonData = JSON.stringify(profiles);
        profiles = JSON.parse(jsonData);

        renderLatestProfile();
    }

    function sortProfilesByName() {
        profiles.sort((a, b) => a.name.localeCompare(b.name));
    }

    function getAllEmails() {
        return profiles.map(profile => profile.email);
    }

    form.addEventListener("submit", function (e) {

        e.preventDefault();

        const name = nameInput.value;
        const email = emailInput.value;
        const color = colorInput.value;

        if (!validateInput(name, email)) return;

        const newProfile = {
            id: Date.now(),
            name,
            email,
            color
        };

        addProfile(newProfile);

        showMessage("Profile updated successfully!", "green");

        form.reset();
    });

    return {
        sortProfilesByName,
        getAllEmails
    };

})();

document.getElementById("sortBtn")
.addEventListener("click", function () {

    Dashboard.sortProfilesByName();

    alert("Profiles sorted!");
    console.log(Dashboard.getAllEmails());
});

const loadBtn = document.getElementById("loadUsersBtn");
const reloadBtn = document.getElementById("reloadUsersBtn");
const clearBtn = document.getElementById("clearUsersBtn");

const usersContainer = document.getElementById("usersContainer");
const apiMessage = document.getElementById("apiMessage");

let fetchedUsers = [];
let favorites = new Set();

async function fetchUsers() {

    apiMessage.textContent = "Loading data...";
    apiMessage.className = "";

    usersContainer.innerHTML = "";

    try {

        const response = await fetch(
            "https://jsonplaceholder.typicode.com/users"
        );

        if (!response.ok) {
            throw new Error("Network error");
        }

        const data = await response.json();

        if (!data.length) {
            apiMessage.textContent = "No results found.";
            return;
        }

        fetchedUsers = data;

        renderUsers(data);

        apiMessage.textContent = "Users loaded successfully!";
        apiMessage.className = "success";

    } catch (error) {

        apiMessage.textContent =
            "Something went wrong while loading users.";

        apiMessage.className = "error";

        console.error(error);
    }
}

function renderUsers(users) {

    usersContainer.innerHTML = "";

    users.forEach(user => {

        const card = document.createElement("div");
        card.className = "user-card";

        if (favorites.has(user.id)) {
            card.classList.add("favorite");
        }

        card.innerHTML = `
            <h3>${user.name}</h3>
            <p>Email: ${user.email}</p>

            <button class="detailsBtn">See Details</button>
            <button class="favBtn">⭐ Favorite</button>

            <div class="details" style="display:none;">
                <p>Phone: ${user.phone}</p>
                <p>Website: ${user.website}</p>
                <p>Company: ${user.company.name}</p>
            </div>
        `;

        card.querySelector(".detailsBtn")
        .addEventListener("click", () => {

            const details = card.querySelector(".details");

            details.style.display =
                details.style.display === "none"
                    ? "block"
                    : "none";
        });

        card.querySelector(".favBtn")
        .addEventListener("click", () => {

            if (favorites.has(user.id)) {
                favorites.delete(user.id);
            } else {
                favorites.add(user.id);
            }

            renderUsers(fetchedUsers);
        });

        usersContainer.appendChild(card);
    });
}

loadBtn.addEventListener("click", fetchUsers);

reloadBtn.addEventListener("click", fetchUsers);

clearBtn.addEventListener("click", () => {

    usersContainer.innerHTML = "";
    apiMessage.textContent = "Data cleared.";
});

const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Project 3 is live on Vercel!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});