const likeBtn = document.getElementById("like-btn");
const clearFavoriteBtn = document.getElementById("clear-btn");
const randomMealimgEl = document.getElementById("random_meal_img");
const randomMealNameEl = document.getElementById("random_meal_name");
const randomMealRecipeEl = document.getElementById("random-recipe-btn")
const favoriteContainer = document.getElementById("favorite-meals");
const refreshButton = document.getElementById("refresh-btn");
const searchText = document.getElementById("search-text");
const searchButton = document.getElementById("search");
const mealsEl = document.getElementById("meals");
const popupMealEl = document.getElementById("popup-meal");
const popupCloseButten = document.getElementById("close-popup");
const popupDataEl = document.getElementById("popup-data");


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

popupCloseButten.addEventListener("click", ()=> {
    popupMealEl.classList.add("hide");
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
    console.log(randomMeal);
}

async function getMealsBySearch(mealName){
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s='+mealName);
    const respData = await response.json();
    const mealsBySearch = respData.meals;
    return mealsBySearch;
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
    //console.log(numberOfFavoriteMeals);
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
        //console.log(meal);
        addMealToFavoriteContainer(meal);
    });
    
}

function showPopupMeal(mealData){
    const popUpData = document.createElement("div");
    popUpData.innerHTML =
    `<button id="close-popup" class="close-popup"><i class="fas fa-times"></i></button>
    <h1>${mealData.strMeal}</h1>
    <img src="${mealData.strMealThumb}" alt="">
</div>
<div>
    <p>${mealData.strInstructions}</p>
    <ul>
        <li>ing 1 / measure</li>
        <li>ing 2 / measure</li>
        <li>ing 3 / measure</li>
    </ul>
</div>`
popupDataEl.appendChild(popUpData);
}

function addMealToFavoriteContainer(i_MealToAdd){
    const mealToWeb = document.createElement("li");
    
    mealToWeb.innerHTML =
    `<header>
    <button href=${i_MealToAdd.strSource} title="Recipe" id="recipe-btn" class="fav-btn-item"><i class="fas fa-book-reader"></i></button>
    <button title="Delete" id="delete-btn" class="fav-btn-item""><i class="fas fa-times"></i></button>
    </header>
    <img src="${i_MealToAdd.strMealThumb}" alt=""><span>${i_MealToAdd.strMeal}</span>`;
    favoriteContainer.prepend(mealToWeb);

    const deleteButton = document.getElementById("delete-btn");
    deleteButton.addEventListener("click",() =>{
        removeMealFromLocalStorage(i_MealToAdd.idMeal);
        favoriteContainer.removeChild(mealToWeb);
        //console.log(i_MealToAdd.strMeal + " - " + randomMealNameEl)
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

searchButton.addEventListener("click",async ()=> {
    const searchMeal = await getMealsBySearch(searchText.value);
    //const mealToWeb = document.createElement("div");
    //mealToWeb.classList.add("meal");
    //randMeal = mealsEl.firstElementChild;
    //mealToWeb.appendChild(randMeal);
    //console.log(mealToWeb);
    while (mealsEl.hasChildNodes()) {  
        mealsEl.removeChild(mealsEl.firstChild);
      }
    //mealsEl.innerHTML = mealToWeb.innerHTML;
    searchMeal.forEach(meal => {
        addMeal(meal);
    });
});

function addMeal(mealData) {
    const mealToWeb = document.createElement("div");
    //console.log(mealToWeb);
    mealToWeb.classList.add("meal");
    //console.log(mealData);

    mealToWeb.innerHTML = `
    <div class="meal-header">
                    <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
    </div>
                <div class="meal-body">
                    <div class="meal_name" id="random_meal_name">
                        
                    <h4>${mealData.strMeal}</h4>
                    </div>
                    
                <div class="meal-body-buttons">
                    <button title="Recipe" id="random-recipe-btn" class="recipe-item"><i class="fas fa-book-reader"></i></button>
                    <button title="Add To Favorite" id="like-btn" class="fav-btn"><i class="fas fa-heart"></i></button>
                </div>`;
                const btn = mealToWeb.querySelector(".fav-btn");

                btn.addEventListener("click", () => {
                    if (btn.classList.contains("active")) {
                        removeMealFromLocalStorage(mealData.idMeal);
                        removeMealFromFavoriteContainer();
                        btn.classList.remove("active");
                    } else {
                        addMealToLocalStorage(mealData);
                        addMealToFavoriteContainer(mealData);
                        btn.classList.add("active");
                    }

                });
    mealsEl.appendChild(mealToWeb);
        }