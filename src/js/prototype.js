
var qs = (function(a) {
  if (a == "") return {};
  var b = {};
  for (var i = 0; i < a.length; ++i)
  {
      var p=a[i].split('=', 2);
      if (p.length == 1)
          b[p[0]] = "";
      else
          b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
  }
  return b;
})(window.location.search.substr(1).split('&'));


window.addEventListener("load",function() {
  

//
// Below is code to run the search functionality to demonstrate process flow
//

  var searchType = "";

  // create an object from the Button Group component
  var btnGroup = document.getElementById('buttonGroupSearchType');
  btnGroup.value = null;
  
  // Button Group method to reset button to default values
  btnGroup.setButtonsDefault = function(e){
    var btns = btnGroup.getElementsByTagName('button');
    var i,b;
    for (i=0; i < btns.length; i++){
      b = btns[i];
      b.classList.remove('fsa-btn-group__item--active');
      b.setAttribute('aria-selected', false);
    }
  };

  // Button Group method to SET value of group
  btnGroup.setValue = function(v){
    btnGroup.value = v;
  };

  // Button Group method to GET value of group
  btnGroup.getValue = function(){
    return btnGroup.value;
  };

  // Since the handlebars templating engine is not connected to this code, the below
  // will check if button group component is being used before trying to code to its object.

  if(btnGroup){
      
    var btns = btnGroup.getElementsByTagName('button');
  
    var i,b;

    for (i=0; i < btns.length; i++){
      b = btns[i];

      // button click event handler that sets selected button and styles it
      b.addEventListener('click', function(e){

        btnGroup.setButtonsDefault();
        btnGroup.setValue( e.target.dataset.val );
        e.target.classList.add('fsa-btn-group__item--active');
        e.target.setAttribute('aria-selected', true);

      });

    }
  }

  // code used to intercept form submission and grab search type value from component that is used
  document.getElementById('searchForm').addEventListener("submit", function(e) {
    e.preventDefault(); // before the code
    /* do what you want with the form */

    var s = document.getElementById('selectSearchType');
    if( s && s.options[s.selectedIndex].value != "" ){
      searchType = s.options[s.selectedIndex].value;
    } else {
      searchType = btnGroup.getValue();
    }

    window.location = searchType + ".html";
    // Should be triggered on form submit
    
  });

});
