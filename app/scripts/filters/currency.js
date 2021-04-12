angular.module('homer').filter('customCurrency', function ($filter) {       
    return function(amount, currencySymbol){
       var currency = $filter('currency');         
  
       if(amount.charAt(0) === "-"){
          return currency(amount, currencySymbol)
            .replace("(", "-")
            .replace(")", ""); 
       }
  
       return currency(amount, currencySymbol);
    };
  });