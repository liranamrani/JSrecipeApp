const likeBtn = document.getElementById("like-btn");
const clearFavoriteBtn = document.getElementById("clear-btn");
const randomMealimgEl = document.getElementById("random_meal_img");
const randomMealNameEl = document.getElementById("random_meal_name");
const favoriteContainer = document.getElementById("favorite-meals");


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
        likeBtn.className = "fav-btn"
        removeMealFromLocalStorage(randomMeal);
        removeMealToFavoriteContainer();
    }
});
clearFavoriteBtn.addEventListener("click", () => {
    localStorage.clear();
    while (favoriteContainer.hasChildNodes()) {  
        favoriteContainer.removeChild(favoriteContainer.firstChild);
      }
});

async function getRandomMeal(){
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
    randomMeal = await response.json();
    randomMeal = randomMeal.meals[0];
    randomMealimgEl.src = randomMeal.strMealThumb;
    randomMealNameEl.innerText = randomMeal.strMeal;

    //console.log(randomMeal);
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

function removeMealFromLocalStorage(mealId){
    const mealIds = getMealFromLocalStorage();
    localStorage.setItem('mealIds',JSON.stringify
    (mealIds.filter(id => id !== mealId)));
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
    `<img src="${i_MealToAdd.strMealThumb}" alt=""><span>${i_MealToAdd.strMeal}</span>`;
    favoriteContainer.prepend(mealToWeb);
}

function removeMealToFavoriteContainer(){

    favoriteContainer.removeChild(favoriteContainer.firstChild);
}