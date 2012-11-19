//dig up the cookie data from looking around your browser settings
//if you had access to my localhost, this would let you log in as me, so
//don't make this info public!
 
var omekaCookie = {"name": "ec0c969eacaba64e72dcc1c60c0dbaaf" ,
                    "value": "ude78cf6t9hmbmj6vf0n3qfck5",
                    "domain": "localhost"
};


if(phantom.addCookie(omekaCookie)) {
    console.log('added Cookie');
} else {
    console.log('failed adding cookie');
}

var page = require('webpage').create();
page.viewportSize = { width: 1000, height: 800 };

var Omeka = {    
    shoot : function(urlData) {
        url = Omeka.baseUrl + urlData.url;

        console.log(url);

	/*
	 * Open the page and take the screenshots
	 */
        page.open(url, function (status) {     
            if (status !== 'success') {
                console.log('Unable to load the address!');
                phantom.exit();
            } else {
	      // the code to grab the clip information for the elements needs to live in the page itself
                page.injectJs('ScreenShots.js');
                urlData = Omeka.urls[Omeka.currentUrlIndex];
                
		//never got clicks working
                if(urlData.clicks) {
                    clickName = '-' + urlData.clicks;
                    console.log(clickName);
                    Omeka.clicks(); 
                } else {
                    clickName = '';
                }
                
                /*
		 * ScreenShots.buildRectsForCurrentUrl() builds an array of data for the clipRect
		 */
		
                rects = page.evaluate(function() {
                    return ScreenShots.buildRectsForCurrentUrl();
                });
		
                rects.forEach(function(rectData) {
                    if(rectData.rect !== false) {
                        page.clipRect = rectData.rect;        
                        file = 'shots/' + url.replace(Omeka.baseUrl, '') + '/' + rectData.name + clickName + '.png';
                        console.log("Rendering to: " + file);
                        page.render(file);                        
                    }                    
                });
                Omeka.nextUrl();            
            };
        });           
    },
    
    //never got this working
    clicks : function() {
        clickPoints = page.evaluate(function() {            
            return ScreenShots.buildClickPointSequence();
        });    
        console.log(JSON.stringify(clickPoints));
        clickPoints.forEach(function(clickPoint) {
            page.sendEvent('click', clickPoint.mouseX, clickPoint.mouseY);
            console.log(JSON.stringify(clickPoint.mouseX));
        });
    }
};


Omeka.baseUrl = "http://localhost/Omeka/";

//list of urls to load. If selecting anything other than the default elements, there will be 
//a corresponding entry in ScreenShots

Omeka.urls = [
              
          {url: "admin/index"},    
          {url: "admin/items/browse"},              
          {url: "admin/items/edit/84"},               
          {url: "admin/element-sets/edit/1"},
          {url: "admin/settings/edit-search"},
          {url: "admin/settings/edit-security"},
          {url: "admin/settings/edit-settings"},
          {url: "admin/appearance/edit-navigation"},
          {url: "admin/appearance/edit-settings"},
          {url: "admin/themes/config?name=default"},
          {url: "admin/themes/browse"},            
          {url: "admin/tags/browse"},
          {url: "admin/plugins/browse"},
          {url: "admin/users/browse"},
          {url: "admin/users/add"},
          {url: "admin/element-sets"},
          {url: "admin/element-sets/edit/1"},
          {url: "admin/item-types"},
          {url: "admin/item-types/edit/1"},
          {url: "admin/item-types/add"}
 
          ];

Omeka.currentUrlIndex = -1;

/*
 * Passing the array of urls directly to page fails because processing each page needs to end before moving
 * to the next one, but phantom.page ends up being asynchronous
 */

Omeka.nextUrl = function() {
    Omeka.currentUrlIndex++ ;
    if(Omeka.currentUrlIndex == Omeka.urls.length ) {
        phantom.exit();
        console.log('exiting');
        return false;
    }
    Omeka.shoot(Omeka.urls[Omeka.currentUrlIndex]);
        
};

Omeka.nextUrl();