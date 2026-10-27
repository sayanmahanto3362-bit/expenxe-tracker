
function formSubmit(event) {
    event.preventDefault();

    const amount = event.target.amount.value;
    const description = event.target.description.value.trim();
    const category = event.target.category.value;

    // Prevent invalid or empty values
    if (amount === "" || Number(amount) <= 0 || description === "" || category === "") {
        alert("Please enter valid expense details.");
        return;
    }

    const user = {
        amount,
        description,
        category
    };

    const userList = JSON.parse(localStorage.getItem("usersList")) || [];
    const editId = sessionStorage.getItem("editId");

    if (editId !== null) {
        update(userList, editId, user);
    } else {
        add(userList, user);
    }

    // Save the latest data to localStorage
    localStorage.setItem("usersList", JSON.stringify(userList));

    // Clear all form inputs after adding or updating
    event.target.reset();

    // Restore the original submit button text
    document.querySelector("#btn").textContent = "ADD EXPENSES";
}


function add(userList, user) {
    // Generate a unique ID for this expense
    user.id = Date.now().toString();

    userList.push(user);

    display(user);
}


function display(data) {
    const ul = document.querySelector("#expenseList");
    const li = document.createElement("li");

    li.id = data.id;
    li.classList.add("mb-3");

    const expenseText = document.createElement("span");
    expenseText.textContent =
        `${data.amount} - ${data.description} - ${data.category}`;

    li.appendChild(expenseText);

    // Delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.type = "button";
    deleteButton.classList.add("btn", "btn-danger", "btn-sm", "ms-3");

    deleteButton.addEventListener("click", () => {
        deleteData(data.id);
    });

    li.appendChild(deleteButton);

    // Edit button
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.type = "button";
    editButton.classList.add("btn", "btn-warning", "btn-sm", "ms-2");

    editButton.addEventListener("click", () => {
        edit(data);
    });

    li.appendChild(editButton);

    ul.appendChild(li);
}


function deleteData(id) {
    const userList = JSON.parse(localStorage.getItem("usersList")) || [];

    // Keep every expense except the one being deleted
    const updatedUserList = userList.filter(user => user.id !== id);

    // Update localStorage
    localStorage.setItem("usersList", JSON.stringify(updatedUserList));

    // Remove the correct expense element from the page
    const li = document.getElementById(id);

    if (li) {
        li.remove();
    }

    // If the deleted expense was being edited, cancel that edit
    if (sessionStorage.getItem("editId") === id) {
        sessionStorage.removeItem("editId");

        document.querySelector("#btn").textContent = "ADD EXPENSES";
        document.querySelector("form").reset();
    }
}


function edit(data) {
    const amountInput = document.querySelector("#expenseAmount");
    const descriptionInput = document.querySelector("#des");
    const categoryInput = document.querySelector("#category");

    // Put the selected expense into the form
    amountInput.value = data.amount;
    descriptionInput.value = data.description;
    categoryInput.value = data.category;

    // Remember which expense is being edited
    sessionStorage.setItem("editId", data.id);

    // Change the submit button text
    document.querySelector("#btn").textContent = "UPDATE EXPENSE";
}


function update(userList, editId, user) {
    // Find the expense being edited
    const index = userList.findIndex(item => item.id === editId);

    if (index === -1) {
        sessionStorage.removeItem("editId");
        alert("Expense not found. Please try again.");
        return;
    }

    // Update the existing object while preserving its ID
    userList[index] = {
        ...userList[index],
        amount: user.amount,
        description: user.description,
        category: user.category
    };

    // Update the existing <li> instead of creating a new one
    const li = document.getElementById(editId);

    if (li) {
        const expenseText = li.querySelector("span");

        expenseText.textContent =
            `${user.amount} - ${user.description} - ${user.category}`;
    }

    // Finish editing
    sessionStorage.removeItem("editId");
}

 