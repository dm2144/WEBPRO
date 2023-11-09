var ourRequest = new XMLHttpRequest();
ourRequest.open('GET', 'https://dm2144.github.io/WEBPRO/week%204/cities1.json');
ourRequest.onload = function() {
var ourData = JSON.parse(ourRequest.responseText);
console.log(ourData[0]);
};
ourRequest.send();














