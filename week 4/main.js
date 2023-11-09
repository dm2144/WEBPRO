var ourRequest = new XMLHttpRequest();
ourRequest.open('GET', 'https://dm2144.github.io/WEBPRO/cities1.json');
ourRequest.onload = function() {
console.log(ourRequest.responseText);
};
ourRequest.send();














