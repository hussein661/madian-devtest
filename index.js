const userContainer = document.getElementById('user-container');
const categoryFilter = document.getElementById('category-filter');
const removeButton = document.getElementById('remove-button');
const selectButton = document.getElementById('select-button');
let users = [];
let selectedCategory = null;
let selectedUsers = [];
let selectedUserCount = 10;

fetchUsers();

function fetchUsers() {
    userContainer.innerHTML = '<h3 class="loader-wrapper"> <img class="loading-image" src="https://i.gifer.com/origin/34/34338d26023e5515f6cc8969aa027bca_w200.gif"/></h3>'
    const api = `https://www.filltext.com/?rows=${selectedUserCount}&fname={firstName}&lname={lastName}&category=["category 1","category 2","category 3","category 4","category 5"]&pretty=true`

    fetch(api)
        .then(response => response.json())
        .then(data => {
            users = data;
            renderUsers(users);
        })
        .catch(error => {
            console.log('Error fetching users:', error);
        });
}
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


function renderUsers(userArray) {
    userContainer.innerHTML = '';
    if (!(userArray && userArray.length > 0)) {
        userContainer.innerHTML = `<div class="no-data">There are no users found in the selected category ${selectedCategory || ''}</div>`;
        return;
    }
    userArray.forEach(user => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.style.opacity = '0';

        const avatar = document.createElement('div');
        avatar.classList.add('avatar');
        avatar.textContent = `${user.fname[0]}${user.lname[0]}`;
        avatar.style.setProperty('--avatar-color', getRandomColor());

        const name = document.createElement('h3');
        name.textContent = `${user.fname} ${user.lname}`;

        const category = document.createElement('p');
        category.textContent = `${user.category}`;

        card.appendChild(avatar);
        card.appendChild(name);
        card.appendChild(category);
        userContainer.appendChild(card);

        card.addEventListener('click', () => {
            card.classList.toggle('selected');
            if (card.classList.contains('selected')) {
                selectedUsers.push(user);
            } else {
                selectedUsers = selectedUsers.filter(selectedUser => selectedUser !== user);
            }
        });
        setTimeout(() => {
            card.style.opacity = '1';
            card.classList.add('animate');

        }, 100);
    });

    updateCategoryFilterUI();
}
function filterUsersByCategory(category) {
    console.log(category, selectedCategory);
    if (selectedCategory === category) {
        selectedCategory = null;
    } else {
        selectedCategory = category;
    }

    const filteredUsers = selectedCategory ? users.filter(user => user.category === selectedCategory) : users;
    renderUsers(filteredUsers);
}


function updateCategoryFilterUI() {
    const buttons = categoryFilter.querySelectorAll('button');
    buttons.forEach(button => {
        const buttonCategory = button.dataset.category;
        if (buttonCategory === selectedCategory) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

categoryFilter.addEventListener('click', event => {
    const selectedCategory = event.target.dataset.category;
    if (selectedCategory) {
        const isActive = event.target.classList.contains('active');
        if (isActive) {
            filterUsersByCategory(null); 
        } else {
            filterUsersByCategory(selectedCategory);
        }
    }
});

removeButton.addEventListener('click', () => {
    const selectedCards = document.querySelectorAll('.card.selected');
    selectedCards.forEach(card => {
        card.style.display = 'none';
        card.classList.remove('selected');
    });
    selectedUsers = [];
});


selectButton.addEventListener('change', event => {
    selectedUserCount = parseInt(event.target.value);
    fetchUsers();
});
