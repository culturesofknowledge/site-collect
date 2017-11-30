console.log("loading place.js");
// Userlist data array for filling in info box
var itemData = { };
var item_editor; // use a global for the submit and return data rendering in the examples

// DOM Ready =============================================================
$(document).ready(function() {
  console.log("readying place.js");
  
// DataTable Editor ======================================================

  item_editor = new $.fn.dataTable.Editor( {
    ajax: {
      create: {
        type: 'POST',
        url:  '/admin/place/places'
      },
      edit: {
        type: 'PUT',
        url:  '/admin/place/places/_id_'
      },
      remove: {
        type: 'DELETE',
        url:  '/admin/place/places/_id_'
      }
    },
    // "table": "#placeTable",
    idSrc: "_id",
    "fields": [ 
      { "label": "_id:", "name": "_id", "type": "hidden" },
      { "label": "upload_name:",
      "name": "upload_name" ,
      "type": "hidden",
      "def" : uploadName 
      },
      { "label": "upload_uuid",
      "name": "upload_uuid",
      "default": uploadUuid ,
      "type": "text" ,
      "type": "hidden"
      },
      { "label": "location_id:", "type": "hidden" , "name": "location_id" },
      { "label": "union_location_id:" ,
        "name": "union_location_id",
        "type": "hidden",
        "def" : "" 
      },
      { "label": "Room:", "name": "room" },
      { "label": "Building:", "name": "building" },
      { "label": "Parish/district of city/street:", "name": "parish" },
      { "label": "<b>City/Village/Town</b>:", "name": "city" },
      { "label": "County:", "name": "county" },
      { "label": "Country:", "name": "country" },
      { "label": "Empire:", "name": "empire" },
      { "label": "Latitude (decimal):", "name": "latitude" },
      { "label": "Longitude (decimal):", "name": "longitude" },
//      { "label": "Notes on place (for public display):", "name": "notes_on_place" },
      { "label": "Editor's notes (hidden):", "name": "editors_notes" },
      { "label": "Location synonyms:", "name": "location_synonyms" },
      { "label": "Location name:", "type": "hidden" , "name": "location_name" }
    ]
  } );
  
  // New record
  $('a.item_editor_create').on('click', function (e) {
    e.preventDefault();
    itemData["itemAdd"]   = itemAddMap[e.target.id];      //author <- author_add
    itemData["selector"]  = selectorMap[itemData.itemAdd];   //authors <- author
    itemData.itemType  = "place";
    var tSelector = '#' + itemData.itemAdd;
    console.log('a.item_editor_create '+tSelector , e);
    console.log(tSelector , $(tSelector).val());
    item_editor
      .title( 'Create new place' )
      .buttons( { "label": "Add", "fn": function () { item_editor.submit() } } )
      .create()
      .set("location_name",$(tSelector).val());
  } );

    var openVals;
    item_editor
      .on( 'open', function () {
          // Store the values of the fields on open
          openVals = JSON.stringify( item_editor.get() );
          console.log("open ",openVals);
      } )
      .on( 'preBlur', function ( e ) {
          console.log("preBlur ",openVals);
          // On close, check if the values have changed and ask for closing confirmation if they have
          if ( openVals !== JSON.stringify( item_editor.get() ) ) {
              return confirm( 'You have unsaved changes. Are you sure you want to exit?' );
          }
      } )
      .on( 'preSubmit', function ( e, data, action) {
        // preSubmit
        generateLocationName(data);
        console.log("preSubmit ",e, data, action);
      } )
      .on( 'setData', function ( e, json, data, action) {
        // setData
        console.log("setData ",e, json, data, action);
      } )
      .on( 'submitSuccess', function ( e, json, data, action) {
        // submitSuccess
        console.log("submitSuccess ",e, json, data, action);
        //var jSelector = '#' + itemData.selector;
        if( json.message === "Place created!" ) {
          var t = $( '#' + itemData.selector ).DataTable();
          var nItem = {
            "label"   : json.data.location_name,
            "value"   : json.data.location_id,
            "name"    : json.data.location_name,
            "emloid"  : json.data.union_location_id,  // this should be null for a new place
            "itemType": "place"
          }
          console.log("add item with table selector ",itemData.itemAdd, nItem);
          tabadd( itemData.itemAdd, nItem )
        } else {
          console.log("Successful ",json.message );
        }
      } )
      ;
        
  // Edit record
  $('a.item_editor_edit').on('click', function (e) {
    e.preventDefault();

    item_editor
      .title( 'Edit place' )
      .buttons( { "label": "Update", "fn": function () { item_editor.submit() } } )
      .edit( $(this).closest('tr') );
  } );

  // Delete a record (without asking a user for confirmation for this example)
  $('#placeTable').on('click', 'a.item_editor_remove', function (e) {
    e.preventDefault();

    item_editor
      .message( 'Are you sure you wish to remove this record?' )
      .buttons( { "label": "Delete", "fn": function () { item_editor.submit() } } )
      .remove( $(this).closest('tr') );
  } );

  var eventFired = function ( type ) {
    var n = $('#demo_info')[0];
    n.innerHTML += '<div>'+type+' event - '+new Date().getTime()+'</div>';
    n.scrollTop = n.scrollHeight;      
  }
//=====RG
$('#placeTable').on( 'click', 'tbody td', function (e) {
        var index = $(this).index();
 
        if ( index === 1 ) {
            item_editor.bubble( this, ['first_name', 'last_name'], {
                title: 'Edit name:'
            } );
        }
        else if ( index === 2 ) {
            item_editor.bubble( this, {
                buttons: false
            } );
        }
        else if ( index === 3 ) {
            item_editor.bubble( this );
        }
        else if ( index === 4 ) {
            item_editor.bubble( this, {
                message: 'Date must be given in the format `yyyy-mm-dd`'
            } );
        }
        else if ( index === 5 ) {
            item_editor.bubble( this, {
                title: 'Edit salary',
                message: 'Enter an unformatted number in dollars ($)'
            } );
        }
    } );

    $('#placeTable').DataTable( {
        dom: "Tfrtip",
        //ajax: "../php/staff.php",
        processing : true,
        serverSide : true,
        ajax: {
          "url" : "/admin/place/places",
          "data" : {
            "sSearch" : "cofkrenhart"
          }
        },
        columns: [
            { data: null, defaultContent: '', orderable: false },
            { data: null, render: function ( data, type, row ) {
                // Combine the first and last names into a single table field
                // return data.first_name+' '+data.last_name;
                return data.location_name+' '+data._id;
              } 
            },
            { data: "upload_name"  },
            { data: "location_id"  },
            { data: "union_location_id" },
            { data: "location_name" },
            { data: "location_synonyms" },
            { data: "latitude" },
            { data: "longitude" },
            { data: "room" },
            { data: "building" },
            { data: "parish" },
            { data: "city" },
            { data: "county" },
            { data: "country" },
            { data: "empire" },
 //           { data: "notes_on_place" },
            { data: "editors_notes" }
        ],
        order: [ 1, 'asc' ],
        tableTools: {
            sRowSelect: "os",
            sRowSelector: 'td:first-child',
            aButtons: [
                { sExtends: "editor_create", editor: item_editor },
                { sExtends: "editor_edit",   editor: item_editor },
                { sExtends: "editor_remove", editor: item_editor }
            ]
        }
    } );
//=====RG
} );

