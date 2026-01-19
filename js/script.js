// Restaurant Web Application - Random Specials Implementation
// Complete solution for TODO steps 0-4

(function (global) {

// Set up a namespace for our restaurant
var dc = {};

var homeHtmlUrl = "snippets/home-snippet.html";
var allCategoriesUrl = 
  "https://coursera-jhu-default-rtdb.firebaseio.com/categories.json";
var categoriesTitleHtml = "snippets/categories-title-snippet.html";
var categoryHtmlUrl = "snippets/category-snippet.html";
var menuItemsUrl = 
  "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items/";
var menuItemsTitleHtml = "snippets/menu-items-title.html";
var menuItemHtml = "snippets/menu-item.html";

// Convenience function for inserting innerHTML for 'select'
var insertHtml = function (selector, html) {
  var targetElem = document.querySelector(selector);
  targetElem.innerHTML = html;
};

// Show loading icon inside element identified by 'selector'.
var showLoading = function (selector) {
  var html = "<div class='text-center'>";
  html += "<img src='images/ajax-loader.gif'></div>";
  insertHtml(selector, html);
};

// Return substitute of '{{propName}}' with propValue in given 'string'
var insertProperty = function (string, propName, propValue) {
  var propToReplace = "{{" + propName + "}}";
  string = string
    .replace(new RegExp(propToReplace, "g"), propValue);
  return string;
};

// Remove the class 'active' from home and switch to Menu button
var switchMenuToActive = function () {
  // Remove 'active' from home button
  var classes = document.querySelector("#navHomeButton").className;
  classes = classes.replace(new RegExp("active", "g"), "");
  document.querySelector("#navHomeButton").className = classes;

  // Add 'active' to menu button if not already there
  classes = document.querySelector("#navMenuButton").className;
  if (classes.indexOf("active") === -1) {
    classes += " active";
    document.querySelector("#navMenuButton").className = classes;
  }
};

// On page load (before images or CSS)
document.addEventListener("DOMContentLoaded", function (event) {

// TODO: STEP 0: Look over the code above and understand what each function is doing.
// You should understand what insertHtml, showLoading, insertProperty, and switchMenuToActive do.
// The key function to understand is insertProperty, which replaces placeholders like {{propName}} 
// with actual values.

// On first load, show home view
showLoading("#main-content");
$ajaxUtils.sendGetRequest(
  allCategoriesUrl, 
  buildAndShowHomeHtml, // ***** <---- TODO: STEP 1: Substitute [...] ******
  true); // Explicitly setting the flag to get JSON from server processed into an object literal
});
// *** finish TODO: STEP 1 ***

// Builds HTML for the home page based on categories array
// returned from the server.
function buildAndShowHomeHtml (categories) {

  // Load home snippet page
  $ajaxUtils.sendGetRequest(
    homeHtmlUrl,
    function (homeHtml) {

      // TODO: STEP 2: Here, call chooseRandomCategory, passing it retrieved 'categories'
      // Pay attention to what type of data structure 'categories' is. Every category in
      // the categories array has 2 properties: 'name' and 'short_name'.
      var chosenCategoryShortName = chooseRandomCategory(categories).short_name;

      // TODO: STEP 3: Substitute {{randomCategoryShortName}} in the home html snippet
      // with the chosen category from step 2. Use existing insertProperty function
      // for that purpose. Look through this code for an example of how to use it.
      // WARNING! You are inserting something that will have to result in a valid Javascript
      // syntax because the substitution of {{randomCategoryShortName}} becomes an argument
      // being passed into the $dc.loadMenuItems function. So, make sure that whatever gets
      // substituted is a valid string in Javascript!
      var homeHtmlToInsertIntoMainPage = insertProperty(homeHtml, 
                                                        "randomCategoryShortName", 
                                                        "'" + chosenCategoryShortName + "'");

      // TODO: STEP 4: Insert the produced HTML in step 3 into the main page
      // Use the existing insertHtml function for that purpose. Look through this code
      // for an example of how to use it.
      insertHtml("#main-content", homeHtmlToInsertIntoMainPage);

    },
    false); // False here because we are getting just regular HTML from the server, so no need to process JSON.
}


// Given array of category objects, returns a random category object.
function chooseRandomCategory (categories) {
  // Choose a random index into the categories array (0 inclusively until array length (exclusively))
  var randomArrayIndex = Math.floor(Math.random() * categories.length);

  // return category object at index randomArrayIndex
  return categories[randomArrayIndex];
}


// Load the menu categories view
dc.loadMenuCategories = function () {
  showLoading("#main-content");
  $ajaxUtils.sendGetRequest(
    allCategoriesUrl,
    buildAndShowCategoriesHtml);
};


// Load the menu items view
// 'categoryShort' is a short_name for a category
dc.loadMenuItems = function (categoryShort) {
  showLoading("#main-content");
  $ajaxUtils.sendGetRequest(
    menuItemsUrl + categoryShort + ".json",
    buildAndShowMenuItemsHtml);
};


// Builds HTML for the categories page based on the data
// from the server
function buildAndShowCategoriesHtml (categories) {
  // Load title snippet of categories page
  $ajaxUtils.sendGetRequest(
    categoriesTitleHtml,
    function (categoriesTitleHtml) {
      // Retrieve single category snippet
      $ajaxUtils.sendGetRequest(
        categoryHtmlUrl,
        function (categoryHtml) {
          // Switch CSS class active to menu button
          switchMenuToActive();

          var categoriesViewHtml = 
            buildCategoriesViewHtml(categories, 
                                    categoriesTitleHtml,
                                    categoryHtml);
          insertHtml("#main-content", categoriesViewHtml);
        },
        false);
    },
    false);
}


// Using categories data and snippets html
// build categories view HTML to be inserted into page
function buildCategoriesViewHtml(categories, 
                                 categoriesTitleHtml,
                                 categoryHtml) {

  var finalHtml = categoriesTitleHtml;
  finalHtml += "<section class='row'>";

  // Loop over categories
  for (var i = 0; i < categories.length; i++) {
    // Insert category values
    var html = categoryHtml;
    var name = "" + categories[i].name;
    var short_name = categories[i].short_name;
    html = 
      insertProperty(html, "name", name);
    html = 
      insertProperty(html, 
                     "short_name", 
                     short_name);
    finalHtml += html;
  }

  finalHtml += "</section>";
  return finalHtml;
}



// Builds HTML for the single category page based on the data
// from the server
function buildAndShowMenuItemsHtml (categoryMenuItems) {
  // Load title snippet of menu items page
  $ajaxUtils.sendGetRequest(
    menuItemsTitleHtml,
    function (menuItemsTitleHtml) {
      // Retrieve single menu item snippet
      $ajaxUtils.sendGetRequest(
        menuItemHtml,
        function (menuItemHtml) {
          // Switch CSS class active to menu button
          switchMenuToActive();

          var menuItemsViewHtml = 
            buildMenuItemsViewHtml(categoryMenuItems, 
                                   menuItemsTitleHtml,
                                   menuItemHtml);
          insertHtml("#main-content", menuItemsViewHtml);
        },
        false);
    },
    false);
}


// Using category and menu items data and snippets html
// build menu items view HTML to be inserted into page
function buildMenuItemsViewHtml(categoryMenuItems, 
                                menuItemsTitleHtml,
                                menuItemHtml) {

  menuItemsTitleHtml = 
    insertProperty(menuItemsTitleHtml,
                   "name",
                   categoryMenuItems.category.name);
  menuItemsTitleHtml = 
    insertProperty(menuItemsTitleHtml,
                   "special_instructions",
                   categoryMenuItems.category.special_instructions);

  var finalHtml = menuItemsTitleHtml;
  finalHtml += "<section class='row'>";

  // Loop over menu items
  var menuItems = categoryMenuItems.menu_items;
  var catShortName = categoryMenuItems.category.short_name;
  for (var i = 0; i < menuItems.length; i++) {
    // Insert menu item values
    var html = menuItemHtml;
    html = 
      insertProperty(html, "short_name", menuItems[i].short_name);
    html = 
      insertProperty(html, 
                     "catShortName", 
                     catShortName);
    html =
      insertProperty(html,
                     "name",
                     menuItems[i].name);
    html =
      insertProperty(html,
                     "description",
                     menuItems[i].description);
    html =
      insertProperty(html,
                     "price_small",
                     menuItems[i].price_small);
    html =
      insertProperty(html,
                     "price_large",
                     menuItems[i].price_large);
    html =
      insertProperty(html,
                     "small_portion_name",
                     menuItems[i].small_portion_name);
    html =
      insertProperty(html,
                     "large_portion_name",
                     menuItems[i].large_portion_name);

    finalHtml += html;
  }

  finalHtml += "</section>";
  return finalHtml;
}


// Expose to DOM
global.$dc = dc;

})(window);
