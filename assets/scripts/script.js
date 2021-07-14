//Element Selecting Variables
var ingrList = $('#ingr-list');
var cardCont = $('#card-container');
var searchBtn = $('#searchBtn');
var dropIngr = $('#block-1');

//Global Variables
var ingredients = [];
var myIngredientsString = localStorage.getItem("myIngredientsString");
var myIngredients = JSON.parse(myIngredientsString) ?? [];
var recipes = [];
var recipeIDs = [];
var myRecipes = [];

//API Key(s)
var cocktailAPI = 9973533;
var apiKey = "AIzaSyCxmS-DDoBQ-DA9kHkCIk7msct3umZi_Mw"

//Event Listeners
searchBtn.on('click', fetchRecipes);

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

//Add all ingredients to dropdown
function dropdownIngr() {
     for (i = 0; i < ingredients.length; i++) {
          var ingredient = $('<a>');
          ingredient.text(ingredients[i]);
          ingredient.attr('data-ingredient', ingredients[i]);
          ingredient.addClass('ingredient panel-block');

          $('#block-1').append(ingredient);
     }
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

//Add ingredient from dropdown to myIngredients variable when clicked.
dropIngr.on('click', 'a', function addIngr () {
     //retrieves ingredient name from the data-ingredient attribute of element clicked
     var ingredient = $(this).attr('data-ingredient');
     var lowercase = $(this).attr('data-ingredient').toLowerCase();
     
     //only adds to myIngredients if it is not there already
     if (!myIngredients.includes(lowercase)) {
          //create element w/ remove button and append to ingredient list
          var ingredientEl = $('<li>');
          var remove = $('<div>');
          ingredientEl.text(ingredient);
          ingredientEl.attr('data-ingredient', lowercase);
          ingredientEl.addClass('myIngredients notification');
          remove.text('✖');
          remove.addClass('remove');

          //push ingredient value to myIngredients variable and local storage
          //Made lowercase for matching functions
          myIngredients.push(lowercase);
          localStorage.setItem('myIngredientsString', JSON.stringify(myIngredients));

          ingrList.append(ingredientEl);
          ingredientEl.append(remove);
     }
});

//Render locally saved ingredients
function renderMyIngredients () {
     for(i = 0; i < myIngredients.length; i++) {
          var ingredientEl = $('<li>');
          var remove = $('<div>');
          ingredientEl.text(myIngredients[i]);
          ingredientEl.attr('data-ingredient', myIngredients[i]);
          ingredientEl.addClass('myIngredients notification');
          remove.text('✖');
          remove.addClass('remove');

          ingrList.append(ingredientEl);
          ingredientEl.append(remove);
     }
}

//Calls function on load
renderMyIngredients();

//Remove ingredient when remove button is clicked.
ingrList.on('click', '.remove', function removeIngr() {
     var ingredient = $(this).parent().attr('data-ingredient');
     var index = myIngredients.indexOf(ingredient);

     //If index value is valid, splice ingredient from myIngredients variable, update local storage
     if (index > -1) {
       myIngredients.splice(index, 1);
       localStorage.setItem('myIngredientsString', JSON.stringify(myIngredients));
     }

     //Removes element from screen
     $(this).parent().remove();
})

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
               //Save all recipes in an object
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
                         //Made lowercase for matching purposes
                         var lowercase = data.drinks[0][ingredient].toLowerCase();
                         recipe.ingredients.push(lowercase);
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
}

//Fetches all ID's on page load
fetchAllIDs();
//Set timeout to allow time for ID's to populate before fetching recipes
setTimeout(fetchAllRecipes, 1500);

