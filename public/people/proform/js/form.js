

/*
 * 
 * function addRelationship
 * 
 */


function addRelationship(obj){ 
	     
	 $(".SelectFilter").select2("destroy");
	 $(".Place").select2("destroy");
	 $(".Person").select2("destroy");
	 
	 
	 
	   $(obj).parent().parent().parent()
	   		.append(
	    // clone the row and insert it in the DOM
	    		$(obj).parent().parent().first().clone() 
	              
	        );
	    
	  $(".SelectFilter").select2();
	  $(".Person").select2();
	  $(".Place").select2();
	  
	  
	  
	  
	  
	   return false;
	}


/*
 * function removeRelationship
 * 
 * 
 */

function removeRelationship(obj){
	   
	    // do not delete relationship if there is only one relationship
	    if ($(obj).parent().parent().parent().children().length > 1){
	    	$(obj).parent().parent().remove();  // remove relationship assertions 
	    }
}
































/*
 * 
 * function addEvent
 * 
 */

function addEvent(obj){ 
	 
	$("select.SelectFilter").select2("destroy");
	$("select.Person").select2("destroy");

	$(obj).parent().parent()
			.append(
	// clone the row and insert it in the DOM
			$(obj).parent().last().clone() 
	          
	    );


	$("select.SelectFilter").select2();
	$("select.Person").select2();
	return false;
	}



/*
 * function removeEvent
 * 
 * 
 */

function removeEvent(obj){
	   
	// do not delete relationship if there is only one relationship
    if ($(obj).parent().parent().children().length > 1){
    		$(obj).parent().remove();  // remove relationship assertions 
    }
}



function showContext(context){
	
	
// hide all fieldset elements
	$("fieldset").css("display","none");
	
// display selected fieldset element using id	
	$(context).css("display","inline");
	
}








function addSection(obj, par){ 
	
	
   var currentCount =  $(par).length; // number of sections
   var val1 = "_" + currentCount; // value to replace in input id
   var val2 = "_" + (Number(currentCount) + 1) ; // replacement value in input id
    
  //  var lastRepeatingGroup = $(sectionclass).last(); // get last section in this group
 //   var newSection = lastRepeatingGroup.clone(); // copy last section
    
    /*
    $('.repeatSectionBirth')
    	.children(".selectFilter")
    	 .select2("destroy")
         .end();
    */
    $(par).append(
                // clone the row and insert it in the DOM
                $(par).last().clone() 
              
        );
    
   
         
    
 //   newSection.insertAfter(lastRepeatingGroup); // insert copy after last section
    
    
    /*
    
    var appendOrReplace = (currentCount == 1) ? "append" : "replace"; // decide whether to append value to input id or replace id
    
    // iterate through each input field
    newSection.find("input").each(function (index, input) {
        updateInput(input, appendOrReplace, val1, val2); // update id of input and set value to empty string
    });
    
 // iterate through each select field
    newSection.find("select").each(function (index, input) {
        updateInput(input, appendOrReplace, val1, val2); // update id of input and set value to empty string
    });
    
    // iterate through each textarea field
    newSection.find("textarea").each(function (index, input) { 
        updateInput(input, appendOrReplace, val1, val2); // update id of input and set value to empty string
    });
    
    // update each label
    newSection.find("label").each(function (index, label) {
        var l = $(label);
        
         if (appendOrReplace == "append"){ 
            l.attr('for', l.attr('for').concat("_2"));
       } else {
            l.attr('for', l.attr('for').replace(val1, val2));
       }   
    });
    */
    
    
    return false;    
}


function updateInput(input, appendOrReplace, val1, val2){
    // update id of input 

       if (appendOrReplace == "append"){
            input.id = input.id.concat("_2");  
             input.name = input.name.concat("_2");
       } else {
            input.id = input.id.replace(val1, val2);
            input.name = input.name.replace(val1, val2);
       }
       

 // add autocomplete function to relationship field 
 
 
       if ((sectionclass = 'repeatSectionFamilyRelationships') && (input.id.search('FamilyRelationships-FamilyRole') != -1 )){     
            $(input).autocomplete({ source: relationships});     
        }
    
       
       
       
       
     $(input).val(""); // set value to empty string
     
     
         
   
   
}



function deleteSection(obj, sectionclass){
    
    var currentCount =  $(sectionclass).length;
    // do not delete section if there is only one section
    if (currentCount == 1){
   
        return false;
    }
    
    // remove fieldset element that contains this section
     $(obj).parent('p').parent('fieldset').remove();
    return false;
}















