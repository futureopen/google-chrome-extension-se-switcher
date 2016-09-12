var tabLink = '';
var searchQueryParameters = []
var ID_2_QUERY_MAP = {
	'bing' 	: 'https://www.bing.com/search?q=',
	'google' : 'https://www.google.com/search?q=',
	'aol'		: 'http://search.aol.com/aol/search?q=',
	'yahoo'	: 'https://search.yahoo.com/search?p='
};

function toTitleCase(str){
   return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

function getParameterByName(name, url) {
	name = name.replace(/[\[\]]/g, "\\$&");
	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
	results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function getSearchQueryParameter(sEngineQueryFormat){
   return sEngineQueryFormat.substr(sEngineQueryFormat.search(/\?/)+1, sEngineQueryFormat.search(/\=/)-sEngineQueryFormat.search(/\?/)-1);
}

function click(e) {
	chrome.tabs.query({'active': true, currentWindow: true}, function (tabs) {
		tabLink = tabs[0].url;
		var sEngineQueryFormat = ID_2_QUERY_MAP[e.target.id]
      for (var i=0; i<searchQueryParameters.length; i++){
         searchQuery = getParameterByName(searchQueryParameters[i], tabLink)
         if (searchQuery){
            //console.log("Clicked on:%s, tabLink is:%s, searchQuery is:%s", e.target.id, tabLink, searchQuery)
            chrome.tabs.create({'url':[sEngineQueryFormat, searchQuery].join('')});
            window.close();
            break;
         }
      }
	});
	tabLink = ''
}

//ENTRY POINT to set up the HTML, callbacks and all variables.
document.addEventListener('DOMContentLoaded', function () {
   for (var key in ID_2_QUERY_MAP){
      var searchEngineText =  toTitleCase(key);
      var searchDiv = document.createElement('div');
      searchDiv.id = key;
      searchDiv.innerText = toTitleCase(key);
      searchDiv.addEventListener('click', click);
      document.body.appendChild(searchDiv);
      searchQueryParameters.push(getSearchQueryParameter(ID_2_QUERY_MAP[key]));
   }
});