//Render recipe cards upon search
function rendertiles() {
     for (var i = 0; i < myRecipes.length; i++) {          
          let tile =$('<div class="tile is-3 box is-vertical mx-1 mb-4 has-background-warning">');
          let title =$('<p class="title">');
          let image =$('<img class="image is-128x128">').attr('src', myRecipes[i].thumbnail);
          let modalL =$("<a>").addClass('recipe');
          let youtubeL =$("<a>").addClass('youtube');
          let wikiL =$("<a>").addClass('wiki');

          title.text(myRecipes[i].name);
          modalL.text("Full Recipe");
          modalL.attr('data-index', i);
          youtubeL.text("YouTube");
          youtubeL.attr('data-recipe', myRecipes[i].name);
          wikiL.text("Wikipedia");
          wikiL.attr('data-recipe', myRecipes[i].name);

          cardCont.append(tile);         
          tile.append(title);
          tile.append(image);
          tile.append(modalL);
          tile.append(youtubeL);
          tile.append(wikiL);
     }         
}

//Fetches all recipes that have exact ingredient matches to available ingredients when search button is clicked.
function fetchRecipes() {
     //Clear current recipes before new search
     myRecipes = [];

     //Loop through available recipes and match recipes that user has all ingredients for
     for (i = 0; i < recipes.length; i++) {
          match = recipes[i].ingredients.every(val => myIngredients.includes(val));
          if (match) {
               myRecipes.push(recipes[i]);
          }
     }
     console.log(myRecipes);
     cardCont.children().remove();
     //Show notification with number of results found
     var notification = $('<div id="notification" class="notification is-warning has-text-weight-bold">')
     var deleteBtn = $('<button class="delete">')
     if (myRecipes.length == 0) {          
          notification.text('Sorry! No recipes found that match your entered ingredients.')         
     } else {
          var message;
          //If,Else for proper grammar =D
          if (myRecipes.length == 1) {
               message = "We have found " + myRecipes.length + " recipe that matches your ingredients!"
          } else {
               message = "We have found " + myRecipes.length + " recipes that match your ingredients!"
          }
          notification.text(message);          
     }

     //Append notification
     cardCont.append(notification);
     notification.append(deleteBtn);

     //Render new tiles
     rendertiles();
}


//Fetch wiki's for populated recipes (may need to go within render recipe cards function)
$('#card-container').on('click', '.wiki', function wikilink(){
     var name = $(this).attr("data-recipe");
     let apiURL="https://en.wikipedia.org/w/rest.php/v1/search/page?q=" + name

     $.ajax({
          type: "GET",
          url: apiURL,
          dataType:"JSON"
     }).then(function(response){
          var link= "https://en.wikipedia.org/wiki/" + response.pages[0].key
          window.open(link)         
     })
})
//Fetch youtube links for populated recipes (may need to go within render recipe cards function)

$('#card-container').on('click', '.youtube', function youTubeLink(){
     var name = $(this).attr("data-recipe");
     let apiKey = "AIzaSyCxmS-DDoBQ-DA9kHkCIk7msct3umZi_Mw";
     let apiURL="https://youtube.googleapis.com/youtube/v3/search?q=" + name + "recipe" + "&key=" + apiKey;

     $.ajax({
          type: "GET",
          url: apiURL,
          dataType:"JSON"
     }).then(function(response){
          var link= "https://youtube.com/watch?v=" + response.items[0].id.videoId
          window.open(link);
     })
})

//Render popular recipe cards on page load
$( window ).on( "load", function popularRecipes() {
     var requestURL = "https://www.thecocktaildb.com/api/json/v2/9973533/popular.php"
          fetch(requestURL)
          .then(function (response) {
               return response.json();
          })
          .then(function (data) {
               //Loop through first 10 popular recipes
               for(i = 0; i < 10; i++) {
                    //Create recipe object
                    var recipe = {
                         name: "",
                         id: "",
                         thumbnail: "",
                         glassType: "",
                         ingredients: [],
                         measurements: [],
                         instructions: ""
                    }
     
                    recipe.name = data.drinks[i].strDrink;
                    recipe.id = data.drinks[i].idDrink;
                    recipe.thumbnail = data.drinks[i].strDrinkThumb;
                    recipe.glassType = data.drinks[i].strGlass;
     
                    //ingredients and measurements are not part of an array but individually named values
                    //Created loops to pull data from all values that are not 'null'
                    for (x = 1; x < 16; x++) {
                         var ingredient = 'strIngredient' + x;
                         if (data.drinks[i][ingredient] != null) {
                              //Made lowercase for matching purposes
                              var lowercase = data.drinks[i][ingredient].toLowerCase();
                              recipe.ingredients.push(lowercase);
                         }
                    }
     
                    for (x = 1; x < 16; x++) {
                         var measurement = 'strMeasure' + x;
                         if (data.drinks[i][measurement] != null) {
                              recipe.measurements.push(data.drinks[i][measurement]);
                         }
                    }
     
                    recipe.instructions = data.drinks[0].strInstructions;
                    
                    //push recipe object into our local recipes array
                    myRecipes.push(recipe);
               }
               
               //Calls render function when done
               rendertiles();
})
})

