 
//  remove messages with form focus
 $('#form1').focusin(function(){
	 $('#response').remove();
	 
 });


 
 

 
 
 
/*
 * submit form
 * 
 */

 // on click of html element with class name .submitForm, validate form values and submit form
 
 $('body').on('click', '.submitForm', function() {   

	 
	 /* check if required field contain a value
	  required fields = person (input name = subject, class name = PersonPrimary) and activity type
	 */
	 
	
	 $countError = 0; // counter to track number of errors
	
	 // if value not set for person display error message
	 if ( $(".PersonPrimary").first().select2('data') == null){ 
		 $(".PersonPrimary").first().parents('.input-wrapper').addClass("error");
		 $countError += 1;
		 
	 }
	// if value not set for activity type display error message
	 if ($(".Activity").first().select2('data') == null) { 
		 $(".Activity").first().parents('.input-wrapper').addClass("error");
		 $countError += 1;
	 }
	 
	 // if any errors exist, do not submit the form
	 if ($countError > 0 ){return;}
	 
	 
	 
	 
	 // otherwise, all okay to submit form
	 
	 
	 // append icon to show that something is happening
     $('#messages').append('<img src = "img/ajax-loader.gif" alt="Currently loading"  id = "loading"/>');
    
     // use ajax to save form content
     $.ajax({

            url: 'formsubmission.php',
            type: 'POST',
            data: $('#form1').serialize(),
            success: function(result){
            	
            	// get name of activity
            	
            	
            	
            	var activityLabel = ($(".Activity").select2('data')) ?  $(".Activity").select2('data').text : "";
            	
            	var message = "The <b>" + activityLabel + "</b> activity has been added.";
            	
                $('#response').remove();
                $('#loading').remove();
               
                $('#messages').append('<p id ="response">' + message + '</p>');
                

                /* reset most of the form fields keeping values for primary person and textual sources
                */
               
                $('#form1').trigger("reset"); // reset form fields
                $(".Activity").select2("val", ""); // reset form fields using select2
                
                /* reset HTML for form sections */
                $("#fieldsetLocation").html(htmlLocation); 
                $("#fieldsetRole").remove();
                $("#fieldsetActivity").after(htmlRoles);
                $("#fieldsetTime").html(htmlTime);
                
                
              // init location field
                
               addSelect2($(".Location"), "Select a location", urlPlace, "item.emloid", "item.label", "jsonp");
                
                // init date fields
               $(".Month").select2({data:arrayMonth});         
               $(".Day").select2({data:arrayDay});
               $(".Uncertainty").select2({data:arrayUncertain});
               },
               
               error: function(result){
            	   $('#response').remove(); // remove messages
            	   $('#loading').remove(); // remove loading image
            	 
            	   $('#messages').append('<p id = "response">' + result + '</p>'); // add error message
               }

         });         

   
 });

 
 /*
  * reset form by reloading page 
  */
 $('body').on('click', '.resetForm', function() {   

	 location.reload();

	
 });
 
 
 /* browse button click go to summary page */
 $('body').on('click', '.Browse', function() {   

	 window.location.replace('summary.html');

	
 });
 

 
             
         
