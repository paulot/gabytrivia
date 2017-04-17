function get(url, callback) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() { 
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200 && callback) callback(JSON.parse(xmlHttp.responseText));
  }
  xmlHttp.open('GET', url, true);
  xmlHttp.send(null);
}

function searchGiphy(query, limit, offset, callback) {
  var baseUrl = 'http://api.giphy.com/v1/gifs/search?';
  var apiKey = 'api_key=dc6zaTOxFJmzC'; 
  query = 'q=' + encodeURIComponent(query);
  limit = 'limit=' + limit;
  offset = 'offset=' + offset;
  var url = baseUrl + query + '&' + limit + '&' + offset + '&' + apiKey;
  get(url, callback);
}

function handleData(data) {
  return data.data.map(function(giphy_obj) {
    return giphy_obj.images.fixed_height_small;
  });
}

function imgToHtml(img) {
  return '<img src="' + img.url + '" width="' + img.width + '" height="' + img.height + '">';
}