//Render a recipe modal when recipe is clicked
cardCont.on('click', '.recipe', function renderModal() {
     console.log('click');
     index = $(this).attr('data-index');

     var modal = $('<div id="modal" class="modal is-active">');
     var modalBackground = $('<div class="modal-background">');
     var modalContent = $('<div class="modal-content">');
     var modalBox = $('<div class="box">');
     var modalButton = $('<button class="modal-close is-large" aria-label="close">');

     var recipeName = $('<h2 class="title">');
     var recipeImage = $('<image class="image is-128x128">');
     var recipeGlass = $('<p class="mt-2">');
     var recipeIngredients = $('<div class="ingrModal mt-2">');
     var recipeMeasurements = $('<div class="measModal mt-2">');
     var recipeInstructions = $('<p class="mt-2">');

     recipeName.text(myRecipes[index].name);
     recipeImage.attr('src', myRecipes[index].thumbnail);
     recipeGlass.text('Glass: ' + myRecipes[index].glassType);
     
     //Loop through available ingrdients/measurements and append them to their own divs
     for(i = 0; i < myRecipes[index].ingredients.length; i++){
          meas = $('<p>');
          if (myRecipes[index].measurements[i] != undefined) {               
               meas.text(myRecipes[index].measurements[i]);               
          } else {
               meas.text("");
          }
          recipeMeasurements.append(meas);

          ingr = $('<p>');
          ingr.text(myRecipes[index].ingredients[i]);
          recipeIngredients.append(ingr);
     }
     recipeInstructions.text("Instructions: " + myRecipes[index].instructions);

     $('body').append(modal);
     modal.append(modalBackground);
     modal.append(modalContent);
     modal.append(modalButton);
     modalContent.append(modalBox);
     modalBox.append(recipeName);
     modalBox.append(recipeImage);
     modalBox.append(recipeMeasurements);
     modalBox.append(recipeIngredients);
     modalBox.append(recipeGlass);    
     modalBox.append(recipeInstructions);
})

//Render a modal on page load that informs user of how to use site.
$( window ).on( "load", function splashModal() {
     console.log('load');
     var modal = $('<div id="modal" class="modal is-active">');
     var modalBackground = $('<div class="modal-background">');
     var modalContent = $('<div class="modal-content">');
     var modalBox = $('<div class="box">');
     var modalButton = $('<button class="modal-close is-large" aria-label="close">');
     var title = $('<h2 class="title">');
     var text = $('<p>');

     title.text('My Liquor Cabinet');
     text.text('Welcome to My Liquor Cabinet! Ever wonder what cocktails you could make with what you already have at home? Look no further! Simply add the liquor and mixers you have at home and click "Search Recipes". We will show you what cocktails you have the ingredients for, how to make them, a link to a helpful YouTube video about how to make it, and a wiki article about it!');

     $('body').append(modal);
     modal.append(modalBackground);
     modal.append(modalContent);
     modal.append(modalButton);
     modalContent.append(modalBox);
     modalBox.append(title);
     modalBox.append(text);
})

//Function to remove notification
cardCont.on('click', '.delete', function removeNotification() {
     $('#notification').remove();
})

//Function to remove modal
//If user clicks outside of modal
$('body').on('click', '.modal-background', function removeModal() {
     $('#modal').remove();
});

//If user clicks close button
$('body').on('click', '.modal-close', function removeModal() {
     $('#modal').remove();
});