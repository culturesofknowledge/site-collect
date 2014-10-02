


/* FILTER PERSON */


$('body').on('change', '.PersonPrimary', function() {

	
	
	var personId = $('#PersonPrimary').select2('data').id;
	
	
	
	
	url = urlActivitySelect + "subject=" +  $('#PersonPrimary').select2('data').id;
	var div_data = "";
	
	
	
	$.getJSON(urlActivitySelect,function(data)
			{
			$.each(data, function(i,data)
			{
				
				
				if (personId != '') {
					$.each(data.role_in_activity, function(i, v) {
				    	if ((v.entity_type == 'Person') && (v.entity_id == personId)) {
				     
				        div_data += divData(data);
				    	}
					});
				
				} else {
					div_data += divData(data);	
				}
				
			$(".accordion-navigation").remove();
			$(div_data).appendTo("#accordian");
			});
			}
			);
			return false;
	

});



function divData(data){
	
	var activity_type_id = 	 data.activity_type_id;
	var activity_name = data.activity_name;
	var activity_description = data.activity_description;
	var date_from_year = (data.date_from_year != 0)? data.date_from_year : "";
	var date_from_month = (data.date_from_month != 0)? data.date_from_month : "";
	var date_from_day = (data.date_from_day != 0)? data.date_from_day : "";
	
	var date_to_year = (data.date_to_year != 0)? data.date_to_year : "";
	var date_to_month = (data.date_to_month != 0)? data.date_to_month : "";
	var date_to_day = (data.date_to_day != 0)? data.date_to_day : "";
	
	
	
var div_data =

'	<dd class="accordion-navigation">' +
' <a href="#panel' +data.id +'"><b>' +data.text +'</b>       last updated:'+ data.timestamp +'</a>' +
' <div id="panel' +data.id +'" class="content">' +
'<fieldset class="">' +
'<legend>Activity</legend>' +

'<ul class="small-block-grid-4">' +
	'<li><label>Activity Type</label>'+ activity_type_id +' </li>' +
	'<li><label>Activity Name</label>'+ activity_name +'</li>' +
	'<li><label>Activity Description</label>'+ activity_description +'</li>' +
	'<li/>' +
'</ul>' +
'</fieldset>' ;


div_data +=
'<fieldset class="fieldsetRole">' +
'	<legend>Roles</legend>' +
'	<div class="divRole" >';


$.each(data.role_in_activity, function(i,d){

div_data +=
			'<ul class="small-block-grid-3">' +
				'<li>' +
				'<label>Entity Type</label>' + d.entity_type + 
				'</li><li>' +
				'<label>Entity Id</label>' + d.entity_id +
				' </li>' +
				' <li><label>Role</label>' + d.role_id +
				
				'</li>' +
				'</ul>';
	});
	
	
	
div_data += '</div></fieldset>' ;

div_data +=
'<fieldset class="fieldsetRelationship">' +
'	<legend>Relationships</legend>' +
'	<div class="divRelationship" >';



$.each(data.relationship, function(i,d){

div_data +=
	'<ul class="small-block-grid-3">' +
		'<li>' +
		'<label>Relationship Type</label>' + d.relationship_id + 
		'</li><li>' +
		'<label>Entity Type</label>' + d.object_type +
		' </li>' +
		' <li><label>Entity</label>' + d.object_id +
		
		'</li>' +
		'</ul>';
});

div_data += '</div></fieldset>' ;



div_data +=		'<fieldset>' +
'		<legend>Time</legend>' +
'		<label>Date type</label>  <br />' +
'		<br />' +
'		<ul class="small-block-grid-4">' +

'				<li><label for="date_from_year">Year From</label>'+date_from_year+' </li>' +
'				<li><label for="date_from_month">Month From</label>'+date_from_month+' </li>' +
'				<li><label for="date_from_day">Day From</label>'+ date_from_day +' </li>' +
'				<li><label for="date_from_uncertainty">Uncertainty</label>'+data.date_from_uncertainty+' </li>' +
'				<li><label for="date_to_year">Year To</label> '+date_to_year+'</li>' +
'				<li><label for="date_to_month">Month To</label>'+date_to_month+'</li>' +
'				<li><label for="date_to_day">Day To</label>'+date_to_day +' </li>' +
'				<li><label for="date_to_uncertainty">Uncertainty</label> '+data.date_to_uncertainty +'</li>' +
'			</ul>' +
'		</fieldset>' +

'		<fieldset>' +
'			<legend>Location</legend>';


$.each(data.location, function(i,d){

div_data +=	
'<ul class="small-block-grid-1">' +
'				<li><label for="location">' + d.location_id +'</label> </li>' +
		
'			</ul>' ;

});


div_data += '	</fieldset>' +

'		<fieldset>' +
'			<legend>Source</legend>';


$.each(data.assertion, function(i,d){

div_data +=	
'	<ul class="small-block-grid-4">' +
'				<li><label for="source_id_1">Textual Source</label>' +  d.source_id + '</li>' +
'				<li><label for="source_details">Source Details</label>' + d.source_description +  '</li>' +

'				<li><br/>' +
'				</li>' +
'			</ul>';

});



div_data += '	</fieldset>' +
'		<fieldset>' +
'			<legend>Notes</legend>' +

'			<ul class="small-block-grid-4">' +
'				<li><label for="notes_used">Whose notes did you use?</label> '+data.notes_used+'</li>' +
'				<li><label for="additional_notes">Additional Notes</label>'+data.additional_notes+'</li>' +

'				<li></li>' +

'				<li></li>' +
'			</ul>' +
'</fieldset>' 
'</div>' +
'</dd>';

return div_data;
	
}



