console.log("loading person.js");
// Userlist data array for filling in info box

var tData = { };
var pers_editor; // use a global for the submit and return data rendering in the examples

// DOM Ready =============================================================
$(document).ready(function() {
  console.log("readying person.js");
  
// DataTable Editor ======================================================

  pers_editor = new $.fn.dataTable.Editor( {
    ajax: {
      create: {
        type: 'POST',
        url:  '/admin/person/persons'
      },
      edit: {
        type: 'PUT',
        url:  '/admin/person/persons/_id_'
      },
      remove: {
        type: 'DELETE',
        url:  '/admin/person/persons/_id_'
      }
    },
    // "table": "#exampleTable",
    idSrc: "_id",
    "fields": [ 
      { "label": "_id:", "name": "_id", "type": "hidden" },
      { "label": "upload_uuid",
        "name": "upload_uuid",
        "default": uploadUuid ,
        "type": "text" ,
        "type": "hidden"
      },
      { "label": "upload_name:",
      "name": "upload_name" ,
      "type": "hidden",
      "def" : uploadName 
      },
      { "label": "iperson_id:", "type": "hidden" , "name": "iperson_id" },
      { "label": "union_iperson_id:" ,
        "name": "union_iperson_id",
        "type": "hidden",
        "def" : "" 
      },
      { "label": "Name (Surname, Forename)", "name": "primary_name" },
      //{ "label": "alternative_names:"     , "name": "alternative_names" },
      //{ "label": "roles_or_titles:"       , "name": "roles_or_titles" },
      { "label": "Gender:"                ,
        "name": "gender" ,
        "type": "select",
        "ipOpts": opts.gender
      },
      //{ "label": "is_organisation:"       , "name": "is_organisation" },
      //{ "label": "organisation_type:"     , "name": "organisation_type" },
      { "label": "Year of birth"    , "name": "date_of_birth_year" },
      //{ "label": "date_of_birth_month:"   , "name": "date_of_birth_month" },
      //{ "label": "date_of_birth_day:"     , "name": "date_of_birth_day" },
      //{ "label": "date_of_birth_is_range:", "name": "date_of_birth_is_range" },
      //{ "label": "date_of_birth2_year:"   , "name": "date_of_birth2_year" },
      //{ "label": "date_of_birth2_month:"  , "name": "date_of_birth2_month" },
      //{ "label": "date_of_birth2_day:"    , "name": "date_of_birth2_day" },
      //{ "label": "date_of_birth_inferred:", "name": "date_of_birth_inferred" },
      //{ "label": "date_of_birth_uncertain:", "name": "date_of_birth_uncertain" },
      //{ "label": "date_of_birth_approx:"  , "name": "date_of_birth_approx" },
      { "label": "Year of death:"    , "name": "date_of_death_year" },
      //{ "label": "date_of_death_month:"   , "name": "date_of_death_month" },
      //{ "label": "date_of_death_day:"     , "name": "date_of_death_day" },
      //{ "label": "date_of_death_is_range:", "name": "date_of_death_is_range" },
      //{ "label": "date_of_death2_year:"   , "name": "date_of_death2_year" },
      //{ "label": "date_of_death2_month:"  , "name": "date_of_death2_month" },
      //{ "label": "date_of_death2_day:"    , "name": "date_of_death2_day" },
      //{ "label": "date_of_death_inferred:", "name": "date_of_death_inferred" },
      //{ "label": "date_of_death_uncertain:", "name": "date_of_death_uncertain" },
      //{ "label": "date_of_death_approx:"  , "name": "date_of_death_approx" },
      { "label": "Year flourished from:"    , "name": "flourished_year" },
      //{ "label": "flourished_month:"      , "name": "flourished_month" },
      //{ "label": "flourished_day:"        , "name": "flourished_day" },
      //{ "label": "flourished_is_range:"   , "name": "flourished_is_range" },
      { "label": "Year flourished to:"      , "name": "flourished2_year" },
      //{ "label": "flourished2_month:"     , "name": "flourished2_month" },
      //{ "label": "flourished2_day:"       , "name": "flourished2_day" },
      { "label": "Notes on person (for public display):"       , "name": "notes_on_person", "type": "textarea"  },
      { "label": "Editor's notes (hidden):" , "name": "editors_notes", "type": "textarea"  }
    ]
  } );
  
  // New record
  $('a.pers_editor_create').on('click', function (e) {
    e.preventDefault();
    tData["itemAdd"]   = itemAddMap[e.target.id];      //author <- author_add
    tData["selector"]  = selectorMap[tData.itemAdd];   //authors <- author
    tData.itemType  = "person";
    var tSelector = '#' + tData.itemAdd;
    console.log('a.pers_editor_create '+tSelector , e);
    console.log(tSelector , $(tSelector).val());
    pers_editor
      .title( 'Create new person' )
      .buttons( { "label": "Add", "fn": function () { pers_editor.submit() } } )
      .create()
      .set("primary_name",$(tSelector).val());
  } );

    var openVals;
    pers_editor
      .on( 'open', function () {
          // Store the values of the fields on open
          openVals = JSON.stringify( pers_editor.get() );
          console.log("open ",openVals);
      } )
      .on( 'preBlur', function ( e ) {
          console.log("preBlur ",openVals);
          // On close, check if the values have changed and ask for closing confirmation if they have
          if ( openVals !== JSON.stringify( pers_editor.get() ) ) {
              return confirm( 'You have unsaved changes. Are you sure you want to exit?' );
          }
      } )
      .on( 'setData', function ( e, json, data, action) {
        // setData
        console.log("setData ",e, json, data, action);
      } )
      .on( 'submitSuccess', function ( e, json, data, action) {
        // submitSuccess
        console.log("submitSuccess ",e, json, data, action);
        //var jSelector = '#' + tData.selector;
        if( json.message === "Person created!" ) {
          var t = $( '#' + tData.selector ).DataTable();
          var nItem = {
            "label"   : json.data.primary_name,
            "name"    : json.data.primary_name,
            "emloid"  : json.data.union_iperson_id,  // this should be null for a new person
            "value"   : json.data.iperson_id,
            "itemType": "person"
          }
          console.log("add item with table selector ",tData.itemAdd, nItem);
          tabadd( tData.itemAdd, nItem )
        } else {
          console.log("Successful ",json.message );
        }
      } )
      ;
        
  // Edit record
  $('a.pers_editor_edit').on('click', function (e) {
    e.preventDefault();

    pers_editor
      .title( 'Edit person' )
      .buttons( { "label": "Update", "fn": function () { pers_editor.submit() } } )
      .edit( $(this).closest('tr') );
  } );

  // Delete a record (without asking a user for confirmation for this example)
  $('#exampleTable').on('click', 'a.pers_editor_remove', function (e) {
    e.preventDefault();

    pers_editor
      .message( 'Are you sure you wish to remove this record?' )
      .buttons( { "label": "Delete", "fn": function () { pers_editor.submit() } } )
      .remove( $(this).closest('tr') );
  } );

  var eventFired = function ( type ) {
    var n = $('#demo_info')[0];
    n.innerHTML += '<div>'+type+' event - '+new Date().getTime()+'</div>';
    n.scrollTop = n.scrollHeight;      
  }
//=====RG
$('#exampleTable').on( 'click', 'tbody td', function (e) {
        var index = $(this).index();
 
        if ( index === 1 ) {
            pers_editor.bubble( this, ['first_name', 'last_name'], {
                title: 'Edit name:'
            } );
        }
        else if ( index === 2 ) {
            pers_editor.bubble( this, {
                buttons: false
            } );
        }
        else if ( index === 3 ) {
            pers_editor.bubble( this );
        }
        else if ( index === 4 ) {
            pers_editor.bubble( this, {
                message: 'Date must be given in the format `yyyy-mm-dd`'
            } );
        }
        else if ( index === 5 ) {
            pers_editor.bubble( this, {
                title: 'Edit salary',
                message: 'Enter an unformatted number in dollars ($)'
            } );
        }
    } );

    $('#exampleTable').DataTable( {
        dom: "Tfrtip",
        //ajax: "../php/staff.php",
        processing : true,
        serverSide : true,
        ajax: {
          "url" : "/admin/person/persons",
          "data" : {
            "sSearch" : "cofkrenhart"
          }
        },
        columns: [
            { data: null, defaultContent: '', orderable: false },
            { data: null, render: function ( data, type, row ) {
                // Combine the first and last names into a single table field
                // return data.first_name+' '+data.last_name;
                return data.primary_name+' '+data._id;
              } 
            },
            { data: "upload_name"  },
            { data: "iperson_id"  },
            { data: "primary_name" },
            { data: "gender" },
            { data: "date_of_birth_year" },
            { data: "date_of_death_year" },
            { data: "flourished_year" },
            { data: "editors_notes" }
        ],
        order: [ 1, 'asc' ],
        tableTools: {
            sRowSelect: "os",
            sRowSelector: 'td:first-child',
            aButtons: [
                { sExtends: "editor_create", editor: pers_editor },
                { sExtends: "editor_edit",   editor: pers_editor },
                { sExtends: "editor_remove", editor: pers_editor }
            ]
        }
    } );
//=====RG
} );

// Functions =============================================================
getPersonLabel =  function( newperson ) {
  var alabel;
  
  alabel  = newperson.primary_name;
  alabel += ' (' ;
  alabel += ' b:' + newperson.date_of_birth_year;
  alabel += ' d:' + newperson.date_of_death_year;
  alabel += ' fl:' + newperson.flourished_year;
  alabel += ' )' ;
  
  return alabel;
}
