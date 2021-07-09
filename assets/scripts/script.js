//Element Selecting Variables
var ingrList = $('#ingr-list');
var cardCont = $('#card-container');
var searchBtn = $('#searchBtn');
var dropIngr = $('#myDropdown');

//Global Variables
var ingredients = [];
var myIngredients = [];
var myIngredientsString;
var recipes = [];
var recipeIDs = [];
var myRecipes = [];

//API Key(s)
//TODO Get API key from "https://www.thecocktaildb.com/api.php"
var cocktailAPI = 9973533;

//TODO Get API key from "https://www.mediawiki.org/wiki/API:Main_page#API_documentation"

//TODO Get API key from "https://developers.google.com/youtube/v3"

//Event Listeners
searchBtn.on('click', fetchRecipes);
//ingrList.on('click', '.remove', removeIngr);

//Functions
//Fetch the entire ingredient list from CocktailDB
fetch("https://the-cocktail-db.p.rapidapi.com/list.php?i=list", {
     "method": "GET",
     "headers": {
          "x-rapidapi-key": "35d6c6f44bmshd692617dc44705dp131153jsnc3bf1d0d4e09",
          "x-rapidapi-host": "the-cocktail-db.p.rapidapi.com"
     }
})
     .then(function (response) {
          return response.json();
     })
     .then(function (data) {
          for (i = 0; i < data.drinks.length; i++) {
               //push server ingredients to ingredients array
               ingredients.push(data.drinks[i].strIngredient1);
          }
          //Render ingredients to dropdown menu after add.
          dropdownIngr();
     });

//TODO Write a function to add all ingredients to dropdown
function dropdownIngr() {
     for (i = 0; i < ingredients.length; i++) {
          var ingredient = $('<div>');
          ingredient.text(ingredients[i]);
          ingredient.attr('data-ingredient', ingredients[i]);
          ingredient.addClass('ingredient');

          $('#myDropdown').append(ingredient);
     }
}

//TODO Write a function to render dropdown menu
function dropdown() {
     document.getElementById("myDropdown").classList.toggle("show");
}

//filter dropdown ingredients to match what is typed in search box
function filterFunction() {
     var input = document.getElementById("myInput");
     var filter = input.value.toUpperCase();
     var a = $('.ingredient')
     for (i = 0; i < a.length; i++) {
          txtValue = a[i].textContent || a[i].innerText;
          if (txtValue.toUpperCase().indexOf(filter) > -1) {
               a[i].style.display = "";
          } else {
               a[i].style.display = "none";
          }
     }
}

//TODO Write a function that adds ingredient from dropdown to myIngredients variable when clicked.
dropIngr.on('click', '.ingredient', function addIngr () {
     //retrieves ingredient name from the data-ingredient attribute of element clicked
     var ingredient = $(this).attr('data-ingredient');
     
     //only adds to myIngredients if it is not there already
     if (!myIngredients.includes(ingredient)) {
          //create element w/ remove button and append to ingredient list
          var ingredientEl = $('<li>');
          var remove = $('<div>');
          ingredientEl.text(ingredient);
          ingredientEl.addClass('myIngredients');
          remove.text('X');
          remove.addClass('remove');

          //push ingredient value to myIngredients variable
          myIngredients.push($(this).attr('data-ingredient'));

          ingrList.append(ingredientEl);
          ingredientEl.append(remove);
}});

//Brit's remove ingredient code is below. Does not execute correctly.
/*
function removeIngr() {
     var ingredientIndex = ingredients.findIndex((el) => el.id === id);
     ingredients.splice(ingredientIndex, 1);
     renderElem();
     renderElem();
};

function renderElem() {
     document.querySelector("ingredients").innerHTML = "";
     ingredients.forEach((emp) => {
          var ingredientUl = document.createElement("a");
          var removeButton = document.createElement("button");
          ingredientUl.textContent = emp.title;
          removeButton.addEventListener("click", (a) => {
               removeButton(a, emp.id);
          });
          document.querySelector("ingredients").append(ingredientUl, removeButton);
     });
}
document.querySelector("ingredients-input").addEventListener("change", (a) => {
     a.preventDefault();
     var id = uuid();
     ingredients.push({
          id: id,
          title: a.target.value
     });
     renderElem();
});
*/


//TODO Write a function to remove ingredient when remove button is clicked (remove from screen and from myIngredients variable.)
function removeIngr() {

}

/*CocktailDB's API doe's not allow you to pull recipes from available ingredients. It only allows you
   to search for an exact match with multiple ingredients. Instead we are going to pull all alcoholic recipes
   and add the match functionality ourselves*/


//Collects all alcoholic drink ID's from database
function fetchAllIDs() {
     fetch("https://www.thecocktaildb.com/api/json/v2/9973533/filter.php?a=Alcoholic")
     .then(function (response) {
          return response.json();
     })
     .then(function (data) {
          //created a loop to push drink id numbers to the recipeIDs array
          for (i = 0; i < data.drinks.length; i++) {
               recipeIDs.push(data.drinks[i].idDrink);
          }
          console.log(recipeIDs);
     })
}

//Collects all necessary recipe info from database and stores it in recipes object
function fetchAllRecipes() {
     for (i = 0; i < recipeIDs.length; i++) {
          var requestURL = "https://www.thecocktaildb.com/api/json/v2/9973533/lookup.php?i=" + recipeIDs[i];
          fetch(requestURL)
          .then(function (response) {
               return response.json();
          })
          .then(function (data) {
               var recipe = {
                    name: "",
                    id: "",
                    thumbnail: "",
                    glassType: "",
                    ingredients: [],
                    measurements: [],
                    instructions: ""
               }

               recipe.name = data.drinks[0].strDrink;
               recipe.id = data.drinks[0].idDrink;
               recipe.thumbnail = data.drinks[0].strDrinkThumb;
               recipe.glassType = data.drinks[0].strGlass;

               //ingredients and measurements are not part of an array but individually named values
               //Created loops to pull data from all values that are not 'null'
               for (i = 1; i < 16; i++) {
                    var ingredient = 'strIngredient' + i;
                    if (data.drinks[0][ingredient] != null) {
                         recipe.ingredients.push(data.drinks[0][ingredient]);
                    }
               }

               for (i = 1; i < 16; i++) {
                    var measurement = 'strMeasure' + i;
                    if (data.drinks[0][measurement] != null) {
                         recipe.measurements.push(data.drinks[0][measurement]);
                    }
               }

               recipe.instructions = data.drinks[0].strInstructions;
               
               //push recipe object into our local recipes array
               recipes.push(recipe);
          })
     }
     console.log(recipes);
}

//Fetches all ID's on page load
fetchAllIDs();
//Set timeout to allow time for ID's to populate before fetching recipes
setTimeout(fetchAllRecipes, 1500);

//Fetches all recipes that have exact ingredient matches to available ingredients when search button is clicked.
function fetchRecipes() {
     myRecipes = [];
     for (i = 0; i < recipes.length; i++) {
          match = recipes[i].ingredients.every(val => myIngredients.includes(val));
          if (match) {
               myRecipes.push(recipes[i]);
          }
     }
     //Recipes that match are logged to the console. This is the info needed to render recipe cards.
     console.log(myRecipes);
}


//TODO Write a function to fetch wiki's for populated recipes (may need to go within render recipe cards function)

//TODO Write a function to fetch youtube links for populated recipes (may need to go within render recipe cards function)

//TODO Write a function to render popular recipe cards on page load

//TODO Write a function to render recipe cards upon search

//TODO Write a function to render a recipe modal when recipe is clicked