$(document).ready(function() { 
	 
	
	 addSelect2Person($(".PersonPrimary"), "Select a person", urlPerson, "jsonp");
	 
	 // populate Activity field with list of activities from activityGroup.json file 
   
	 
	 $.getJSON("data/activityGroup.json", function(json) {            	 
    	 $(".Activity").select2({ data:json })
     });
	
 
	$.getJSON(urlActivitySelect,function(data)
			{
			$.each(data, function(i,data)
			{
				
				
				var activity_type_id = 	 data.activity_type_id;
				var activity_name = data.activity_name;
				var activity_description = data.activity_description;
				var date_from_year = (data.date_from_year != 0)? data.date_from_year : "";
				var date_from_month = (data.date_from_month != 0)? data.date_from_month : "";
				var date_from_day = (data.date_from_day != 0)? data.date_from_day : "";
				
				var date_to_year = (data.date_to_year != 0)? data.date_to_year : "";
				var date_to_month = (data.date_to_month != 0)? data.date_to_month : "";
				var date_to_day = (data.date_to_day != 0)? data.date_to_day : "";
				
				
				
			
		var row =
			
			'<tr>' +
			'<td><img src="img/view.png" data-reveal-id="myModal" title="Click here to view record in modal window" onClick="showRecord(' + data.id + ')"/></td>' +
			
			'<td>' +  activity_type_id   + '</td>' +
			'<td>' +   activity_name  + '</td>' +
			'<td>' +  activity_description   + '</td>' +
			'<td>' +  date_from_day + '-' +  date_from_month + '-' + date_from_year + '</td>' +
			'<td>' +  date_to_day + '-' +  date_to_month + '-' + date_to_year + '</td>' +
			'<td>' +  data.timestamp + '</td>'	+
			'</tr>';
			

		

			$(row).appendTo("#summaryTable");
			});
			});
			
			return false;
			});
   
   
 
$('body').on('click', '.activityForm', function() {   

	 window.location.replace('index.html');

	
});	
	

$('body').on('click', '.resetForm', function() {   

	 location.reload();

	
});




function htmlRoles(data){
	
	/*  ROLES */
	
	var role="";

	$.each(data.role_in_activity, function(i,d){
		
		role +=
					'<fieldset class="fieldsetRole"><legend>Role</legend><ul class="small-block-grid-3">' +
						'<li>' +
						'<label>Label</label><span class="' + d.entity_type + 'label' +  d.entity_id  +'"/>'  +
						
						'</li><li>' +
					
						
						'<label>Type</label>' + d.entity_type + 
						' </li>' +
						' <li><label>Role</label>' + d.role_id +
						
						'</li>' +
						'</ul>';
		
		
		role += htmlRelations(data, d.entity_id, d.role_id);	
		role += '</fieldset>';
		
			});
			

	html =
		'<fieldset class="fieldsetRole">' +
		'	<legend>Roles and Relationship</legend>' +
		'	<div class="divRole" >' + 
		role + 
		'</div></fieldset>' ;
	
	
	
	
	
	return html;
}