// Functions =============================================================
getPlaceLabel =  function( newplace ) {
  var alabel;
  
  alabel  = newplace.location_name;
  alabel += ' (' ;
  alabel += ' ' + newplace.city;
  //alabel += ' d:' + newplace.date_of_death_year;
  //alabel += ' fl:' + newplace.flourished_year;
  alabel += ' )' ;
  
  return alabel;
}


function generateLocationName(locationForm){
  
  locationForm.data.location_name = "";
  
  addToLocationName( locationForm, "room" )
  addToLocationName( locationForm, "building")
  addToLocationName( locationForm, "parish" )
  addToLocationName( locationForm, "city"   )
  addToLocationName( locationForm, "county" )
  addToLocationName( locationForm, "country")
  addToLocationName( locationForm, "empire" )
  
  //locationForm.data.location_name = locationName;
}


function addToLocationName ( locationForm, fieldname  ) {
  
  var elementVal = locationForm.data[fieldname];
  var currentVal = locationForm.data.location_name;
  
  console.log("elementVal",elementVal,currentVal);
  
  if ( currentVal.length > 0 && elementVal.length > 0 ) {
    currentVal = currentVal + ", "
  }
  
  if ( elementVal.length > 0 ) {
    currentVal = currentVal + elementVal
  }
  
  locationForm.data.location_name = currentVal ;
}
