// Userlist data array for filling in info box
var userListData = [];
var work_editor; // use a global for the submit and return data rendering in the examples

// DOM Ready =============================================================
$(document).ready(function() {
	console.log("readying work.js");

	// Populate the user table on initial page load
	// populateTable();

	// Username link click
	//$('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);

	// Add User button click
	//$('#btnAddUser').on('click', addUser);

	// Edit User button click
	//$('#userList table tbody').on('click', 'td a.linkedituser', editUser);

	// Delete User link click
	//$('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);

	//readyDataTable();

//});
// DataTable Editor ======================================================
//$(document).ready(function() {

	work_editor = new $.fn.dataTable.Editor( {
		ajax: {
			create: {
				type: 'POST',
				url:  '/work/work'
			},
			edit: {
				type: 'PUT',
				url:  '/work/work/edit/_id_'
			},
			remove: {
				type: 'DELETE',
				url:  '/work/work/_id_'
			}
		},
		"table": "#workTable",
		idSrc: "_id",
		"fields": [
			{ "label":"iwork_id:", "name": "iwork_id" },
			{ "label":"date_of_work_as_marked:", "name": "date_of_work_as_marked" },
			{ "label":"original_calendar:", "name": "original_calendar", type : "hidden", "def" : ""   },
			{ "label":"date_of_work:", "name": "date_of_work", type : "hidden", "def" : ""   },
			{ "label":"std_year:", "name": "date_of_work_std_year", type : "hidden", "def" : ""  },
			{ "label":"std_month:", "name": "date_of_work_std_month", type : "hidden", "def" : ""  },
			{ "label":"std_day:", "name": "date_of_work_std_day", type : "hidden", "def" : ""  },
			{ "label":"end_year:", "name": "date_of_work2_std_year", type : "hidden", "def" : ""  },
			{ "label":"end_month:", "name": "date_of_work2_std_month", type : "hidden", "def" : ""   },
			{ "label":"end_day:", "name": "date_of_work2_std_day", type : "hidden", "def" : ""   },
			{ "label":"std_is_range:", "name": "std_is_range", type : "hidden", "def" : ""   },
			{ "label":"date_of_work_inferred:", "name": "date_of_work_inferred", type : "hidden", "def" : ""   },
			{ "label":"date_of_work_uncertain:", "name": "date_of_work_uncertain", type : "hidden", "def" : ""   },
			{ "label":"date_of_work_approx:", "name": "date_of_work_approx", type : "hidden", "def" : ""   },
			{ "label":"notes_on_date_of_work:", "name": "notes_on_date_of_work" },
			/*
			 { "label":"authors:", "name": "authors" },
			 { "label":"authors_as_marked:", "name": "authors_as_marked" },
			 { "label":"authors_inferred:", "name": "authors_inferred" },
			 { "label":"authors_uncertain:", "name": "authors_uncertain" },
			 { "label":"notes_on_authors:", "name": "notes_on_authors" },
			 { "label":"addressees:", "name": "addressees" },
			 { "label":"addressees_as_marked:", "name": "addressees_as_marked" },
			 { "label":"addressees_inferred:", "name": "addressees_inferred" },
			 { "label":"addressees_uncertain:", "name": "addressees_uncertain" },
			 { "label":"notes_on_addressees:", "name": "notes_on_addressees" },
			 { "label":"origin_id:", "name": "origin_id" },
			 { "label":"origin_as_marked:", "name": "origin_as_marked" },
			 { "label":"origin_inferred:", "name": "origin_inferred" },
			 { "label":"origin_uncertain:", "name": "origin_uncertain" },
			 { "label":"destination_id:", "name": "destination_id" },
			 { "label":"destination_as_marked:", "name": "destination_as_marked" },
			 { "label":"destination_inferred:", "name": "destination_inferred" },
			 { "label":"destination_uncertain:", "name": "destination_uncertain" },
			 { "label":"place_mentioned:", "name": "place_mentioned" },
			 { "label":"place_mentioned_as_marked:", "name": "place_mentioned_as_marked" },
			 { "label":"place_mentioned_inferred:", "name": "place_mentioned_inferred" },
			 { "label":"place_mentioned_uncertain:", "name": "place_mentioned_uncertain" },
			 { "label":"notes_on_place_mentioned:", "name": "notes_on_place_mentioned" },
			 { "label":"abstract:", "name": "abstract" },
			 { "label":"keywords:", "name": "keywords" },
			 { "label":"language_of_work:", "name": "language_of_work" },
			 { "label":"incipit:", "name": "incipit" },
			 { "label":"explicit:", "name": "explicit" },
			 { "label":"notes_on_letter:", "name": "notes_on_letter" },
			 { "label":"people_mentioned:", "name": "people_mentioned" },
			 { "label":"mentioned_as_marked:", "name": "mentioned_as_marked" },
			 { "label":"mentioned_inferred:", "name": "mentioned_inferred" },
			 { "label":"mentioned_uncertain:", "name": "mentioned_uncertain" },
			 { "label":"notes_on_people_mentioned:", "name": "notes_on_people_mentioned" },
			 */
			{ "label":"editors_notes:", "name": "editors_notes" },
			{ "label":"upload_uuid:", "name": "upload_uuid" , "def" : uploadUuid },
			{ "label":"editor:", "name": "editor", "def" : userID },
			//{ "label":"contributors:", "name": "contributors", "def": undefined },
			//{ "label":"manifestations:", "name": "manifestations", def:null },
		]
	} );

	// New record
	$('a.editor_create').on('click', function (e) {
		e.preventDefault();
		work_editor
			.create(false)
//      .set('editors_notes', 'upload['+ uploadUuid + '] user[' + username + ']' )
			.set("date_of_work_std_year", "")
			.set("date_of_work_std_month","")
			.set("date_of_work_std_day","")
			.set("date_of_work2_std_year", "")
			.set("date_of_work2_std_month","")
			.set("date_of_work2_std_day",  "" )
			.set('editor'   , userID)
			.set('upload_uuid' , uploadUuid)
			.submit();
	} );

	work_editor.on( 'create', function ( e, json, data ) {
		console.log("event",e);
		console.log("json",json);
		console.log("data",data);
		//console.log( 'New work added '+ json.data._id  );
		window.location.href = "/work/work/edit/" + json.data._id ;
	} );
	/*
	 // Edit record
	 $('#workTable').on('click', 'a.editor_edit', function (e) {
	 e.preventDefault();

	 work_editor
	 .title( 'Edit record' )
	 .buttons( { "label": "Update", "fn": function () { editor.submit() } } )
	 .edit( $(this).closest('tr') );
	 } );
	 */

	// Delete a record (without asking a user for confirmation for this example)
	$('#workTable').on('click', 'a.editor_remove', function (e) {
		e.preventDefault();

		work_editor
			.message( 'Are you sure you wish to remove this record?' )
			.buttons( { "label": "Delete", "fn": function () { editor.submit() } } )
			.remove( $(this).closest('tr') );
	} );

	$('#workTable').DataTable( {
		dom        : "T<clear>lfrtip",
		processing : true,
		serverSide : false,
		ordering : true,
		order : [], // no initial order
		ajax: {
			"url" : "/work/forupload/" + uploadUuid,
			"data" : {
				"sSearch_1" : ""
			}
		},
		columns: [
			{
				data: null,
				className: "center",
				render: function ( data, type, row ) {
					// If upload has no works permit delete
					//var editfield = '<a href="/work/work/' + data.upload_name + '/' + data.iwork_id ;
					var editfield = '<a href="/work/work/edit/' + data._id  ;
					editfield += '" class="editor_edit">' + data.iwork_id + '</a>';
					//if ( data.manifestations == null ) {
					//  editfield +='/ <a href="" class="editor_remove">Delete</a>';
					//}
					return editfield;
				}//,
				//sortable:false
			},

			//{ data: "iwork_id",className: "center", "defaultContent": ""  },
			//
			// Authors
			//
			{ data: function (row, type, set, meta) {
					return renderPeople( row.authors );
				},
				"orderData": [ 5,6,2,3,4 ]
			},
			{ data: "authors_as_marked", "defaultContent": ""  },
			{ data: null, render:function(row) {
				return renderBoolean(row.authors_inferred);
			}, "defaultContent": ""  },
			{ data: null, render:function(row) {
				return renderBoolean(row.authors_uncertain);
			} , "defaultContent": ""  },
			{ data: "notes_on_authors", "defaultContent": ""  },

			//
			// Addressees
			//
			{ data: function (row, type, set, meta) {
				return renderPeople( row.addressees );
				},
				"orderData": [ 6,5,2,3,4 ]
			},
			{ data: "addressees_as_marked", "defaultContent": ""  },
			{ data: null, render:function(row) {
				return renderBoolean(row.addressees_inferred);
			} , "defaultContent": ""  },
			{ data:null, render: function(row) {
				return renderBoolean(row.addressees_uncertain);
			} , "defaultContent": ""  },
			{ data: "notes_on_addressees", "defaultContent": ""  },

			//
			// Places mentioned
			//
			{ data: function (row, type, set, meta) {
				return renderPeople( row.people_mentioned );
			}, "defaultContent": ""  },
			{ data: "mentioned_as_marked", render:function(data) {
				return renderBoolean(data);
			}, "defaultContent": ""  },
			{ data: "mentioned_inferred", render:function(data) {
				return renderBoolean(data);
			}, "defaultContent": ""  },
			{ data: "mentioned_uncertain", render:function(data) {
				return renderBoolean(data);
			}, "defaultContent": ""  },
			{ data: "notes_on_people_mentioned", "defaultContent": ""  },

			//
			// Date from
			//
			//{ data: "date_of_work", "defaultContent": ""  },
			{ data: "date_of_work_std_year",
				className: "center",
				"defaultContent": "",
				"orderData": [ 2, 3, 4, 5, 6 ] },
			{ data: "date_of_work_std_month",className: "center", "defaultContent": "",
				"orderData": [ 3, 4, 2, 5, 6 ]  },
			{ data: "date_of_work_std_day",className: "center", "defaultContent": "",
				"orderData": [ 4, 2, 3, 5, 6 ]  },
			{ data: "date_of_work_as_marked", "defaultContent": ""  },
			{ data: "original_calendar", render:function(data){
				if( data === "G" ) {
					return "Gregorian"
				}
				if( data === "J" ) {
					return "Julian"
				}
				return "Unknown"

			},"defaultContent": ""  },

			//{ data: "std_is_range", "defaultContent": ""  },
			{ data: "date_of_work_inferred", render:function(data) {
				return renderBoolean(data);
			}, "defaultContent": ""  },
			{ data: "date_of_work_uncertain", render:function(data) {
				return renderBoolean(data);
			}, "defaultContent": ""  },
			{ data: "date_of_work_approx", render:function(data) {
				return renderBoolean(data);
			}, "defaultContent": ""  },

			{ data: "notes_on_date_of_work", "defaultContent": ""  },

			//
			// Date To
			//
			{ data: "date_of_work2_std_year", defaultContent: ""},
			{ data: "date_of_work2_std_month", defaultContent: ""},
			{ data: "date_of_work2_std_day", defaultContent: ""},
			{ data: "date_of_work2_approx", render:function(data) {
				return renderBoolean(data);
			}, defaultContent: "" },
			{ data: "date_of_work2_inferred", render:function(data) {
				return renderBoolean(data);
			}, defaultContent: ""},
			{ data: "date_of_work2_uncertain", render:function(data) {
				return renderBoolean(data);
			}, defaultContent: ""},


			//
			// Origin
			//
			{ data: function (row, type, set, meta) {
				return renderPlaces( row.origin_id );
			}, "defaultContent": "" },
			{ data: "origin_as_marked", "defaultContent": ""  },
			{ data: "origin_inferred", render:function(data) {
				return renderBoolean(data);
			}, "defaultContent": ""  },
			{ data: "origin_uncertain", render:function(data) {
				return renderBoolean(data);
			}, "defaultContent": ""  },
			{ data: "notes_on_origin", "defaultContent": ""  },

			//
			// destination
			//
			{ data: function (row, type, set, meta) {
				return renderPlaces( row.destination_id );
			}, "defaultContent": ""  },
			{ data: "destination_as_marked", "defaultContent": ""  },
			{ data: "destination_inferred", render:function(data) {
				return renderBoolean(data);
			}, "defaultContent": ""  },
			{ data: "destination_uncertain", render:function(data) {
				return renderBoolean(data);
			}, "defaultContent": ""  },
			{ data: "notes_on_destination", "defaultContent": ""  },

			//
			// place mentioned
			//
			{ data: function (row, type, set, meta) {
				return renderPlaces( row.place_mentioned );
			}, "defaultContent": ""  },
			{ data: "place_mentioned_as_marked", "defaultContent": ""  },
			{ data: "place_mentioned_inferred", render:function(data) {
				return renderBoolean(data);
			}, "defaultContent": ""  },
			{ data: "place_mentioned_uncertain", render:function(data) {
				return renderBoolean(data);
			}, "defaultContent": ""  },
			{ data: "notes_on_place_mentioned", "defaultContent": ""  },

			{ data: "abstract", "defaultContent": ""  },
			{ data: "keywords", "defaultContent": ""  },
			{ data: "incipit", "defaultContent": ""  },
			{ data: "explicit", "defaultContent": ""  },
			{ data: "notes_on_letter", "defaultContent": ""  },
			{ data: "editors_notes", "defaultContent": ""  },

			//{ data: "language_of_work", "defaultContent": ""  },
			//{ data: "upload_name", "defaultContent": ""  },
			//{ data: "editor", "defaultContent": ""  },
			//{ data: "contributors", "defaultContent": ""  },
			//{ data: "manifestations", "defaultContent": ""  },
		],
		tableTools: {
			sRowSelect: "os",
			sSwfPath: "/DataTables/extensions/TableTools/swf/copy_csv_xls_pdf.swf",
			aButtons: [
				{ sExtends: "text",
					sButtonText: "Upload" ,
					sFilename: uploadName ,
					fnClick: function( nButton, oConfig ) {
						console.log("nButton", nButton);
						console.log("oConfig:", oConfig);
						this.fnInfo( "My information button!"+ uploadName  );
						$.ajax({
							url:    "/emloload/flush/" + uploadUuid,
							type:   'POST',
							data:   {
								"uploadName":uploadName,
								"_id" :  uploadUuid
							},
							success:fnRenhart
						});
					},
					"fnComplete": function ( nButton, oConfig, oFlash, sFlash ) {
						console.log( 'Flush Button action complete'+ uploadName  );
					},
					"fnRenhart": function ( nButton, oConfig, oFlash, sFlash ) {
						console.log( 'Flush Button action Renhart worked'+ uploadName  );
					},
					"fnInit": function ( nButton, oConfig ) {
						console.log( 'Flush Button initialised'+ uploadName  );
					}
				},
				/*
				 { sExtends: "ajax",
				 sAjaxUrl: "/emloload/flush/" + uploadUuid,
				 //sAjaxUrl: "/emloload/flush/"+ uploadName,
				 sButtonText: "New Work",
				 fnClick: function( nButton, oConfig ) {
				 console.log("nButton", nButton);
				 console.log("oConfig:", oConfig);
				 this.fnInfo( "My ajax button!"+ uploadName  );
				 },
				 fnAjaxComplete: function ( XMLHttpRequest, textStatus ) {
				 console.log( 'Ajax complete for'+ uploadName  );
				 },
				 editor: work_editor
				 },
				 { sExtends: "text",
				 sButtonText: "New2" ,
				 sFilename: uploadName ,
				 fnClick:
				 work_editor
				 .create(false)
				 .set('editors_notes', 'upload['+ uploadUuid + '] user[' + username + ']' )
				 .set("std_year", "")
				 .set("std_month","")
				 .set("std_day","")
				 .set("end_year", "")
				 .set("end_month","")
				 .set("end_day",  "" )
				 .set('editor'   , userID)

				 },
				 */
				{ sExtends: 'select_single',
					sButtonText: 'New Work',
					fnClick: function () {
						work_editor
							.create(false)
							.set("date_of_work_std_year", "")
							.set("date_of_work_std_month","")
							.set("date_of_work_std_day","")
							.set("date_of_work2_std_year", "")
							.set("date_of_work2_std_month","")
							.set("date_of_work2_std_day",  "" )
							.set('editor'   , userID)
							.set('upload_uuid' , uploadUuid)
							.submit();
					}
				},
				// { sExtends: "editor_edit",   editor: work_editor },
				{ sExtends: "editor_remove", editor: work_editor },
				{
					sExtends: "text",
					sButtonText: "View Simple",
					sFilename: uploadName,
					fnClick: function (nButton, oConfig) {

						window.location = "/work/byupload/" + uploadUuid + "/" + uploadName;

					}
				},
				{
					sExtends: "collection",
					sButtonText: "Export",
					sButtonClass: "save-collection",
					aButtons: [ 'copy', 'csv', 'xls', 'pdf' ],
					// http://datatables.net/extensions/tabletools/button_options#mColumns
					"fnCellRender": function ( sValue, iColumn, nTr, iDataIndex ) {
						// Append the text 'TableTools' to column 5
						if ( iColumn === 5 ) {
							return sValue +" TableTools";
						}
						return sValue;
					}
				}


			]
		}
	} );
} );

// Functions =============================================================

function renderBoolean( value ) {
	return (value) ? "yes" : "";
}

function renderPeople( people ) {
	var newVal = "";
	$.each(people, function(key, obj){
		if( obj.union_iperson_id ) {
			newVal += obj.union_iperson_id;
		}
		else {
			newVal += "new";
		}

		newVal += " (" + obj.primary_name + ")";

		if(key !== people.length-1 ) {
			newVal += ";<br/>";
		}
	});
	return newVal;
}

function renderPlaces( places ) {
	var newVal = "";
	$.each(places, function(key, obj){

		if( obj.union_location_id ) {
			newVal += obj.union_location_id;
		}
		else {
			newVal += "new";
		}

		newVal += " (" + obj.location_name + ")";

		if(key !== places.length-1 ) {
			newVal += ";<br/>";
		}
	});
	return newVal;
}

var fnRenhart = function ( nButton, oConfig, oFlash, sFlash ) {
	console.log( 'Flush Button action Renhart worked'+ uploadName  );
};

// Fill table with data
function readyDataTable() {
	$('#userTable').dataTable();
};

function workback(data,status) {
	console.log(data);
	console.log(status);
}
