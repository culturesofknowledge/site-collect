var work_editor; // use a global for the submit and return data rendering in the examples

// DOM Ready =============================================================
$(document).ready(function() {
	console.log("readying work.js");

	var showAllText = false;

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
			{ "label":"editor:", "name": "editor", "def" : userID }
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
	$('#workTable')
		.on('click', 'a.editor_remove', function (e) {
			e.preventDefault();

			work_editor
				.message( 'Are you sure you wish to remove this record?' )
				.buttons( { "label": "Delete", "fn": function () { editor.submit() } } )
				.remove( $(this).closest('tr') );
		} )

		.DataTable( {
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
			bAutoWidth : false,
			autoWidth : false,

			columns : [
				{ width : "100px" },
				{ width : "100px" },
			],

			///columnDefs: [
				//{ "width": "200px", "targets": [1,2,3,4,5,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29] }
			//],

			columns: [
			{
				data: null,
				className: "center",
				render: function ( data /*, type, row*/ ) {
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
				,
				width:"100px"
			},

			//{ data: "iwork_id",className: "center", "defaultContent": ""  },
			//
			// Authors
			//
			{ data: function (row) {
					return renderPeopleIds( row.authors );
				}
			},
			{ data: function (row) {
					return renderPeopleNames( row.authors );
				}
			},
			{ data: "authors_as_marked", "defaultContent": ""  },
			{ data: null, render:function(row) {
				return renderBoolean(row.authors_inferred);
			}, "defaultContent": ""  },
			{ data: null, render:function(row) {
				return renderBoolean(row.authors_uncertain);
			} , "defaultContent": ""  },
			{ data: "notes_on_authors", render:function(data) {
				return renderShortableText(data);
			}, "defaultContent": ""  },

			//
			// Addressees
			//
			{ data: function (row) {
				return renderPeopleIds( row.addressees );
			}
			},
			{ data: function (row) {
				return renderPeopleNames( row.addressees );
			}
			},
			{ data: "addressees_as_marked", "defaultContent": ""  },
			{ data: null, render:function(row) {
				return renderBoolean(row.addressees_inferred);
			} , "defaultContent": ""  },
			{ data:null, render: function(row) {
				return renderBoolean(row.addressees_uncertain);
			} , "defaultContent": ""  },
			{ data: "notes_on_addressees", render:function(data) {
				return renderShortableText(data);
			}, "defaultContent": ""  },

			//
			// People mentioned
			//
			{ data: function (row) {
				return renderPeopleIds( row.people_mentioned );
			}, "defaultContent": ""  },
			{ data: function (row) {
				return renderPeopleNames( row.people_mentioned );
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
			{ data: "notes_on_people_mentioned", render:function(data) {
				return renderShortableText(data);
			}, "defaultContent": ""  },

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

			{ data: "notes_on_date_of_work", render:function(data) {
				return renderShortableText(data);
			}, "defaultContent": ""  },

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
			{ data: function (row) {
				return renderPlacesIds( row.origin_id );
			}, "defaultContent": "" },
			{ data: function (row) {
				return renderPlacesNames( row.origin_id );
			}, "defaultContent": "" },
			{ data: "origin_as_marked", "defaultContent": ""  },
			{ data: "origin_inferred", render:function(data) {
				return renderBoolean(data);
			}, "defaultContent": ""  },
			{ data: "origin_uncertain", render:function(data) {
				return renderBoolean(data);
			}, "defaultContent": ""  },
			{ data: "notes_on_origin", render:function(data) {
				return renderShortableText(data);
			}, "defaultContent": ""  },

			//
			// destination
			//
			{ data: function (row) {
				return renderPlacesIds( row.destination_id );
			}, "defaultContent": ""  },
			{ data: function (row) {
				return renderPlacesNames( row.destination_id );
			}, "defaultContent": ""  },
			{ data: "destination_as_marked", "defaultContent": ""  },
			{ data: "destination_inferred", render:function(data) {
				return renderBoolean(data);
			}, "defaultContent": ""  },
			{ data: "destination_uncertain", render:function(data) {
				return renderBoolean(data);
			}, "defaultContent": ""  },
			{ data: "notes_on_destination", render:function(data) {
				return renderShortableText(data);
			}, "defaultContent": ""  },

			//
			// place mentioned
			//
			{ data: function (row) {
				return renderPlacesIds( row.place_mentioned );
			}, "defaultContent": ""  },
			{ data: function (row) {
				return renderPlacesNames( row.place_mentioned );
			}, "defaultContent": ""  },
			{ data: "place_mentioned_as_marked", "defaultContent": ""  },
			{ data: "place_mentioned_inferred", render:function(data) {
				return renderBoolean(data);
			}, "defaultContent": ""  },
			{ data: "place_mentioned_uncertain", render:function(data) {
				return renderBoolean(data);
			}, "defaultContent": ""  },
			{ data: "notes_on_place_mentioned", render:function(data) {
				return renderShortableText(data);
			}, "defaultContent": ""  },

			{ data: "abstract", render:function(data) {
				return renderShortableText(data);
			}, "defaultContent": ""  },
			{ data: "keywords", render:function(data) {
				return renderShortableText(data);
			},  "defaultContent": ""  },
			{ data: "incipit", render:function(data) {
				return renderShortableText(data);
			},  "defaultContent": ""  },
			{ data: "explicit", render:function(data) {
				return renderShortableText(data);
			},  "defaultContent": ""  },
			{ data: "notes_on_letter", render:function(data) {
				return renderShortableText(data);
			},  "defaultContent": ""  },
			{ data: "editors_notes", render:function(data) {
				return renderShortableText(data);
			},  "defaultContent": ""  },

			{ data: "languages", render:function(data) {
				var langs = "";
				$.each( data, function( index, lang ) {
					if( langs !== "" ) {
						langs += "; ";
					}
					langs += lang.language_code;
				} );
				return langs;
			}, "defaultContent": ""  },

			{ data: "resources", render:function(data) {
				var ress = "";
				$.each( data, function( index, res ) {
					if( ress !== "" ) {
						ress += "; ";
					}
					ress += res.resource_name + " (" + res.resource_url + ")";
				} );
				return ress;
			}, "defaultContent": ""  }

			//{ data: "upload_name", "defaultContent": ""  },
			//{ data: "editor", "defaultContent": ""  },
			//{ data: "contributors", "defaultContent": ""  },
			//{ data: "manifestations", "defaultContent": ""  },
		],

			/*
			    BUTTONS
			 */

		tableTools: {
			sRowSelect: "os",
			sSwfPath: "/DataTables/extensions/TableTools/swf/copy_csv_xls_pdf.swf",
			aButtons: [
				{ sExtends: 'text',
					sButtonText: 'New Work',
					sButtonClass: "new-work",
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

				{ sExtends: "editor_remove",
					sButtonClass: "delete",
					editor: work_editor
				},

				/*{ sExtends: "text",
					sButtonText: "Upload" ,
					sFilename: uploadName ,
					sButtonClass: "upload",
					fnClick: upload,
					"fnComplete": function (  ) {
						console.log( 'Upload started of ' + uploadName  );


					},
					"fnInit": function (  ) {
						console.log( 'Flush Button initialised'+ uploadName  );
					}
				},*/

				{
					sExtends: "collection",
					sButtonText: "Export table",
					sButtonClass: "export",
					aButtons: [ 'csv','copy' ] //, 'xls', 'pdf' ]
				},

				{
					sExtends: "text",
					sButtonText: "Limit text",
					sButtonClass: "all-text",

					fnClick: function() {
						if( showAllText ) {
							$(".shorten-text .text").show();
							$(".shorten-text .hellip").hide();
						}
						else {
							$(".shorten-text .text").hide();
							$(".shorten-text .hellip").show();
						}
						showAllText = !showAllText;
					}

				}


			]
		}
	} );

	//var colvis = new $.fn.dataTable.ColVis( $('#workTable') );
	//$( colvis.button() ).addClass("DTTT_button DTTT_button_text").insertAfter('#ToolTables_workTable_6');

	//if ( username !== 'cofkmat') {
	//	// TODO: This is temporary to hide but maybe only certain users should be able to upload?
	//	$("#ToolTables_workTable_2").hide();
	//}

	$("#uploading").dialog({
		hide: 'slide',
		show: 'slide',
		autoOpen: false,
		modal: true,
		title: "Uploading..."
	});

	/*
	 // Hiding columns is FAR to complex... why isn;'t everything easy :(
	var columnsHide = {
		"show-authors" : {
			columns : [3, 4, 5, 6],
			colgroup : 1
		}
	};
	$(".show-columns").hide()
		.on("click", function(){
		var name = $(this).prop("name");
		console.log(name);
		if( $(this).prop("checked") ) {
			console.log(" checked");

			var cols = columnsHide[name]["columns"];
			for(var i=0;i<cols.length;i++) {
				$('th.sorting:nth-child(' + cols[i] + '),td:nth-child(' + cols[i] + ')').hide();
			}
		}
		else {
			console.log(" not checked");
		}
	});*/

	// Functions =============================================================

	function upload() {

		$("#uploading").dialog('open').html("Uploading your works...");

		$.ajax({
			url:    "/emloload/flush/" + uploadUuid,
			type:   'POST',
			data:   {
				"uploadName":uploadName,
				"_id" :  uploadUuid
			},
			success: function(/*nButton, oConfig, oFlash, sFlash*/ ) {
				console.log( 'Upload finished of '+ uploadName  );
				$("#uploading").dialog("open").html("Upload complete!");
			},
			error: function(response/*nButton, oConfig, oFlash, sFlash*/ ) {
				var message = "Unknown error";
				if( response && response.responseJSON ) {
					message = response.responseJSON.error;
				}

				console.error( 'Upload ERROR for ' + uploadName + ' : ' + message, response );
				$("#uploading").dialog("open").html("Sorry, there has been an upload error - please seek advice.<br/><br/><small>" + message + "</small>");
			}
		});
	}

	function renderBoolean( value ) {
		return (value) ? "yes" : "";
	}

	function renderPeopleNames( people ) {
		var newVal = "";
		$.each(people, function(key, obj){

			newVal += " (" + obj.primary_name + ")";

			if(key !== people.length-1 ) {
				newVal += ";<br/>";
			}
		});
		return newVal;
	}
	function renderPeopleIds( people ) {
		var newVal = "";
		$.each(people, function(key, obj){
			if( obj.union_iperson_id ) {
				newVal += obj.union_iperson_id;
			}
			else {
				newVal += "new";
			}

			if(key !== people.length-1 ) {
				newVal += ";<br/><br/>";
			}
		});
		return newVal;
	}

	function renderPlacesIds( places ) {
		var newVal = "";
		$.each(places, function(key, obj){

			if( obj.union_location_id ) {
				newVal += obj.union_location_id;
			}
			else {
				newVal += "new";
			}

			if(key !== places.length-1 ) {
				newVal += ";<br/><br/>";
			}
		});
		return newVal;
	}
	function renderPlacesNames( places ) {
		var newVal = "";
		$.each(places, function(key, obj){

			newVal += " (" + obj.location_name + ")";

			if(key !== places.length-1 ) {
				newVal += ";<br/>";
			}
		});
		return newVal;
	}

	function renderShortableText(text) {
		if( text.length > 50 ) {
			text = '<span class="shorten-text">'
				+ text.substring(0,50)
				+ '<span class="hellip" style="display:none;">&hellip;</span>'
				+ '<span class="text">'
				+ text.substring(50)
				+ '</span>'
				+ '</span>';
		}
		return text;
	}
} );