function htmlRelations(data, personid, roleid){
	
	var rels = "";
	/* RELATONSHIPS */
	$.each(data.relationship, function(i,d){
		
		
		/*
		 * if the subject type is a person or organisation there will only be an identifier in the db - need html to replace id with text value
		 */
		if ((personid == d.subject_id ) && ((d.subject_type == 'Person') || (d.subject_type == 'Organisation')) && (d.subject_role_id == roleid) ){
		
		
		rels +=
			'<ul class="small-block-grid-4">' +
				'<li>' +
				'<label>Relationship Type</label>' + d.relationship_id + 
				'</li>' +
				
				
				' <li><label>Label</label><span class="' + d.object_type + 'label'+  d.object_id  +'"/>'  +
				
				'</li>' +
				'<li><label>Type</label>' + d.object_type +
				' </li>' +
' <li><label>Id</label>' + d.object_id +
				
				'</li>' +
				'</ul>';
		
		}
		
		
		
		
		
		
		
		
		
	});
	
	
	if (rels != ''){
	
	html =
		'<fieldset class="fieldsetRole">' +
		'	<legend>Relationships</legend>' +
		'	<div class="divRole" >' +
		rels +
	    '</div></fieldset>' ;
	} else {
		
		html = "";
	}
	return html;
}


/* TIME */
function htmlTime(data){
	
	var date_type = (data.date_type != 0)? data.date_type : "";
	
	var date_from_year = (data.date_from_year != 0)? data.date_from_year : "";
	var date_from_month = (data.date_from_month != 0)? data.date_from_month : "";
	var date_from_day = (data.date_from_day != 0)? data.date_from_day : "";
	
	var date_to_year = (data.date_to_year != 0)? data.date_to_year : "";
	var date_to_month = (data.date_to_month != 0)? data.date_to_month : "";
	var date_to_day = (data.date_to_day != 0)? data.date_to_day : "";
	
	
	
	html =		'<fieldset>' +
	'		<legend>Time</legend>' +
	'		<label>Date type</label> '+date_type+' <br />' +
	'		<br />' +
	'		<ul class="small-block-grid-4">' +

'				<li><label for="date_from_year">Year From</label>'+date_from_year+' </li>' +
'				<li><label for="date_from_month">Month From</label>'+date_from_month+' </li>' +
'				<li><label for="date_from_day">Day From</label>'+ date_from_day +' </li>' +
'				<li><label for="date_from_uncertainty">Uncertainty</label>'+data.date_from_uncertainty+' </li>' +
'				<li><label for="date_to_year">Year To</label> '+date_to_year+'</li>' +
'				<li><label for="date_to_month">Month To</label>'+date_to_month+'</li>' +
'				<li><label for="date_to_day">Day To</label>'+date_to_day +' </li>' +
'				<li><label for="date_to_uncertainty">Uncertainty</label> '+data.date_to_uncertainty +'</li>' +
'			</ul>' +
'		</fieldset>';


	
	return html;
}



function htmlLocation(data){
	
	html = '		<fieldset>' +
	'			<legend>Location</legend>';

	$.each(data.location, function(i,d){
		
		html +=	
		   '<ul class="small-block-grid-2">' +
		   '				<li><label for="location">Location</label><span class="LocationLabel' + d.location_id +'"/> </li>' +
		   '				<li><br />' +
		   '				</li>' +
		   '			</ul>' ;
		
		
	});



	html += '	</fieldset>';

	return html;
}






