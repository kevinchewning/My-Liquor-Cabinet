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

//API Key(s)
//TODO Get API key from "https://www.thecocktaildb.com/api.php"
var cocktailAPI = 523532

//TODO Get API key from "https://www.mediawiki.org/wiki/API:Main_page#API_documentation"

//TODO Get API key from "https://developers.google.com/youtube/v3"

//Event Listeners
searchBtn.on('click', fetchRecipes);
//ingrList.on('click', '.remove', removeIngr);

//Functions
//Fetch the ingredient list from CocktailDB
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
               ingredients.push(data.drinks[i].strIngredient1);
          }
          console.log(ingredients);
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

//TODO Write a function that adds ingredient from dropdown to myIngredients when clicked.
dropIngr.on('click', '.ingredient', function addIngr () {
     var ingredient = $(this).attr('data-ingredient');
     
     if (!myIngredients.includes(ingredient)) {
     var ingredientEl = $('<li>');
     var remove = $('<div>');
     ingredientEl.text(ingredient);
     ingredientEl.addClass('myIngredients');
     remove.text('X');
     remove.addClass('remove');

     myIngredients.push($(this).attr('data-ingredient'));
     console.log(myIngredients);

     ingrList.append(ingredientEl);
     ingredientEl.append(remove);
}});

//TODO Write a function to render ingredient list with removal buttons from form 
//(Should utilize local storage to save our ingredients on refresh)
//Removal buttons should have a class called ".remove" for the event listener


//Discuss
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


//TODO Write a function to fetch recipes from CocktailDB

function fetchRecipes () {
     var ingredients = "";

     for (i = 0; i < myIngredients.length; i++) {
          ingredients += myIngredients[i] + "%20";
     }

     var request = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=" + ingredients
     var requestURL = request
     console.log(requestURL);

     fetch(requestURL)
     .then(function (response) {
          return response.json();
     })
     .then(function (data) {
          console.log(data);
     })
}


//TODO Write a function to fetch wiki's for populated recipes (may need to go within render recipe cards function)

//TODO Write a function to fetch youtube links for populated recipes (may need to go within render recipe cards function)

//TODO Write a function to render popular recipe cards on page load

//TODO Write a function to render recipe cards upon search

//TODO Write a function to render a recipe modal when recipe is clicked