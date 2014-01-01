LinkScroller - quick and dirty component that allows for seamless scrolling animation from selected links to indicated DOM element. REQUIRES [history.js](https://github.com/browserstate/history.js/) to work. Remembers browser history via HTML5 pop/pushstate API.

Example available [here](http://fewd.us/).

Usage example:

HTML:
``` HTML
 <ul id='nav' class="nav navbar-nav">
          <li class="active"><a data-anchor="home" href="#">Home</a></li>
          <li ><a data-anchor="tools" href="#">Tools</a></li>
          <li ><a data-anchor="apis" href="#">APIs</a></li>
          <li ><a data-anchor="links" href="#">Links</a></li>
  </ul>
```
Javscript:
```javascript
// init the linkscroll component
var linkscrollConfig = {};
$( '#nav' ).linkscroll(    linkscrollConfig    );
```

OPTIONS:

```javascript
// the selector to look for in self.element
// in our example, it will look for all the 
// anchor tags in $( '#nav' ) by default
linkSelector    :    'a'    
// react only when this (these) event(s) occur
// in our example, it will only animate scrolling 
// on click
linkEvent     :    'click'     
// grab the key from this data-attr
// by default, it will look at data-anchor
// for the IDs of the DOM elements it scrolls to
linkDataAttr  :    'data-anchor'     
 // fired right before animation starts
 // by default, nothing happends
onBeforeAnim  :    -1    
 // fired right after animation states
 // by default, nothing happens
onAfterAnim   :    -1      
```
  
     