function htmlSource(data){
	
var html =	'		<fieldset>' +
	'			<legend>Source</legend>';
	
	
$.each(data.assertion, function(i,d){
	
	html +=	
	'	<ul class="small-block-grid-2">' +
	'				<li><label for="source_id_1">Textual Source</label><span class="TextualSourceLabel' +  d.source_id + '"/></li>' +
	'				<li><label for="source_details">Source Details</label>' + d.source_description +  '</li>' +
	'				<li><br/>' +
	'				</li>' +
	'			</ul>' 	;
			
});


html += '	</fieldset>' ;

return html;

}

function htmlNotes(data){
	
	html = 
		'		<fieldset>' +
		'			<legend>Notes</legend>' +

		'			<ul class="small-block-grid-4">' +
		'				<li><label for="notes_used">Whose notes did you use?</label> '+data.notes_used+'</li>' +
		'				<li><label for="additional_notes">Additional Notes</label>'+data.additional_notes+'</li>' +

		'				<li></li>' +

		'				<li></li>' +
		'			</ul>' +
		'</fieldset>' ;
	
	return html;
}



function editRecord(activityId) {
	
	window.location.replace('edit.html?id=' + activityId);
	
	
}



/*
 * 
 * show an individual record
 * 
 */



function showRecord(activityId){
	
	
	var url = urlActivitySelect + "?id=" + activityId;
	
	$.getJSON(url,function(data){
			
		
		$.each(data, function(i,data) {
			
			if (data.id == activityId) {
	            // found it...
	           
	            
	            var activity_type_id = 	 data.activity_type_id;
				var activity_name = data.activity_name;
				var activity_description = data.activity_description;
				
				
				
				
			var html =

			' <div id="panel' +data.id +'" class="content">' +
			'<span class="edit button tiny" onClick="editRecord(' + data.id + ')" title="Edit this record"> Edit </span> <span title="Delete this record" class="edit button tiny"> Delete </span>' +
			
			'<fieldset class="">' +
			'<legend>Activity</legend>' +
			'<ul class="small-block-grid-4">' +
				'<li><label>Activity Type</label>'+ activity_type_id +' </li>' +
				'<li><label>Activity Name</label>'+ activity_name +'</li>' +
				'<li><label>Activity Description</label>'+ activity_description +'</li>' +
				'<li/>' +
			'</ul>' +
		'</fieldset>'  ;
		
			html += htmlRoles(data);	
			
			html += htmlTime(data);
			html += htmlLocation(data);
			html += htmlSource(data);
			html += htmlNotes(data);
			html += '</div>';
	
			
			/*
			 * populate entity labels for people
			 * 
			 */

			 $.getJSON(urlPersonAll,function(personAll)
								{
								$.each(personAll, function(i,person)
										{
											var className = ".Personlabel" + person.emloid;

											if ($(className)[0])
												{

													jQuery(className).each(function() {
														$(this).text(person.name + person.date);
													});
												}
										});
								
								});
			
			
			 /*
				 * populate entity labels for location
				 * 
				 */

				 $.getJSON(urlPlaceAll,function(placeAll)
									{
									$.each(placeAll, function(i,place)

											{
												var className = ".LocationLabel" + place.emloid;

												if ($(className)[0])
													{

														jQuery(className).each(function() {
															$(this).text(place.label);
														});
													}
											});
									
									});
				 
				 // populate entity labels for organisations
				 
				 $.getJSON(urlOrganisation,function(organisationAll)
							{
							$.each(organisationAll, function(i,organisation)

									{
										var className = ".OrganisationLabel" + organisation.emloid;

										if ($(className)[0])
											{

												jQuery(className).each(function() {
													$(this).text(organisation.label);
												});
											}
									});
							
							});
				 
				 
			
 // populate labels for textual sources
				 
				 $.getJSON(urlTextualSource,function(sourceAll)
							{
							$.each(sourceAll, function(i,source)

									{
										var className = ".TextualSourceLabel" + source.emloid;

										if ($(className)[0])
											{

												jQuery(className).each(function() {
													$(this).text(source.label);
												});
											}
									});
							
							});
				 
				 
			
			$("#myModalContent").html(html);
	            
	            
	            
	            
	            
	            
	            
	            return false; // stops the loop
	        }
		});
	
	
	   
});
	
	
	
	
};