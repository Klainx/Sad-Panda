//
chrome.runtime.onInstalled.addListener(function(){
  chrome.tabs.query({url: "https://exhentai.org/*"}, function(tab) {
    if ( typeof tab[0].url != 'undefined' && tab[0].url.indexOf('https://exhentai.org/') == 0 ) {
      chrome.tabs.reload(tab[0].id);
    }
  });
});

//
function unixTime() {
	return Math.round((new Date()).getTime() / 1000)
}

function cookieExpireTime() {
	return unixTime() + 172800
}

//
function setHentaiCookies() {
	try {
		chrome.cookies.getAll({ domain: '.e-hentai.org' }, function (got) {
			for (var i = 0; i < got.length; i++) {
				if (got[i].name.indexOf('ipb_') != -1 || got[i].name.indexOf('uconfig') != -1) {
					chrome.cookies.set({
						url: 'https://exhentai.org/',
						domain: '.exhentai.org', path: '/',
						name: got[i].name,
						value: got[i].value,
						expirationDate: cookieExpireTime(),
					})
				}
			}
		})

		return true
	} catch (e) {
		return false
	}
}

//
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request == 'reload') {
		chrome.tabs.getSelected(null, function (tab) {
			chrome.tabs.reload(tab.id)
		})
	} else if (request == 'cookieDataSet') {
		sendResponse((setHentaiCookies() ? 'ok' : 'Unable to set cookies'))
	} else if (request == 'deleteAllCookies') {
		var urlEx = 'https://exhentai.org/'
		var urlEh = 'http://e-hentai.org/'
		chrome.cookies.remove({ name: 'yay', url: urlEx }, function () { })
		chrome.cookies.remove({ name: 'ipb_anonlogin', url: urlEx }, function () { })
		chrome.cookies.remove({ name: 'ipb_member_id', url: urlEx }, function () { })
		chrome.cookies.remove({ name: 'ipb_pass_hash', url: urlEx }, function () { })
		chrome.cookies.remove({ name: 'ipb_session_id', url: urlEx }, function () { })
		chrome.cookies.remove({ name: 'ipb_anonlogin', url: urlEh }, function () { })
		chrome.cookies.remove({ name: 'ipb_member_id', url: urlEh }, function () { })
		chrome.cookies.remove({ name: 'ipb_pass_hash', url: urlEh }, function () { })
		chrome.cookies.remove({ name: 'ipb_session_id', url: urlEh }, function () { })
		sendResponse()
	}
})