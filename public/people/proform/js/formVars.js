 
code = "remote";


if (code == "local") {
	
	urlActivity = "http://localhost/proform/data/activityGroup.json";
	urlActivitySelect = "http://localhost/proform/query.php/";
} else {
	
	urlActivity = "http://emlo-edit.bodleian.ox.ac.uk/people/proform/data/activityGroup.json";
  	urlActivitySelect = "http://emlo-edit.bodleian.ox.ac.uk/people/proform/query.php/";
	
}


urlPerson = "http://emlo-edit.bodleian.ox.ac.uk:3000/autocomplete/person/";
 urlPlace = "http://emlo-edit.bodleian.ox.ac.uk:3000/autocomplete/place/000000000000000000000000/";   
      	
		
      	
		// header('Access-Control-Allow-Origin: *');
      	
      	
      	arrayRoles = [{id:'Acquaintance',text:'Acquaintance'},{id:'Addressee',text:'Addressee'},{id:'Advertiser',text:'Advertiser'},{id:'Advocate',text:'Advocate'},{id:'Agent',text:'Agent'},{id:'Apprentice',text:'Apprentice'},{id:'Assistant',text:'Assistant'},{id:'Bookseller',text:'Bookseller'},{id:'Chair',text:'Chair'},{id:'Child',text:'Child'},{id:'Client',text:'Client'},{id:'Collaborator',text:'Collaborator'},{id:'Colleague',text:'Colleague'},{id:'Commentator',text:'Commentator'},{id:'Annotator',text:'Annotator'},{id:'CommissioningBody',text:'Commissioning Body'},{id:'Contractee',text:'Contractee'},{id:'Correspondent',text:'Correspondent'},{id:'LetterRecipient',text:'Letter Recipient'},{id:'LetterSender',text:'Letter Sender'},{id:'Counsellor',text:'Counsellor'},{id:'Courtier',text:'Courtier'},{id:'Creator',text:'Creator'},{id:'Artist',text:'Artist'},{id:'Author',text:'Author'},{id:'Glossist',text:'Glossist'},{id:'Librettist',text:'Librettist'},{id:'TuneAuthor',text:'Tune Author'},{id:'Composer',text:'Composer'},{id:'MusicComposer',text:'Music Composer'},{id:'TextComposer',text:'Text Composer'},{id:'Copyist',text:'Copyist'},{id:'Inscriber',text:'Inscriber'},{id:'Photographer',text:'Photographer'},{id:'SceneryDesigner',text:'Scenery Designer'},{id:'Criminal',text:'Criminal'},{id:'Dedicatee',text:'Dedicatee'},{id:'Dedicator',text:'Dedicator'},{id:'DisplacedPerson',text:'DisplacedPerson'},{id:'Disqualified',text:'Disqualified'},{id:'DisqualifiedFromOffice',text:'Disqualified From Office'},{id:'Editor',text:'Editor'},{id:'Emigrant',text:'Emigrant'},{id:'Employee',text:'Employee'},{id:'Employer',text:'Employer'},{id:'Engraver',text:'Engraver'},{id:'ExiledPerson',text:'Exiled Person'},{id:'Factor',text:'Factor'},{id:'Gift',text:'Gift'},{id:'Giver',text:'Giver'},{id:'Contributor',text:'Contributor'},{id:'Donor',text:'Donor'},{id:'Endower',text:'Endower'},{id:'Funder',text:'Funder'},{id:'GiftGiver',text:'Gift Giver'},{id:'Patron',text:'Patron'},{id:'Host',text:'Host'},{id:'Housemate',text:'Housemate'},{id:'Illustrator',text:'Illustrator'},{id:'Immigrant',text:'Immigrant'},{id:'Inhabitant',text:'Inhabitant'},{id:'Instigator',text:'Instigator'},{id:'Intermediary',text:'Intermediary'},{id:'CorrespondenceIntermediary',text:'Correspondence Intermediary'},{id:'Interviewee',text:'Interviewee'},{id:'Interviewer',text:'Interviewer'},{id:'Licenser',text:'Licenser'},{id:'Master',text:'Master'},{id:'Member',text:'Member'},{id:'Merchant',text:'Merchant'},{id:'Owner',text:'Owner'},{id:'Parent',text:'Parent'},{id:'Father',text:'Father'},{id:'Mother',text:'Mother'},{id:'Participant',text:'Participant'},{id:'Attendee',text:'Attendee'},{id:'Saloniste',text:'Saloniste'},{id:'Patient',text:'Patient'},{id:'Performer',text:'Performer'},{id:'Printer',text:'Printer'},{id:'Producer',text:'Producer'},{id:'Publisher',text:'Publisher'},{id:'Recipient',text:'Recipient'},{id:'FundsRecipient',text:'Funds Recipient'},{id:'Endowee',text:'Endowee'},{id:'LetterRecipient',text:'Letter Recipient'},{id:'Refugee',text:'Refugee'},{id:'Researcher',text:'Researcher'},{id:'Reviewer',text:'Reviewer'},{id:'Ruler',text:'Ruler'},{id:'Sender',text:'Sender'},{id:'LetterSender',text:'Letter Sender'},{id:'Signatory',text:'Signatory'},{id:'Steward',text:'Steward'},{id:'Student',text:'Student'},{id:'Supervisor',text:'Supervisor'},{id:'AcademicSupervisor',text:'Academic Supervisor'},{id:'Teacher',text:'Teacher'},{id:'Trader',text:'Trader'},{id:'Buyer',text:'Buyer'},{id:'Seller',text:'Seller'},{id:'Transcriber',text:'Transcriber'},{id:'Translator',text:'Translator'},{id:'Traveller',text:'Traveller'},{id:'TravelCompanion',text:'Travel Companion'},{id:'Victim',text:'Victim'},{id:'Visitor',text:'Visitor'},{id:'Guest',text:'Guest'},{id:'Witness',text:'Witness'}
      	     ];

      	
      	arrayMonth = [
      	              {id: "1", text: "Jan"},
      	              {id: "2", text: "Feb"},
      	          	  {id: "3", text: "Mar"},
      	          	  {id: "4", text: "Apr"},
      	          	  {id: "5", text: "May"},
      	          	  {id: "6", text: "Jun"},
      	          	  {id: "7", text: "Jul"},
      	          	  {id: "8", text: "Aug"},
      	          	  {id: "9", text: "Sep"},
      	          	  {id: "10", text: "Oct"},
      	          	  {id: "11", text: "Nov"},
      	          	  {id: "12", text: "Dec"}
      	              ];
      	
      	arrayDay =	[
      	          	 {id: "1", text: "1"},
      	          	 {id: "2", text: "2"},
      	          	 {id: "3", text: "3"},
      	          	 {id: "4", text: "4"},
      	          	 {id: "5", text: "5"},
      	          	 {id: "6", text: "6"},
      	          	 {id: "7", text: "7"},
      	          	 {id: "8", text: "8"},
      	          	 {id: "9", text: "9"},
      	          	 {id: "10", text: "10"},
      	          	 {id: "11", text: "11"},
      	          	 {id: "12", text: "12"},
      	          	 {id: "13", text: "13"},
      	          	 {id: "14", text: "14"},
      	          	 {id: "15", text: "15"},
      	          	 {id: "16", text: "16"},
      	          	 {id: "17", text: "17"},
      	          	 {id: "18", text: "18"},
      	          	 {id: "19", text: "19"},
      	          	 {id: "20", text: "20"},
      	          	 {id: "21", text: "21"},
      	          	 {id: "22", text: "22"},
      	          	 {id: "23", text: "23"},
      	          	 {id: "24", text: "24"},
      	          	 {id: "25", text: "25"},
      	          	 {id: "26", text: "26"},
      	          	 {id: "27", text: "27"},
      	          	 {id: "28", text: "28"},
      	          	 {id: "29", text: "29"},
      	          	 {id: "30", text: "30"},
      	          	 {id: "31", text: "31"}
         	    	];
      		
      	
      	
      	var htmlRole = 
      		'<div class="divRole"><hr/><ul class="small-block-grid-4">' +           
    		'<li>' +
    		'<label>Role</label>' +
    		'<input type="hidden" name="subject_role_1" class="Role small-12"/>' +
    		'</li><li><br/>' +
    		'<span id="add" class="removeRole button tiny" >Remove</span>' +
    		'</li></ul><div class="divRel"/></div>';
      		
	    var divRole = 
	    	'<label>Role</label>' +
			'<input type="hidden" name="object_role_1" class="Object_Role small-12"/>';
	    
    		
      	var divRoleHTML = 
      		'<ul class="small-block-grid-4">' +           
      		'<li>' + 
      		'<label>Role</label>' +
      		'<input type="hidden" name="subject_role_1" class="Role small-12"/>' + 
			'</li><li><br/>' +
			'<span id="add" class="addRole button tiny" >Add</span>' +
			'</li></ul><div class="divRel"/>';
		
		var divRelationshipHTML =
			'<p>Describe the relationships that correspond to the person having the selected role in this activity:</p>' +
			'<ul class="small-block-grid-5">' +
			'<li>' +
			'<label>Relationship Type</label>' +
			'<input type="hidden" name="relationship_1" class="Relationship small-12" />' +
			'</li><li>' +
			'<label>Entity Type</label>' +
			'<select name="entity_type_1" class="small-12 Object_Type" >' +
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
      	 
      	
      	var arrayUncertain = [{id: "Approximate", text: "Approximate"}, {id: "Uncertain", text: "Uncertain"},{id: "Inferred", text: "Inferred"}  ];
      	
      	
      	
      	var htmlLocation = '<legend>Location</legend>'+
      	'<ul class="small-block-grid-4">'+
      	'<li><label for="location">Location </label>'+
      	' <input type="hidden" name="location_id_1"	class="Location small-12" value="" /><small class="error"></small></li>'+
      	'<li><br /><span class="addLocation button tiny">Add</span>&nbsp;</li><li>If the location does not appear in the selection, you can add a location to the selection using the EMLO Edit <a target="_new" href="https://emlo-edit.bodleian.ox.ac.uk/interface/union.php?menu_item_id=39"> "Add New Place" </a> form.</li></ul>';

      	var htmlRoles = '<fieldset id="fieldsetRole" class="fieldsetRole">' +
      		'<legend>Roles and Relationships</legend> ' +
      		' <div class="divRole" /></fieldset>';

      	var htmlTime = '<legend>Time</legend>' +
      		'<label>Date type</label> <select name="date_type" class="SelectFilter small-2">' +
      		'<option value="">Please select...</option>' +
      		'<option value="Before">Before</option>' +
      		'<option value="After">After</option>' +
      		'<option value="Duration">Duration</option>' +
      		'<option value="Between">Between</option>' +
      '	</select> <br />' +
      '	<br />' +
      '	<ul class="small-block-grid-4">' +

      '		<li><label for="date_from_year">Year From</label> ' +
      '		<input 			name="date_from_year" type="text" class="small-6" placeholder="Enter year" pattern="^[0-9]{4}$"/>' +
      '			 <small class="error">Year entered is not valid</small>' +
      '			</li>'+
      '		<li><label for="date_from_month">Month From</label>' +
      '		<input   			name="date_from_month" type="hidden" class="small-6 Month" /></li>' +
      '		<li><label for="date_from_day">Day From</label> <input type="hidden" name="date_from_day"	class="small-6 Day" /></li>' +
      '		<li><label for="date_from_uncertainty">Uncertainty</label> ' +
      '		<input type="hidden"	name="date_from_uncertainty"class="Uncertainty small-6" /></li>' +
      		
      '		<li><label for="date_to_year">Year To</label>' +
      '		<input name="date_to_year"	type="text" placeholder="Enter year" class="small-6" pattern="^[0-9]{4}$"/>' +
      '		<small class="error">Year entered is not valid</small></li>' +
      '		<li><label for="date_to_month">Month To</label> ' +
      '		<input	name="date_to_month" type="hidden" class="small-6 Month" /></li>' +
      '		<li><label for="date_to_day">Day To</label> ' +
      '		<input type="hidden" name="date_to_day"	class="small-6 Day" /></li>' +
      '		<li><label for="date_to_uncertainty">Uncertainty</label> ' +
      '		<input type="hidden" name="date_to_uncertainty"class="Uncertainty small-6" /></li>' +
      '	</ul>';
      	
      	
      	
      	
      	
      	
      	
      	