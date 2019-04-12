/**
 * Created by matthew on 10/19/15.
 */

$(document).ready(function() {

	var printViewDiv = $("#printView");
	printViewDiv.append('<p><i class="fa fa-circle-o-notch fa-spin"></i> Loading...</p>');

	window.onerror=function() {
		printViewDiv.append("<p>Sorry, there has been an error processing the data.</p>");
	};

	$.when(
		$.ajax( "/work/forupload/" + uploadUuid ),
		$.ajax( "/work/manifestation/" + uploadUuid ),
		$.ajax( "/autocomplete/repository/" + uploadUuid + "/" + uploadUuid ),
		$.ajax( "/autocomplete/language/initialise" )
	).done( function( works_data, manifestations_data, repositories_data, languages_data ) {

			if( works_data[1] !== "success" || manifestations_data[1] !== "success" ) {

				$("#printView").append("<p>Sorry, I can't access the data</p>");
				console.error("Unable to get data from server");
				return;
			}

			printViewDiv.append("<p>Processing...</p>");

			var works = works_data[0].data,
				manifestations = manifestations_data[0].data,
				repositories = [],
				languages = [];

			if( repositories_data[1] !== "success" ) {
				console.warn( "Unable to get repositoires at this time");
			}
			else {
				repositories = repositories_data[0].data;
			}
			if( languages_data[1] !== "success" ) {
				console.warn( "Unable to get languages at this time");
			}
			else {
				languages = languages_data[0].data;
			}

			var work_fields = [
					{ field : "count", display : "Number"},
					{ field : "iwork_id", display : "ID" },
					{ field : "date_from", display : "Date from", template : templateDate },
					{ field : "date_to", display : "Date to", template : templateDate },
					{ field : "original_calendar", display : "Original Calendar", template: templateCalendar },
					{ field : "notes_on_date_of_work", display : "Notes on Date" },

					{ field : "authors", display : "Authors", template : templatePeople },
					{ field : "notes_on_authors", display : "Notes on Authors" },
					{ field : "addressees", display : "Addressees", template : templatePeople },
					{ field : "notes_on_addressees", display : "Notes on Addressees" },
					{ field : "people_mentioned", display : "People Mentioned", template : templatePeople },
					{ field : "notes_on_people_mentioned", display : "Notes on People Mentioned" },

					{ field : "origin_id", display : "Origin", template : templatePlaces },
					{ field : "notes_on_origin", display : "Notes on Origin" },
					{ field : "destination_id", display : "Destination", template : templatePlaces },
					{ field : "notes_on_destination", display : "Notes on Destination" },
					{ field : "place_mentioned", display : "Place Mentioned", template : templatePlaces },
					{ field : "notes_on_place_mentioned", display : "Notes on Place Mentioned" },

					{ field : "languages", display : "Languages", template : templateLanguages },

					{ field : "manifestations", display : "Manifestations", template : templateManifestations },

					{ field : "resources", display : "Resources", template : templateResources },



					{ field : "abstract", display : "Abstract" },
					{ field : "explicit", display : "Explicit" },
					{ field : "incipit", display : "Incipit" },

					{ field : "keywords", display : "Keywords" },

					{ field : "notes_on_letter", display : "Letter Notes" },
					{ field : "editors_notes", display : "Editors Notes" }
				];

			var html = "";
			for( var i=0; i<works.length; i++ ) {
				var work = works[i];
				html += '<table class="work">';

				for( var j=0;j<work_fields.length;j++) {

					var field = work_fields[j],
						field_name = field["field"],
						value;

					if( "template" in field ) {
						value = field["template"]( work[field_name], field_name, work, manifestations );
					}
					else if( field_name === "count" ) {
						value = templateDefault( i+1 );
					}
					else {
						value = templateDefault(  work[field_name], field_name );
					}

					if( value !== "" ) {
						var field_display = ("display" in field) ? field["display"] : field_name;

						html += '<tr>';
						html += '<td>' + field_display + "</td>";
						html += '<td>' + value + '</td>';
						html += '</tr>';
					}
				}

				html += '</div>';
			}

			printViewDiv.html(html);


		/*function templateGeneric( data, field, work, manifestations ) {
			var html = ""; // Return empty string if nothing to output.

			// Specific code here.

			return html;
		}*/

		function templateDefault( data ) {
			return data + "";
		}

		function templateDate( data, field, work ) {
			var html = "";
			if( field === "date_from" ) {

				html += templateDateFormat( work["date_of_work_std_year"],work["date_of_work_std_month"],work["date_of_work_std_day"],
					work["date_of_work_approx"], work["date_of_work_inferred"], work["date_of_work_uncertain"]);

				html += "<br/>";

				if( work["date_of_work_as_marked"] !== "" ) {
					html += 'As marked: "' + work["date_of_work_as_marked"] + '"';
				}

			}
			else if( field === "date_to" ) {
				html += templateDateFormat( work["date_of_work2_std_year"],work["date_of_work2_std_month"],work["date_of_work2_std_day"],
					work["date_of_work2_approx"], work["date_of_work2_inferred"], work["date_of_work2_uncertain"]);
			}
			else {
				console.error("Don't understand date! " + field );
				html = "Unknown data";
			}

			return html;
		}

		function templateDateFormat( year, month, day, approx, inferred, uncertain) {

			var html = "";

			if( year || month || day ) {
				html += (year ? year : "-") + " / "
					+ (month ? month : "-") + " / "
					+ (day ? day : "-") + "";
			}

			if( approx || inferred || uncertain ) {
				html += " (";
				html += (approx) ? "approx " : "";
				html += (inferred) ? "inferred " : "";
				html += (uncertain) ? "uncertain " : "";
				html += ")";
			}

			return html;
		}
		function templateCalendar( calendar ) {
			if( calendar === "G" ) {
				return "Gregorian";
			}
			if( calendar === "J" || calendar === "JJ" ) {
				return "Julian (Jan start)";
			}
			if( calendar === "JM" ) {
				return "Julian (March start)";
			}
			return "Unknown"
		}

		function templatePeople( people, field, work ) {

			var html = "";

			if( people.length ) {

				var asMarkedField = field + "_as_marked",
				    inferredField = field + "_inferred",
				    uncertainField = field + "_uncertain";

				if( work[asMarkedField]) {
					html += 'As marked: "' + work[asMarkedField] + '"';
				}

				if( work[inferredField] || work[uncertainField] ) {
					html += " (";
					html += (work[inferredField]) ? "inferred " : "";
					html += (work[uncertainField]) ? "uncertain " : "";
					html += ")";
				}

				if( work[asMarkedField] || work[inferredField] || work[uncertainField] ) {
					html += "<br/>";
				}

				html += '<ul>';
				for (var i = 0; i < people.length; i++) {
					var person = people[i];

					html += '<li>';

					html += person["primary_name"] + " (" + person["name"] + ")";
					html += '<br/>';

					if( person["union_iperson_id"] ) {
						//html += 'ID: ' + '<a target="_blank" href="https://emlo-edit.bodleian.ox.ac.uk/union.php?iperson_id=' + person["union_iperson_id"] + '">' + person["union_iperson_id"] + "</a>";
						html += 'ID: ' + person["union_iperson_id"];
					}
					else {
						html += "New person:<br/>";

						html += "<ul>";

						if( person["date_of_birth_year"] ) {
							html += '<li>Birth: ' + person["date_of_birth_year"] + '</li>';
						}
						if( person["date_of_death_year"] ) {
							html += '<li>Death: ' + person["date_of_death_year"] + '</li>';
						}
						if( person["flourished_year"] ) {
							html += '<li>Flourished from: ' + person["flourished_year"] + '</li>';
						}
						if( person["flourished2_year"] ) {
							html += '<li>Flourished to: ' + person["flourished2_year"] + '</li>';
						}
						if( person["gender"] ) {
							html += '<li>Gender: ';
							if( person["gender"] === "M" ) {
								html += "Male";
							}
							else if( person["gender"] === "F" ) {
								html += "Female";
							}
							else {
								html += "Other/Unknown"
							}

							html += '</li>';
						}
						if( person["notes_on_person"] ) {
							html += '<li>Notes on person: ' + person["notes_on_person"] + '</li>';
						}
						if( person["editors_notes"] ) {
							html += '<li>Editor notes: ' + person["editors_notes"] + '</li>';
						}


						html += "</ul>";
					}



					html += '</li>';
				}
				html += '</ul>';

			}

			return html;
		}

		function templatePlaces( places, field, work ) {

			var html = "";

			if( places.length ) {

				var asMarkedField = field.replace("_id","") + "_as_marked",
					inferredField = field.replace("_id","") + "_inferred",
					uncertainField = field.replace("_id","") + "_uncertain";

				if( work[asMarkedField]) {
					html += 'As marked: "' + work[asMarkedField] + '"';
				}

				if( work[inferredField] || work[uncertainField] ) {
					html += " (";
					html += (work[inferredField]) ? "inferred " : "";
					html += (work[uncertainField]) ? "uncertain " : "";
					html += ")";
				}

				if( work[asMarkedField] || work[inferredField] || work[uncertainField] ) {
					html += "<br/>";
				}

				html += '<ul>';
				for (var i = 0; i < places.length; i++) {
					var place = places[i];

					html += '<li>';

					html += place["location_name"];
					html += '<br/>';

					if( place["union_location_id"] ) {
						//html += 'ID: ' + '<a target="_blank" href="https://emlo-edit.bodleian.ox.ac.uk/union.php?location_id=' + person["union_iperson_id"] + '">' + person["union_iperson_id"] + "</a>";
						html += 'ID: ' + place["union_location_id"];
					}
					else {
						html += "New place:<br/>";

						html += "<ul>";

						if( place["location_synonyms"] ) {
							html += '<li>Synonyms: ' + place["location_synonyms"] + '</li>';
						}
						if( place["room"] ) {
							html += '<li>Room: ' + place["room"] + '</li>';
						}
						if( place["building"] ) {
							html += '<li>Building: ' + place["building"] + '</li>';
						}
						if( place["parish"] ) {
							html += '<li>Parish: ' + place["parish"] + '</li>';
						}
						if( place["city"] ) {
							html += '<li>City: ' + place["city"] + '</li>';
						}
						if( place["county"] ) {
							html += '<li>County: ' + place["county"] + '</li>';
						}
						if( place["country"] ) {
							html += '<li>Country: ' + place["country"] + '</li>';
						}
						if( place["parish"] ) {
							html += '<li>Parish: ' + place["parish"] + '</li>';
						}
						if( place["empire"] ) {
							html += '<li>Empire: ' + place["empire"] + '</li>';
						}
						if( place["room"] ) {
							html += '<li>Room: ' + place["room"] + '</li>';
						}
						if( place["latitude"] ) {
							html += '<li>Latitude: ' + place["latitude"] + '</li>';
						}
						if( place["longitude"] ) {
							html += '<li>Longitude: ' + place["longitude"] + '</li>';
						}
						if( place["editors_notes"] ) {
							html += '<li>Editor Notes: ' + place["editors_notes"] + '</li>';
						}


						html += "</ul>";
					}



					html += '</li>';
				}
				html += '</ul>';

			}

			return html;
		}

		function templateLanguages( languages ) {
			var html = "";
			if( languages.length ) {
				html += "<ul>";
				for (var i = 0; i < languages.length; i++) {

					var language = languages[i];
					html += "<li>";
					if (language["language_name"]) {
						html += language["language_name"];
					}
					if (language["language_code"]) {
						html += " " + getLanguageFromCode(language["language_code"]);
					}
					if (language["language_note"]) {
						html += " " + language["language_note"];
					}
					html += "</li>";
				}
				html += "</ul>";
			}
			return html;
		}

		function getLanguageFromCode( code ) {
			for( var i=0; i<languages.length; i++ ) {
				if( languages[i]["language_code"] == code ) {
					return languages[i]["language_name"];
				}
			}

			if( languages.length === 0 ) {
				return code;
			}

			return "UNKNOWN";
		}

		function templateResources( resources ) {
			var html = "";

			if( resources.length ) {
				html += "<ul>";
				for (var i = 0; i < resources.length; i++) {
					var resource = resources[i];
					html += "<li>";

					if( resource["resource_name"] || resource["resource_details"] || resource["resource_url"] ) {
						if( resource["resource_name"]  ) {
							html += "Name: " + resource["resource_name"];
						}
						else {
							html += "No Name"
						}
						html += "<ul>";
						if(  resource["resource_url"] ) {
							html += "<li>Url: " + resource["resource_url"] + "</li>";
						}
						if( resource["resource_details"] ) {
							html += "<li>Details: " + resource["resource_details"] + "</li>";
						}

						html += "</ul>";
					}

					html += "</li>";
				}
				html += "</ul>";
			}

			return html;
		}

		function templateManifestations( data, field, work, manifestations ) {
			var html = "";

			var matchingMans = [], man;
			for( var i = 0; i<manifestations.length; i++ ) {
				man = manifestations[i];
				if( man["iwork_id"] === work["iwork_id"] ) {
					matchingMans.push( man );
				}
			}

			if( matchingMans.length ) {

				html += "<ul>";
				for( i = 0; i<matchingMans.length; i++ ) {
					man = matchingMans[i];

					html += "<li>";
					if( man["manifestation_id"]  ) {
						html += "ID: " + man["manifestation_id"];
					}

					html += "<ul>";

					if( man["manifestation_type"]  ) {
						html += "<li>Type: " + getManifestationNameFromType(man["manifestation_type"]) + " (" + man["manifestation_type"] + ")</li>";
					}
					if( man["repository_id"]  ) {
						html += "<li>Repository: " + getRepositoryFromId(man["repository_id"]) + "</li>";
					}
					if( man["id_number_or_shelfmark"]  ) {
						html += "<li>ID Number/Shelfmark: " + man["id_number_or_shelfmark"] + "</li>";
					}
					if( man["printed_edition_details"]  ) {
						html += "<li>Printed Editions: " + man["printed_edition_details"] + "</li>";
					}
					if( man["manifestation_notes"]  ) {
						html += "<li>Notes: " + man["manifestation_notes"] + "</li>";
					}

					html += "</ul></li>";
				}
				html += "</ul>";
			}

			return html;
		}

		function getManifestationNameFromType( type ) {
			var typeName = {
				ALS : "Letter",
				D : "Draft",
				E : "Extract",
				O : "Other",
				P : "Printed copy",
				S : "Scribal copy"
			};

			return (type in typeName) ? typeName[type] : type;
		}

		function getRepositoryFromId( id ) {
			for( var i=0; i<repositories.length; i++ ) {
				if( repositories[i]["emloid"] == id ) {
					var name = repositories[i]["label"];
					if( repositories[i]["label2"].replace(/ /gi,"").replace(/\(/gi,"").replace(/\)/gi,"") ) { // some have just " (  )" in!
						name += repositories[i]["label2"];
					}
					return name;
				}
			}

			if( repositories.length === 0 ) {
				return id;
			}

			return "UNKNOWN";
		}

	}); // when
});