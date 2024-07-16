document.getElementById('meal-plan-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent form from submitting the traditional way
    const mealPlanName = document.getElementById('meal-plan-name').value; // Get meal plan name from the form

    fetch('/meal-plans', { // Send a POST request to the server
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: mealPlanName }) // Send the meal plan name as JSON
    })
    .then(response => response.json()) // Parse the response as JSON
    .then(data => {
        console.log('Meal plan created:', data); // Log the response data
        loadMealPlans(); // Reload the list of meal plans
    });
});

function loadMealPlans() {
    fetch('/meal-plans') // Send a GET request to the server
    .then(response => response.json()) // Parse the response as JSON
    .then(data => {
        const mealPlansList = document.getElementById('meal-plans-list'); // Get the div to display the meal plans
        mealPlansList.innerHTML = ''; // Clear the existing content
        data.forEach(plan => { // Iterate over the list of meal plans
            const div = document.createElement('div'); // Create a new div for each meal plan
            div.textContent = plan.name; // Set the text content to the meal plan name
            mealPlansList.appendChild(div); // Append the div to the meal plans list
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    loadMealPlans(); // Load the meal plans when the page is loaded
});
