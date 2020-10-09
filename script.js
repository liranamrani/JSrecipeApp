const likeBtn = document.getElementById("like-btn");
const clearFavoriteBtn = document.getElementById("clear-btn");
const randomMealimgEl = document.getElementById("random_meal_img");
const randomMealNameEl = document.getElementById("random_meal_name");
const randomMealRecipeEl = document.getElementById("random-recipe-btn")
const favoriteContainer = document.getElementById("favorite-meals");
const refreshButton = document.getElementById("refresh-btn");


getRandomMeal();
fetchFavoriteMeals();
likeBtn.addEventListener("click",() => {
    if (likeBtn.className == "fav-btn")
    {
    likeBtn.className = "fav-btn active"
    addMealToLocalStorage(randomMeal);
    addMealToFavoriteContainer(randomMeal);
    }
    else{
        likeBtn.className = "fav-btn";
        removeMealFromLocalStorage(randomMeal.idMeal);
        removeMealFromFavoriteContainer();
    }
});

clearFavoriteBtn.addEventListener("click", () => {
    likeBtn.className = "fav-btn";
    localStorage.clear();
    while (favoriteContainer.hasChildNodes()) {  
        favoriteContainer.removeChild(favoriteContainer.firstChild);
      }
});

refreshButton.addEventListener("click",() =>{
    likeBtn.className = "fav-btn";
    getRandomMeal();
});



async function getRandomMeal(){
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
    randomMeal = await response.json();
    randomMeal = randomMeal.meals[0];
    randomMealimgEl.src = randomMeal.strMealThumb;
    randomMealNameEl.innerText = randomMeal.strMeal;
    randomMealRecipeEl.setAttribute("href",randomMeal.strSource);
}

async function getMealsBySearch(mealName){
    const mealsBySearch = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s='+mealName);
}

async function getMealById(id){
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/lookup.php?i='+id);
    const maelById = await response.json();
    chosenMealId = maelById.meals[0];
    return chosenMealId;
}


function addMealToLocalStorage(mealId){
    const mealIds = getMealFromLocalStorage();
    localStorage.setItem('mealIds',JSON.stringify([...mealIds,mealId]));
    let numberOfFavoriteMeals = JSON.parse(localStorage.getItem("mealIds"));
    numberOfFavoriteMeals = numberOfFavoriteMeals.length;
    console.log(numberOfFavoriteMeals);
    if (numberOfFavoriteMeals > 4){
        favoriteContainer.classList.add("long");
    }
}

function getMealFromLocalStorage(){
    const mealIds = JSON.parse(localStorage.getItem('mealIds'));
    return mealIds == null ? [] : mealIds;  // if empty return empty array and not null.
}

function removeMealFromLocalStorage(i_MealId){
    const mealIds = getMealFromLocalStorage();
    localStorage.setItem('mealIds',JSON.stringify
    (mealIds.filter(idMealObj => idMealObj.idMeal !== i_MealId)));
}

async function fetchFavoriteMeals(){
    const mealIds = getMealFromLocalStorage();
    const mealsToShowOnScreen = [];

    mealIds.forEach(meal => {
        console.log(meal);
        addMealToFavoriteContainer(meal);
    });
    
}

function addMealToFavoriteContainer(i_MealToAdd){
    const mealToWeb = document.createElement("li");
    
    mealToWeb.innerHTML =
    `<header>
    <button href=${i_MealToAdd.strSource} title="Recipe" id="recipe-btn" class="recipe-item"><i class="fas fa-book-reader"></i></button>
    <button title="Delete" id="delete-btn" class="delete-item"><i class="fas fa-times"></i></button>
    </header>
    <img src="${i_MealToAdd.strMealThumb}" alt=""><span>${i_MealToAdd.strMeal}</span>`;
    favoriteContainer.prepend(mealToWeb);

    const deleteButton = document.getElementById("delete-btn");
    deleteButton.addEventListener("click",() =>{
        removeMealFromLocalStorage(i_MealToAdd.idMeal);
        favoriteContainer.removeChild(mealToWeb);
        console.log(i_MealToAdd.strMeal + " - " + randomMealNameEl)
        if (i_MealToAdd.strMeal == randomMealNameEl.innerText){
            likeBtn.className = "fav-btn"
        }
    });

    const recipeButton = document.getElementById("recipe-btn");
    recipeButton.addEventListener("click",() =>
    {
        window.open(recipeButton.getAttribute("href"));
    });
}

function removeMealFromFavoriteContainer(){

    favoriteContainer.removeChild(favoriteContainer.firstChild);
}


randomMealRecipeEl.addEventListener("click",() =>
{
    window.open(randomMealRecipeEl.getAttribute("href"));
});