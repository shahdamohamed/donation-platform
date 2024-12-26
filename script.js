// array of causes with their details (id, name, goal, and collected amount )
const causes = [
    { id: 1, name: "Clean Water Initiative", goal: 5000, collected: 1200 },
    { id: 2, name: "School Supplies for Kids", goal: 3000, collected: 800 },
    { id: 3, name: "Animal Shelter Support", goal: 2000, collected: 500 }
];
//object to track donations made by user
const userDonations = {};

//retrieve users from local storage or intiialize an empty object if none exist
const users = JSON.parse(localStorage.getItem('users')) || {};

//function to save donation data to local storage
function saveDonations() {
    localStorage.setItem('donationData', JSON.stringify(causes));
}

//function to load donation data frm local storage
function loadDonations() {
    const storedData = localStorage.getItem('donationData');
    return storedData ? JSON.parse(storedData) : causes;
}
//function to render the list of causes on the webpage
function renderCauses() {
    const causeContainer = document.getElementById('causes');
    causeContainer.innerHTML = '';
    //loop through each cause and display it
    causes.forEach(cause => {
        const progressPercent = Math.min((cause.collected / cause.goal) * 100, 100);
        const causeElement = document.createElement('div');
        causeElement.className = 'cause';
        causeElement.innerHTML = `
            <h3>${cause.name}</h3>
            <p>Goal: $${cause.goal}</p>
            <div class="progress">
                <div class="progress-bar" style="width: ${progressPercent}%;"></div>
            </div>
            <p>Raised: $${cause.collected}</p>
            <button onclick="donate(${cause.id})">Donate</button>
        `; // add cause details and a donate button
        causeContainer.appendChild(causeElement); // add cause to the container
    });
}

//function to handle donations
function donate(causeId) {
    const amount = parseInt(prompt("Enter donation amount:"), 10); //prompt user for donation amount
    if (!amount || amount <= 0) { // validate input
        alert("Invalid amount."); // show error for invalid input
        return;
    }
    const cause = causes.find(c => c.id === causeId); // find the cause by id
    cause.collected += amount; // update collected amount
    const username = document.getElementById('user-name').innerText; // get the current username
    userDonations[username] = userDonations[username] || []; // initialize user donations if not present
    userDonations[username].push({ cause: cause.name, amount }); // add donation to the user's record
    saveDonations(); // save updated donations to the local storage
    renderCauses();// re-render the causes to the update the display
    renderDonationSummary(); // update the donation summary
}
// function to handle user login
function login() {
    const username = document.getElementById('username').value.trim(); // get entered username
    if (users[username]) { // check if the username exist
        document.getElementById('user-name').innerText = username; // display username
        document.getElementById('login-container').style.display = 'none'; // hide login form
        document.getElementById('user-info').style.display = 'block'; // show user info
        document.getElementById('donation-summary').style.display = 'block'; // show donation summery
        renderDonationSummary(); // update the donation summery
    } else {
        alert('User not found. Please register first.'); // show error if user not found
    }
}
 // function to handle user logout
function logout() {
    document.getElementById('user-name').innerText = 'Guest'; // reset to the guest user
    document.getElementById('login-container').style.display = 'block'; // show login form
    document.getElementById('user-info').style.display = 'none'; // hide user info
    document.getElementById('donation-summary').style.display = 'none'; // hide donation summery
}

// function to show the registration form
function showRegisterForm() {
    document.getElementById('login-container').style.display = 'none'; // hide login  form
    document.getElementById('register-container').style.display = 'block'; // show registration form
}
// function to show the login form
function showLoginForm() {
    document.getElementById('register-container').style.display = 'none';// hide registration orm
    document.getElementById('login-container').style.display = 'block'; // show login form
}
// function to handle  user registration
function register() {
    const username = document.getElementById('register-username').value.trim(); // Get entered username
    const password = document.getElementById('register-password').value.trim(); // Get entered password

    if (!username || !password) { // validate input
        alert('Please enter both username and password.'); // show error for missing input
        return;
    }

    if (users[username]) { // check if user is already token
        alert('Username already taken.'); // show error for duplicate username
        return;
    }

    users[username] = { password }; // add new user to the users object
    localStorage.setItem('users', JSON.stringify(users)); // save users to the local storage
    alert('Account created successfully! You can now login.');// show success message
    showLoginForm(); // redirect to login form
}

// render the donation summery for thr logged in user
function renderDonationSummary() {
    const username = document.getElementById('user-name').innerText; //get the current username
    const donations = userDonations[username] || []; // retrieve user's donations
    const donationList = document.getElementById('donation-list'); // get donations list element
    donationList.innerHTML = donations.map(d => `<li>${d.cause}: $${d.amount}</li>`).join(''); // render donations
}

// load saved causes from local storage and update the global causes array
const savedCauses = loadDonations();
Object.assign(causes, savedCauses);

//render the causes on page load
renderCauses();