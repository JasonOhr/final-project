# Nutrition App
This app is used to find the nutritional value of foods and ingredients utilizing an API supplied by the USDA
The user can dynamically search a database of over 8500 ingredients and view there nutritional content.
The ingredients that come from the database are usually long and overly descriptive, so you can save custom names so that 
it's more convenient to use in a recipe.  This another feature of the app, the ability to assemble the ingredients 
for a recipe and in order to find it's nutritional content.

## Tech
This app was built using AngularJS and used Parse as the backend.  I wanted to make it quicker to search for the ingredients,
so instead of pinging the API's server during a search, I wanted to have a condensed version of it to use for searches.
and wanted to save this smaller file to LocalStorage on initial load.  I 