










// source http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

         
         
         /*
         ACTION TO TAKE WHEN ACTIVITY IS SELECTED
         */
         
         function changeActivity(obj){    	 
    
        	 var selectedValue = $(obj).val();    

        	 // reset html for role
        	 $(".fieldsetRole").html('<legend>Roles and Relationships</legend><div class="divRole"/>'); 
      		 $(".divRole").html(divRoleHTML); // set HTML of element with id divRole to divRoleHTML
      			
      		// insert role list dependent on activity selected
      		updateRole(selectedValue, ".Role");
        	 
         }
         
         
         /* UPDATE THE ROLE LIST BASED ON SELECTED ACTIVITY TYPE  */
         
         function updateRole(selectedValue, selector){
        	 
        	// read activityRole.json file containing association between activity type and roles
         	$.getJSON("data/activityRole.json", function(json) {  
         		
         		// by default load all the file into the role selection fields
         		$(".Role").select2({ data: json });
         		
         		var items = [];
         		
         		// iterate through json file 
         		$.each(json, function(i, v) {
         			
         			// if the identifier of an activity type in the json file matches the selected value
         			// populate the role selection fields with the element and its child roles
         			 if (v.id == selectedValue) {      
         				 
         				 	$(selector).select2({ data:  [ v ] });
         			        return;
         			    } 
         			});
  
              });
        	 
        	 
         }
         
         
         
      
         	
       
       
     	// select2 where query parameter is appended to the url e.g. /person/query
       function addSelect2(obj, placeholder, purl, pid, ptext, pdatatype, initLabel ){
       	
       	  $(obj).select2(
         			 {
                  	    placeholder: placeholder,
                  	    minimumInputLength: 0,
                  	    ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
                  	        url: function (term) {
                  	            return  purl.concat(term)     
                  	        } ,
                  	        dataType: pdatatype,
                  	        data : function (term) {
                  	            return {
                  	                term: term
                  	            }; },
                  	       results: function (data) {
                  	    	   
                  	       var results = [];
                  	          $.each(data, function(index, item){
                  	            results.push({
                  	              id: eval(pid),
                  	              text: eval(ptext) 
                  	            });
                  	          });
                  	          return {
                  	              results: results
                  	          };  
                  	       }},
                  	       
                  	       
                  	       
                  	    	   	initSelection : function (element, callback) {
                  	    	   		var data = {id: element.val(), text: initLabel};
                  	    	   		callback(data);
                  	    	   			
                  	       		}
         			 });
       }
       
       
        	 
       /*  select2 with restricted search using a query parameter q */
       function addSelect2Param(obj, placeholder, purl, pid, ptext, pdatatype ){
          	
        	  $(obj).select2(
          			 {
                   	    placeholder: placeholder,
                   	    minimumInputLength: 0,
                   	    ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
                   	        url: purl ,
                   	        dataType: pdatatype,
                   	        data : function (term) {
                   	            return {
                   	                q:term
                   	            }; },
                   	        
                   	            
    
                   	       results: function (data) {
                   	    	   
                   	       var results = [];
                   	          $.each(data, function(index, item){
                   	            results.push({
                   	              id: eval(pid),
                   	              text: eval(ptext) 
                   	            });                 	            
                   	            
                   	          });
                   	          return {
                   	              results: results
                   	          };  
                   	       }}}
        	  );
        	
        	
        }
       
       
       /* select2   */
       function addSelect2Person(obj, placeholder, purl, pdatatype ){
          	
        	  $(obj).select2(
          			 {
                   	    placeholder: placeholder,
                   	    minimumInputLength: 1,
                   	    ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
                   	        url: function (term) {
                   	            return  purl.concat(term)     
                   	        } ,
                   	        dataType: pdatatype,
                   	        data : function (term) {
                   	            return {
                   	                term: term
                   	            }; },
                   	       results: function (data) {
                   	    	   
                   	       var results = [];
                   	          $.each(data, function(index, item){
                   	            results.push({
                   	              id: eval("item.emloid"),
                   	              text: eval("item.name") + " " +  eval("item.date") 
                   	            });
                   	          });
                   	          return {
                   	              results: results
                   	          };  
                   	       }}
          			 
          			 
          			 });
        	
        	
        }