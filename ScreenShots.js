
ScreenShots = {
    buildElementRect : function(element) {
        
        //if shot.clicky, do the clicky via page? is page accessible here?
        /*
         * maybe if page is not accessible in the, yaknow, page, do in top phantom:
         * do the clicky in phantom maybe {url: actions : {click: "click instructions", selectors : [{}]};
         */
        
        offset = element.offset();
        t = offset.top;
        l = offset.left;
        w = element.outerWidth(true);
        h = element.outerHeight(true);

        return {top: t, left: l, width: w, height: h};
    }, 
    
    buildRectsArray : function(shots) {
        rects = [];
        
        if(shots != null) {
            shots.forEach(function(shot, index, shots) {
                elements = jQuery(shot.selector);
                if(elements.length != 0) {
                    elements.each(function() {
                        element = jQuery(this);
                        rects[rects.length] = {name : shot.name, rect: ScreenShots.buildElementRect(element) };    
                    }); 
                }        
            });                        
        }
        
        ScreenShots.defaultSelectors.forEach(function(shot, index, shots) {
            
            elements = jQuery(shot.selector);  
            fullName = shot.name;
            if(elements.length != 0) {
                elements.each(function() {
                    element = jQuery(this);
                    if(element.attr('id')) {
                        fullName = shot.name  + '-' + element.attr('id');
                    } else {
                        fullName = shot.name  + '-' + index;
                    }
                    rects[rects.length] = {name : fullName, rect: ScreenShots.buildElementRect(element) };    
                }); 
            } 
            
        });
        
        
        return rects;
    },
    
    //never got this working
    buildClickPointSequence : function () {
        sequenceName = 'itemDetails'; //eventually build this from a hashId on the URL
        sequence = ScreenShots.clickSequences[sequenceName];
        clickPoints = [];
        sequence.forEach(function(click) {
            element = jQuery(click.selector);
            if(element.length == 1) {
                rect = ScreenShots.buildElementRect(element);
                //adjust the click location. usually to middle of rect
                xMid = (rect.left + rect.left + rect.width) / 2;
                yMid = (rect.top + rect.top + rect.height) / 2;
                clickPoints[clickPoints.length] = {"mouseY": yMid, "mouseX": xMid};                
            }
        });
        return clickPoints;
    },
       
    buildRectsForCurrentUrl : function() {
        urlShots = ScreenShots.urlShots[document.URL.replace(ScreenShots.baseUrl, '')];   
        rects = ScreenShots.buildRectsArray(urlShots);
        return rects;
    },
    
    baseUrl : "http://localhost/Omeka/",
    //never got this working. think I need to build a delay. see 'waitfor.js' example in phantomjs
    clickSequences : {'itemDetails' : [{selector: ".details-link:first" } ] },
    
    defaultSelectors : [
                        {selector : "#save", name : "save_panel"}, 
                        {selector : ".seven", name : "main"},
                        {selector : "#content", name: "content" },
                        {selector: "#section-nav", name: "tabs"},
                        {selector: "h1:first", name: "title"},
                        {selector: ".inputs five columns omega", name: "field"}
                        
                       ],
    
    //for selectors in addition to the defaults, list them out here
    urlShots : { "admin/items/browse" :[{selector: ".details-link:first", name:"item-details"}],
                 "admin/settings/edit-search" : [
                    {selector : ".five:first", name : "searchmain" }                                                                            
                   ],                                   
                 "admin/index" : [
                              {selector: ".panel:first", name: 'items'},
                              {selector: ".panel:eq(1)", name: 'collections'}
                              ]
                 
    }
};