/* ENTITYTYPE CHANGE */
         
         $('body').on('change', '.Object_Type', function() { 
             
   			var selectedValue = ($(this).val());    // selected activity
   			
			var obj = $(this).parents(".divRole").find(".divEntity");
   			
			var countRole = $(this).parents(".divRole").prev(".divRole").length + 1;
			
			var htmlInput = '<input type="text" name="object_' + countRole + '_1" class="Object small-12" />';
			
         	switch (selectedValue){
         	
         	case "Person":
         		
         		$(obj).html('<label>Person</label><input type="hidden" name="object_' + countRole + '_1"  class="Object Person small-12" />');	
         		
         		addSelect2($(this).parents(".divRole").find(".Object"), "Select a person", urlPerson, "item.emloid", "item.name", "jsonp");
         		
         		break;
         		
         	case "Organisation":	
         	// $(obj).html('<label>Organisation</label>' + htmlInput);	
         		
         		$(obj).html('<label>Organisation</label><input type="hidden" name="object_' + countRole + '_1"  class="Object Organisation small-12" />');	
         		
         		addSelect2Param($(this).parents(".divRole").find(".Object"), "Select an organisation", urlOrganisation, "item.emloid", "item.label", "json");
         		
         		break;
         		
         	case "Entity":
         		
         		$(obj).html('<label>Entity</label>' + htmlInput);	
         		
         		break;
         		
         	case "Document":
         		
         		$(obj).html('<label>Document</label>' + htmlInput);	
         		
         		
         		break;
         	
         	default:
         		$(obj).html('<label>Entity</label>' + htmlInput);
         		break;
         	
         	}
         	 
         }) 	;
         
         
         /* CHANGE TO ACTIVITY */
         
         $('body').on('change', '.Activity', function(){ changeActivity(this)});
         
         
         /* CHANGE TO ROLE */
         
         $('body').on('change', '.Role', function() { 
             
   			
   			
 			var obj = $(this);
 			
 			var selectedValue = obj.val();    // selected role text value
 			
 			var countRole = obj.parents(".divRole").first().prev(".divRole").length + 1; // counter to uniquely identify input fields
 			
 			var html =
 				'<p>Describe the relationships that correspond to the person having the selected role in this activity:</p>' +
 				'<ul class="small-block-grid-5">' +
 				'<li>' +
 				'<label>Relationship Type</label>' +
 				'<input type="hidden" name="relationship_1_' + countRole + '" class="Relationship small-12" />' +
 				'</li><li>' +
 				'<label>Entity Type</label>' +
 				'<select name="object_type_1_' + countRole + '" class="small-12 Object_Type" >' +
 				'<option value="">Please Select...</option>' +
 				'<option value="Document">Document</option>' + 
 				'<option value="Organisation">Organisation</option>' +
 				'<option value="Person">Person</option>' +
 				'<option value="Entity">Other entity type not specified</option>' +
 				'</select>' +
 				' </li>' +
 				' <li><div class="divEntity"/></li>' +
 				' <li><div class="divRole2"/></li>' +
 				' <li><br/>' +
 				'<span id="add" class="addRelationship button tiny" >Add</span>' +
 				'</li>' +
 				'</ul>';
 			

         	// read activityRole.json file containing association between activity type and roles
         	$.getJSON("data/roleRelationship.json", function(json2) {  
         		
	
         		var items = [];
         		
         		// iterate through json file 
         		$.each(json2, function(i, v) {
         			
         			// if the identifier of an activity type in the json file matches the selected value
         			// populate the role selection fields with the element and its child roles
         			 if (v.id == selectedValue) {      
         				 
         				 	$(obj).parents(".divRole").find(".divRel").html(html);
         				 	$(obj).parents(".divRole").find(".Relationship").select2({ data:  [ v ] });
         			        return;
         			    } 
         			});
  
              });
         	 
         }) 	;
         
         
         
 /* CHANGE TO RELATIONSHIP */
         
         $('body').on('change', '.Relationship', function() { 
             
   			var selectedValue = ($(this).val());    // selected role
   			
 			var obj = $(this);
 			
 			var countRole = $(this).parents(".divRole").prev(".divRole").length + 1;
 			
 			var html = 
 		    	'<label>Role</label>' +
 				'<input type="hidden" name="object_role_'+ countRole +'_1" class="Object_Role small-12"/>';

         	// read relationshipRole.json file containing association between relationships and roles
         	$.getJSON("data/relationshipRole.json", function(json2) {  
         		
         		
         		
         		var items = [];
         		
         		// iterate through json file 
         		$.each(json2, function(i, v) {
         			
         			// if the identifier of a property exists in file, add select box html and populate the second Role selection box
         			// with the corresponding roles
         			 if (v.id == selectedValue) {      
         				 
         				 	$(obj).parents(".divRole").find(".divRole2").html(html);
         				 	$(obj).parents(".divRole").find(".Object_Role").select2({ data:  [ v ] });
         			        return;
         			    } 
         			});
  
              });
         	 
         }) 	;
         
         
         
         
         
         
         
         
         	/* REMOVE ACTION */
         
         $('body').on('click', '.remove', function() {	
      	    	$(this).parents("ul").first().remove();  
      	   
         });
         
         
         
         
         $('body').on('click', '.removePrimaryPerson', function() {	
        	 
        	 var html = '<ul class="small-block-grid-4">' +
        		 '<li><input type="hidden" name="subject"  id="PersonPrimary" class="Person PersonPrimary small-12" /></li>' +
        		 '</ul>';
        	 
        		 $(this).parents("fieldset").append(html);
        		 addSelect2Person($(".PersonPrimary"), "Select a person", urlPerson, "jsonp");
        		 $(this).parents("ul").first().remove();  
   	    	
   	   
      });
         
         
         	/* REMOVE ROLE */
         $('body').on('click', '.removeRole', function() {	
  	    	$(this).parents("div").first().remove();  
  	   
     });
         
         
         /*
         ADD LOCATION ACTION
         */     	
        $('body').on('click', '.addLocation', function() {   		 
              	$(this).parents("fieldset").first()        			
              	   		.append(function () {
              	    		var id = $(this).find(".Location").first().select2('data').id;	
              	    		var text = $(this).find(".Location").first().select2('data').text;	
              	    		var count = $('.AddedLocation').length + 2
              	    		
              	    		if (id == ''){return "";}
              	    			html = 
              	    			'<ul class="small-block-grid-4 AddedLocation"><li>' +
              	    			'<input type="text" name="location_' + count + '" class="columns small-10" readonly value="' + text + '"/>' +
              	    			'<input type="hidden" name="location_id_' + count + '" value="' + id + '"/></li><li>' +
              	    			'<span class="remove button tiny ">X</span>' +
              	    			'</li></ul>' ;
              	    		return html;
              	   		});
              	        
              	
              	$(this).parents("fieldset").find(".Location").select2('val', ''); ;    
               });
         	         	 
         	 
        

         /*
         ADD RELATIONSHIP ACTION
         */
         
        $('body').on('click', '.addRelationship', function() {  
        	
        	var obj = $(this).parents("ul").first();
        	
        	
        	 $(this).parents("ul").first()
        	 	.append(function () {
        	    		
        	    		var relationship = $(this).find(".Relationship").select2('data').id;
        	    		
        	    		var object_type = $(this).find(".Object_Type").val();
        	    		
        	    		// get input value - dependent on if it is a select2 box or text input field
        	    		
        	    		
        	    		if (obj.find(".Object").select2('data').id != undefined){
        	    			
        	    			var object_id =	obj.find(".Object").select2('data').id; // select2 
        	    			var object_text = obj.find(".Object").select2('data').text;
        	    			
        	    			
        	    		} else {
        	    			
        	    			
        	    			
        	    			var object_id = obj.find(".Object").val(); //  text input field
        	    			var object_text = obj.find(".Object").val();
        	    		}
        	    		
        	    		// get value of object role	
        	    		var object_role = $(this).find(".Object_Role").first().select2('data').id;
        	    		
        	    		// counter to uniquely identify fields
        	    		var countRole = $(this).parents(".divRole").prev(".divRole").length + 1;
        	    		
        	    		
        	    		// counter to uniquely identify fields
        	    		var countRelationship = $(this).parents(".divRole").find(".relationshipCollection").length + 2;
        	    		

        	    		// generate html to append to roles and relationship section
        	    			html = 
        	    			'<ul class="small-block-grid-5 relationshipCollection">' +
        	    			'</li><li><input name="relationship_' + countRole + '_' + countRelationship + '" type="text" class="small-block-grid-5" readonly value="' + relationship + '"/>' +
        	    			'</li><li><input name="object_type_' + countRole + '_' + countRelationship + '" type="text" class="small-block-grid-5" readonly value="' + object_type + '"/>' +
        	    			'</li><li><input name="object_' + countRole + '_' + countRelationship + '" type="hidden" value="' + object_id + '"/><input name="object_text' + countRole + '_' + countRelationship + '" type="text" class="small-block-grid-5" readonly value="' + object_text + '"/>' +
        	    			'</li><li><input name="object_role_' + countRole + '_' + countRelationship + '" type="text" class="small-block-grid-5" readonly value="' + object_role + '"/>' +

        	    			'</li><li>' +
        	    			'<span class="remove button tiny">X</span>' +
        	    			'</li></ul>' ;
        	    		return html;
        	   		});
        	        
        	
      	 $(this).parents("ul").first().find(".Relationship").select2("val", "");
        	 $(this).parents("ul").first().find(".Object_Type").prop('selectedIndex',0);
        	 $(this).parents("ul").first().find(".Object").select2("val", "");
        	 $(this).parents("ul").first().find(".Object").val("");
        	 $(this).parents("ul").first().find(".Object_Role").select2("val", "");
       	 
         });        
          	
         
         /* ADD SOURCE ACTION */
         	 
        $('body').on('click', '.addSource', function() {   		 
           	$(this).parents("fieldset").first()        			
           	   		.append(function () {
           	    		sourceValueId = $(this).find(".TextualSource").first().select2('data').id;	
           	    		sourceValueText = $(this).find(".TextualSource").first().select2('data').text;	
           	    		
           	    		sourceDetailValue = $(this).first().find(".TextualSourceDetail").val();
           	    		
           	    		// counter to uniquely identify fields
           	    		var count = $(".textSourceEntry").length + 2;
           	    		
           	    		
           	    			html = 
           	    			'<ul class="small-block-grid-4 textSourceEntry"><li>' +
           	    			'<input type="text" name="source_text_' + count + '" class="small-block-grid-4" readonly value="' + sourceValueText + '"/>' +
           	    			'</li><li><input type="hidden" name="source_id_' + count + '" class="small-block-grid-4" readonly value="' + sourceValueId + '"/>' +
           	    			
           	    			'<input type="text" name="source_details_' + count + '" class="small-block-grid-4" readonly value="' + sourceDetailValue + '"/>' +
           	    			'</li><li>' +
           	    			'<span class="remove button tiny">X</span>' +
           	    			'</li></ul>' ;
           	    		return html;
           	   		});
           	        
           	
           	$(this).parents("fieldset").first().find("a span").text("") ;   
           	$(this).parents("fieldset").first().find("textarea").val("") ;   
            });          	 
        
          
  
         
         /*
         
         ADD ROLE ACTION
         */
          	 
        $('body').on('click', '.addRole', function() {   	
     	      
        	
        	var count = 1;
        	
        	if ($(".divRole").length) {
        	var count = $(".divRole").length + 1;
        	}
        	
        	var html = 
          		'<div class="divRole"><hr/><ul class="small-block-grid-4">' +           
        		'<li>' +
        		'<label>Role</label>' +
        		'<input type="hidden" name="subject_role_' + count + '" class="Role small-12"/>' +
        		'</li><li><br/>' +
        		'<span id="add" class="removeRole button tiny" >Remove</span>' +
        		'</li></ul><div class="divRel"/></div>';
        	
        	
        	
           	$(this).parents("fieldset").first().append(html);
           	
           
           	
           	updateRole($(".Activity").select2('data').id, ".Role");
           	
            });         
        
        /*
        $('body').on('click', '.submitForm', function() {	
  	    	$(this).parents("form").submit();  
  	   
     });
     */
        
        