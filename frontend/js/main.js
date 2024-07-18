document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const logoutBtn = document.getElementById('logoutButton');
    const homeButton = document.getElementById('homeButton');
    const recipesButton = document.getElementById('recipesButton');
    const mealPlansButton = document.getElementById('mealPlansButton');
    const createRecipeForm = document.getElementById('createRecipeForm');
    const updateRecipeForm = document.getElementById('updateRecipeForm');
    const createMealPlanForm = document.getElementById('createMealPlanForm');
    const updateMealPlanForm = document.getElementById('updateMealPlanForm');
    const recipeList = document.getElementById('recipesContainer');
    const mealPlanList = document.getElementById('mealPlansContainer');
    const userForm = document.getElementById('userForm');
    const recipesSection = document.getElementById('recipesSection');
    const mealPlansSection = document.getElementById('mealPlansSection');

    let currentUserId = localStorage.getItem('currentUserId');

    const apiUrl = 'http://localhost/MealMaster/backend/index.php/api/';
    const frontendUrl = 'http://localhost/MealMaster/frontend/views/';

    // #################### Register ####################
    if (registerForm) {
        registerForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const formData = new FormData(registerForm);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch(`${apiUrl}auth/register`, {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const result = await response.json();
                if (response.ok) {
                    document.querySelector('.create-user-success').style.display = 'block';
                    setTimeout(() => {
                        window.location.href = `${frontendUrl}login.html`;
                    }, 1000);
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

            console.log(data);

            try {
                const response = await fetch(`${apiUrl}auth/login`, {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const result = await response.json();
                if (response.ok) {
                    currentUserId = result.user_id;
                    localStorage.setItem('currentUserId', currentUserId);
                    document.querySelector('.login-user-success').style.display = 'block';
                    setTimeout(() => {
                        window.location.href = `${frontendUrl}index.html`;
                    }, 1000);
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
                const response = await fetch(`${apiUrl}auth/logout`, {
                    method: 'POST'
                });
                const result = await response.json();
                if (response.ok) {
                    localStorage.removeItem('currentUserId');
                    window.location.href = `${frontendUrl}login.html`;
                } else {
                    console.error('Logout failed:', result);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    }

    // #################### Navigation ####################
    if (homeButton) homeButton.addEventListener('click', () => window.location.href = `${frontendUrl}index.html`);
    if (recipesButton) recipesButton.addEventListener('click', () => window.location.href = `${frontendUrl}recipes.html`);
    if (mealPlansButton) mealPlansButton.addEventListener('click', () => window.location.href = `${frontendUrl}meal_plans.html`);

    // #################### Authentication Check ####################
    async function checkAuthentication() {
        try {
            const response = await fetch(`${apiUrl}auth/check`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                window.location.href = `${frontendUrl}login.html`;
            }
        } catch (error) {
            console.error('Error:', error);
            window.location.href = `${frontendUrl}login.html`;
        }
    }

    if (window.location.pathname.includes('index.html') || window.location.pathname.includes('recipes.html') || window.location.pathname.includes('meal_plans.html') || window.location.pathname.includes('user.html')) {
        checkAuthentication().then(() => {
            if (recipesSection) loadRecipes(recipesSection, 6);
            if (mealPlansSection) loadMealPlans(mealPlansSection, 6);
            if (recipeList) loadRecipes(recipeList);
            if (mealPlanList) loadMealPlans(mealPlanList);
        });
    }

    // #################### Recipe Management ####################
    async function loadRecipes(recipeList, limit = null) {
        try {
            const response = await fetch(`${apiUrl}recipes`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const result = await response.json();
            if (response.ok) {
                recipeList.innerHTML = '';
    
                // If limit is set, slice the array to get the specified number of recipes
                const recipesToDisplay = limit ? result.recipes.slice(0, limit) : result.recipes;
    
                for (const recipe of recipesToDisplay) {
                    const userResponse = await fetch(`${apiUrl}users/${recipe.user_id}`);
                    const userResult = await userResponse.json();
                    const div = document.createElement('div');
                    div.innerHTML = `
                        <img src='../images/recipe.jpg' alt='Recipe Image' class='recipe-image'>
                        <div class="item-body">
                            <h5><strong>${recipe.name}</strong></h5>
                            <h6>by <strong>${userResult.username}</strong></h6>
                            <h6><strong>Ingredients:</strong></h6>
                            <p>${recipe.ingredients}</p>
                            <h6><strong>Instructions:</strong></h6>
                            <p>${recipe.instructions}</p>
                        </div>
                    `;
                    if (parseInt(currentUserId) === recipe.user_id) {
                        const deleteButton = document.createElement('button');
                        deleteButton.classList.add('btn');
                        deleteButton.classList.add('btn-outline-danger');
                        deleteButton.textContent = 'Delete';
                        div.style.cursor = 'pointer';
                        deleteButton.addEventListener('click', async (event) => {
                            event.stopPropagation();
                            await deleteRecipe(recipe.id);
                            window.location.reload();
                        });
                        div.appendChild(deleteButton);
                        div.addEventListener('click', () => {
                            window.location.href = `${frontendUrl}update_recipe.html?id=${recipe.id}`;
                        });
                    }
                    div.classList.add('recipe-item');
                    div.classList.add('col-md-3');
                    recipeList.appendChild(div);
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
            const response = await fetch(`${apiUrl}recipes/${id}`, {
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
            data.user_id = parseInt(currentUserId);

            try {
                const response = await fetch(`${apiUrl}recipes`, {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const result = await response.json();
                if (response.ok) {
                    document.querySelector('.create-recipe-success').style.display = 'block';
                    setTimeout(() => {
                        window.location.href = `${frontendUrl}recipes.html`;
                    }, 1000);
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
                const response = await fetch(`${apiUrl}recipes/${recipeId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const result = await response.json();
                if (response.ok) {
                    updateRecipeForm.recipeName.value = result.recipe.name;
                    updateRecipeForm.ingredients.value = result.recipe.ingredients;
                    updateRecipeForm.instructions.value = result.recipe.instructions;
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
                const response = await fetch(`${apiUrl}recipes/${recipeId}`, {
                    method: 'PUT',
                    body: JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const result = await response.json();
                if (response.ok) {
                    document.querySelector('.update-meal-success').style.display = 'block';
                    setTimeout(() => {
                        window.location.href = `${frontendUrl}recipes.html`;
                    }, 1000);
                } else {
                    console.error('Update recipe failed:', result);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    }

    // #################### Meal Plan Management ####################
    async function loadMealPlans(mealPlanList, limit = null) {
        try {
            const response = await fetch(`${apiUrl}mealplans`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const result = await response.json();
            if (response.ok) {
                mealPlanList.innerHTML = '';
    
                // If limit is set, slice the array to get the specified number of meal plans
                const mealPlansToDisplay = limit ? result.meal_plans.slice(0, limit) : result.meal_plans;
    
                for (const mealPlan of mealPlansToDisplay) {
                    const userResponse = await fetch(`${apiUrl}users/${mealPlan.user_id}`);
                    const userResult = await userResponse.json();
                    const div = document.createElement('div');
                    let allRecipes = [];
                    let recipeIds = [];
    
                    for (const recipe of mealPlan.recipes) {
                        recipeIds.push(recipe.recipe_id);
                    }
    
                    for (const recipeId of recipeIds) {
                        let getRecipe = await fetch(`${apiUrl}recipes/${recipeId}`, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        });
                        getRecipe = await getRecipe.json();
                        allRecipes.push(getRecipe.recipe.name);
                    }
    
                    div.innerHTML = `
                        <img src='../images/meal.jpg' alt='Meal Plan Image' class='meal-image'>
                        <div class="item-body">
                            <h5><strong>${mealPlan.name}</strong></h5>
                            <h6>by <strong>${userResult.username}</strong><h6/>
                            <h6><strong>Recipes:</strong></h6>
                            <p>${allRecipes.join(', ')}</p>
                        </div>
                        
                    `;
                    if (parseInt(currentUserId) === mealPlan.user_id) {
                        const deleteButton = document.createElement('button');
                        deleteButton.classList.add('btn');
                        deleteButton.classList.add('btn-outline-danger');
                        deleteButton.textContent = 'Delete';
                        div.style.cursor = 'pointer';
                        deleteButton.addEventListener('click', async (event) => {
                            event.stopPropagation();
                            await deleteMealPlan(mealPlan.id);
                            window.location.reload();
                        });
                        div.appendChild(deleteButton);
                        div.addEventListener('click', () => {
                            window.location.href = `${frontendUrl}update_meal_plan.html?id=${mealPlan.id}`;
                        });
                    }
                    div.classList.add('meal-plan-item');
                    div.classList.add('col-md-3')
                    mealPlanList.appendChild(div);
                }
            } else {
                console.error('Load meal plans failed:', result);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }


    async function deleteMealPlan(id) {
        try {
            const response = await fetch(`${apiUrl}mealplans/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                const result = await response.json();
                console.error('Delete meal plan failed:', result);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    if (createMealPlanForm) {
        createMealPlanForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const formData = new FormData(createMealPlanForm);
            const data = Object.fromEntries(formData.entries());
            data.user_id = parseInt(currentUserId);

            try {
                const response = await fetch(`${apiUrl}mealplans`, {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const result = await response.json();
                if (response.ok) {
                    document.querySelector('.create-plan-success').style.display = 'block';
                    setTimeout(() => {
                        window.location.href = `${frontendUrl}meal_plans.html`;
                    }, 1000);
                } else {
                    console.error('Create meal plan failed:', result);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    }

    if (updateMealPlanForm) {
        const urlParams = new URLSearchParams(window.location.search);
        const mealPlanId = urlParams.get('id');

        async function loadMealPlanDetails() {
            try {
                const response = await fetch(`${apiUrl}mealplans/${mealPlanId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const result = await response.json();
                if (response.ok) {
                    updateMealPlanForm.mealPlanName.value = result.meal_plan.name;
                    // updateMealPlanForm.recipes.value = result.meal_plan.recipes.join(', ');
                } else {
                    console.error('Load meal plan details failed:', result);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }

        loadMealPlanDetails();

        updateMealPlanForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const formData = new FormData(updateMealPlanForm);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch(`${apiUrl}mealplans/${mealPlanId}`, {
                    method: 'PUT',
                    body: JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const result = await response.json();
                if (response.ok) {
                    document.querySelector('.update-meal-success').style.display = 'block';
                    setTimeout(() => {
                        window.location.href = `${frontendUrl}meal_plans.html`;
                    }, 1000);
                } else {
                    console.error('Update meal plan failed:', result);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    }

    // ###### User Mangement #######

    // Function to load user data
    async function loadUserData() {
        try {
            const response = await fetch(`${apiUrl}users/${currentUserId}`);
            const user = await response.json();

            if (response.ok) {
                document.getElementById('username').value = user.username;
                document.getElementById('email').value = user.email;
            } else {
                console.error('Failed to load user data:', user);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    // Function to update user data
    async function updateUserData(event) {
        event.preventDefault();

        const formData = new FormData(userForm);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch(`${apiUrl}users/${currentUserId}`, {
                method: 'PUT',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const result = await response.json();

            if (response.ok) {
                document.querySelector('.update-user-success').style.display = 'block';
                    setTimeout(() => {
                        window.location.href = `${frontendUrl}index.html`;
                    }, 1000);
            } else {
                console.error('Failed to update user data:', result);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    // Load user data when the page loads
    loadUserData();

    // Handle form submission for updating user data
    userForm.addEventListener('submit', updateUserData);

});
