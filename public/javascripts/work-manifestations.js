var work_editor; // use a global for the submit and return data rendering in the examples

// DOM Ready =============================================================
$(document).ready(function() {

	console.log("readying work.js");

	var showAllText = false;

	$.ajax( "/autocomplete/repository/" + uploadUuid + "/" + uploadUuid )
		.done( function(data) {
			var repos = data.data;
			work_editor = new $.fn.dataTable.Editor({
				ajax: {
					create: {
						type: 'POST',
						url: '/work/work'
					},
					edit: {
						type: 'PUT',
						url: '/work/work/edit/_id_'
					},
					remove: {
						type: 'DELETE',
						url: '/work/work/_id_'
					}
				},
				"table": "#workTable",
				idSrc: "_id",
				"fields": [
					{"label": "iwork_id:", "name": "iwork_id"},
					{"label": "manifestation_id:", "name": "manifestation_id"},
					{"label": "manifestation_type:", "name": "manifestation_type", type: "hidden", "def": ""},
					{"label": "repository_id:", "name": "repository_id", type: "hidden", "def": ""},
					{"label": "id_number_or_shelfmark:", "name": "id_number_or_shelfmark", type: "hidden", "def": ""},
					{"label": "printed_edition_details:", "name": "printed_edition_details", type: "hidden", "def": ""},
					{"label": "manifestation_notes:", "name": "manifestation_notes", type: "hidden", "def": ""},

					//{ "label":"upload_uuid:", "name": "upload_uuid" , "def" : uploadUuid },
					//{ "label":"editor:", "name": "editor", "def" : userID }
				]
			});

			// New record
			$('a.editor_create').on('click', function (e) {
				e.preventDefault();
				work_editor
					.create(false)
//      .set('editors_notes', 'upload['+ uploadUuid + '] user[' + username + ']' )
					.set("date_of_work_std_year", "")
					.set("date_of_work_std_month", "")
					.set("date_of_work_std_day", "")
					.set("date_of_work2_std_year", "")
					.set("date_of_work2_std_month", "")
					.set("date_of_work2_std_day", "")
					.set('editor', userID)
					.set('upload_uuid', uploadUuid)
					.submit();
			});

			work_editor.on('create', function (e, json, data) {
				console.log("event", e);
				console.log("json", json);
				console.log("data", data);
				//console.log( 'New work added '+ json.data._id  );
				window.location.href = "/work/work/edit/" + json.data._id;
			});
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
						.message('Are you sure you wish to remove this record?')
						.buttons({
							"label": "Delete", "fn": function () {
								editor.submit()
							}
						})
						.remove($(this).closest('tr'));
				})

				.DataTable({
					dom: "T<clear>lfrtip",
					processing: true,
					serverSide: false,
					ordering: true,
					order: [], // no initial order
					ajax: {
						"url": "/work/manifestation/" + uploadUuid,
						"data": {
							"sSearch_1": ""
						}
					},

					columns: [
						{data: "iwork_id"},
						{data: "manifestation_id"},
						{data: "manifestation_type"},
						{data: function(row) {
							return repoNameFromId( row.repository_id, repos );
						}},
						{data: "id_number_or_shelfmark"},
						{data: "printed_edition_details"},
						{data: "manifestation_notes", render:function(data) {
							return renderShortableText(data);
						}}
						//{ data : "upload_uuid" },
						//{ data : "editor" },
					],


					/*
					 BUTTONS
					 */

					tableTools: {
						sRowSelect: "os",
						sSwfPath: "/DataTables/extensions/TableTools/swf/copy_csv_xls_pdf.swf",
						aButtons: [

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
								aButtons: ['csv', 'copy'] //, 'xls', 'pdf' ]
							},

							{
								sExtends: "text",
								sButtonText: " Limit text",
								sButtonClass: "all-text",

								fnClick: function () {
									if (showAllText) {
										$(".shorten-text .text").show();
										$(".shorten-text .hellip").hide();
									}
									else {
										$(".shorten-text .text").hide();
										$(".shorten-text .hellip").show();
									}

									showAllText = !showAllText;
									var iButton = $(".all-text i");
									if( iButton.length === 0 ){
										$(".all-text").prepend('<i class="fa fa-toggle-on"></i>');
									}
									else {
										$(".all-text i")
											.toggleClass("fa-toggle-on",showAllText)
											.toggleClass("fa-toggle-off",!showAllText);
									}
								}

							}


						]
					}
				});

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

			// Functions =============================================================

			function repoNameFromId( id, repos ) {
				console.log( repos );
				for( var i=0; i < repos.length; i++ ) {
					if( repos[i]["value"] == id ) {
						return repos[i]["label"] + " : "+'<a href="https://emlo-edit.bodleian.ox.ac.uk/interface/union.php?institution_id=' + id + '">' + id + "</a>";
					}

				}
				return id;
			}

			function renderBoolean(value) {
				return (value) ? "yes" : "";
			}

			function renderPeopleNames(people) {
				var newVal = "";
				$.each(people, function (key, obj) {

					newVal += " (" + obj.primary_name + ")";

					if (key !== people.length - 1) {
						newVal += ";<br/>";
					}
				});
				return newVal;
			}

			function renderPeopleIds(people) {
				var newVal = "";
				$.each(people, function (key, obj) {
					if (obj.union_iperson_id) {
						newVal += obj.union_iperson_id;
					}
					else {
						newVal += "new";
					}

					if (key !== people.length - 1) {
						newVal += ";<br/><br/>";
					}
				});
				return newVal;
			}

			function renderPlacesIds(places) {
				var newVal = "";
				$.each(places, function (key, obj) {

					if (obj.union_location_id) {
						newVal += obj.union_location_id;
					}
					else {
						newVal += "new";
					}

					if (key !== places.length - 1) {
						newVal += ";<br/><br/>";
					}
				});
				return newVal;
			}

			function renderPlacesNames(places) {
				var newVal = "";
				$.each(places, function (key, obj) {

					newVal += " (" + obj.location_name + ")";

					if (key !== places.length - 1) {
						newVal += ";<br/>";
					}
				});
				return newVal;
			}

			function renderShortableText(text) {
				if (text.length > 50) {
					text = '<span class="shorten-text">'
						+ text.substring(0, 50)
						+ '<span class="hellip" style="display:none;">&hellip;</span>'
						+ '<span class="text">'
						+ text.substring(50)
						+ '</span>'
						+ '</span>';
				}
				return text;
			}
		});
} );

