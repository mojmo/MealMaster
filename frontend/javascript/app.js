
document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const logoutBtn = document.getElementById('logoutButton');
    const homeButton = document.getElementById('homeButton');
    const recipesButton = document.getElementById('recipesButton');
    const createRecipeForm = document.getElementById('createRecipeForm');
    const updateRecipeForm = document.getElementById('updateRecipeForm');
    const recipeList = document.getElementById('recipeList');

    // Store the current user's ID after login
    let currentUserId = null;

    // #################### Register ####################
    if (registerForm) {
        registerForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = new FormData(registerForm);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch('http://localhost/MealMaster/backend/index.php/api/auth/register', {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const result = await response.json();

                if (response.ok) {
                    window.location.href = 'http://localhost/MealMaster/frontend/views/login.html';
                } else {
                    console.error('Registration failed:', result);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    }

    // #################### Login ####################
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = new FormData(loginForm);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch('http://localhost/MealMaster/backend/index.php/api/auth/login', {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const result = await response.json();

                if (response.ok) {
                    currentUserId = result.user_id; // Set current user ID
                    localStorage.setItem('currentUserId', currentUserId); // Store current user ID in localStorage
                    window.location.href = 'http://localhost/MealMaster/frontend/views/index.html';
                    console.log('user id login', result.user_id);
                } else {
                    console.error('Login failed:', result);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    }

    // #################### Logout ####################
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                const response = await fetch('http://localhost/MealMaster/backend/index.php/api/auth/logout', {
                    method: 'POST'
                });

                const result = await response.json();

                if (response.ok) {
                    localStorage.removeItem('currentUserId'); // Clear current user ID from localStorage
                    window.location.href = 'http://localhost/MealMaster/frontend/views/login.html';
                } else {
                    console.error('Logout failed:', result);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    }

    // #################### Navigation ####################
    if (homeButton) homeButton.addEventListener('click', () => window.location.href = 'http://localhost/MealMaster/frontend/views/index.html');
    if (recipesButton) recipesButton.addEventListener('click', () => window.location.href = 'http://localhost/MealMaster/frontend/views/recipes.html');

    // #################### Authentication Check ####################
    async function checkAuthentication() {
        try {
            const response = await fetch('http://localhost/MealMaster/backend/index.php/api/auth/check', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                window.location.href = 'http://localhost/MealMaster/frontend/views/login.html';
            }
        } catch (error) {
            console.error('Error:', error);
            window.location.href = 'http://localhost/MealMaster/frontend/views/login.html';
        }
    }

    if (window.location.pathname.includes('index.html') || window.location.pathname.includes('recipes.html')) checkAuthentication().then(loadRecipes);

    // #################### Recipe Management ####################
    async function loadRecipes() {
        try {
            currentUserId = localStorage.getItem('currentUserId'); // Retrieve current user ID from localStorage

            const response = await fetch('http://localhost/MealMaster/backend/index.php/api/recipes', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const result = await response.json();

            if (response.ok) {
                recipeList.innerHTML = '';
                for (const recipe of result.recipes) {
                    const userResponse = await fetch(`http://localhost/MealMaster/backend/index.php/api/users/${recipe.user_id}`);
                    const userResult = await userResponse.json();
                    const li = document.createElement('li');
                    li.innerHTML = `
                            <strong>${recipe.name}</strong> by ${userResult.username}<br>
                            Ingredients: ${recipe.ingredients}<br>
                            Instructions: ${recipe.instructions}<br>
                    `;

                    if (parseInt(currentUserId) === recipe.user_id) {

                        const deleteButton = document.createElement('button');
                        deleteButton.textContent = 'Delete';
                        deleteButton.addEventListener('click', async (event) => {
                            event.stopPropagation();
                            await deleteRecipe(recipe.id);
                            window.location.reload();
                            // loadRecipes();
                        });

                        li.appendChild(deleteButton);

                        li.addEventListener('click', () => {
                            window.location.href = `http://localhost/MealMaster/frontend/views/updateRecipe.html?id=${recipe.id}`;
                        });

                    }

                    recipeList.appendChild(li);
                }
            } else {
                console.error('Load recipes failed:', result);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async function deleteRecipe(id) {
        try {
            const response = await fetch(`http://localhost/MealMaster/backend/index.php/api/recipes/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const result = await response.json();
                console.error('Delete recipe failed:', result);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    if (createRecipeForm) {
        createRecipeForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = new FormData(createRecipeForm);
            const data = Object.fromEntries(formData.entries());

            

            data.user_id = parseInt(localStorage.getItem('currentUserId'));

            console.log(data);

            try {
                const response = await fetch('http://localhost/MealMaster/backend/index.php/api/recipes', {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const result = await response.json();

                if (response.ok) {
                    window.location.href = 'http://localhost/MealMaster/frontend/views/recipes.html';
                } else {
                    console.error('Create recipe failed:', result);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    }

    if (updateRecipeForm) {
        const urlParams = new URLSearchParams(window.location.search);
        const recipeId = urlParams.get('id');

        async function loadRecipeDetails() {
            try {
                const response = await fetch(`http://localhost/MealMaster/backend/index.php/api/recipes/${recipeId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const result = await response.json();

                if (response.ok) {
                    updateRecipeForm.name.value = result.recipe.name;
                    updateRecipeForm.ingredients.value = result.recipe.ingredients;
                    updateRecipeForm.instructions.value = result.recipe.instructions;   
                    updateRecipeForm.recipe_id.value = recipeId;
                } else {
                    console.error('Load recipe details failed:', result);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }

        loadRecipeDetails();

        updateRecipeForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = new FormData(updateRecipeForm);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch(`http://localhost/MealMaster/backend/index.php/api/recipes/${recipeId}`, {
                    method: 'PUT',
                    body: JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const result = await response.json();

                if (response.ok) {
                    window.location.href = 'http://localhost/MealMaster/frontend/views/recipes.html';
                } else {
                    console.error('Update recipe failed:', result);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    }
});
