// Userlist data array for filling in info box
var userListData = [];
var editor; // use a global for the submit and return data rendering in the examples

// DOM Ready =============================================================
$(document).ready(function() {

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

  editor = new $.fn.dataTable.Editor( {
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
    "table": "#personTable",
    idSrc: "_id",
    "fields": [ 
      { "label": "upload_name:"           , "name": "upload_name" },
      { "label": "iperson_id:"            , "name": "iperson_id" },
      { "label": "union_iperson_id:"      , "name": "union_iperson_id" },
      { "label": "primary_name:"          , "name": "primary_name" },
      { "label": "alternative_names:"     , "name": "alternative_names" },
      { "label": "roles_or_titles:"       , "name": "roles_or_titles" },
      { "label": "gender:"                , "name": "gender" },
      { "label": "is_organisation:"       , "name": "is_organisation" },
      { "label": "organisation_type:"     , "name": "organisation_type" },
      { "label": "date_of_birth_year:"    , "name": "date_of_birth_year" },
      { "label": "date_of_birth_month:"   , "name": "date_of_birth_month" },
      { "label": "date_of_birth_day:"     , "name": "date_of_birth_day" },
      { "label": "date_of_birth_is_range:", "name": "date_of_birth_is_range" },
      { "label": "date_of_birth2_year:"   , "name": "date_of_birth2_year" },
      { "label": "date_of_birth2_month:"  , "name": "date_of_birth2_month" },
      { "label": "date_of_birth2_day:"    , "name": "date_of_birth2_day" },
      { "label": "date_of_birth_inferred:", "name": "date_of_birth_inferred" },
      { "label": "date_of_birth_uncertain:", "name": "date_of_birth_uncertain" },
      { "label": "date_of_birth_approx:"  , "name": "date_of_birth_approx" },
      { "label": "date_of_death_year:"    , "name": "date_of_death_year" },
      { "label": "date_of_death_month:"   , "name": "date_of_death_month" },
      { "label": "date_of_death_day:"     , "name": "date_of_death_day" },
      { "label": "date_of_death_is_range:", "name": "date_of_death_is_range" },
      { "label": "date_of_death2_year:"   , "name": "date_of_death2_year" },
      { "label": "date_of_death2_month:"  , "name": "date_of_death2_month" },
      { "label": "date_of_death2_day:"    , "name": "date_of_death2_day" },
      { "label": "date_of_death_inferred:", "name": "date_of_death_inferred" },
      { "label": "date_of_death_uncertain:", "name": "date_of_death_uncertain" },
      { "label": "date_of_death_approx:"  , "name": "date_of_death_approx" },
      { "label": "flourished_year:"       , "name": "flourished_year" },
      { "label": "flourished_month:"      , "name": "flourished_month" },
      { "label": "flourished_day:"        , "name": "flourished_day" },
      { "label": "flourished_is_range:"   , "name": "flourished_is_range" },
      { "label": "flourished2_year:"      , "name": "flourished2_year" },
      { "label": "flourished2_month:"     , "name": "flourished2_month" },
      { "label": "flourished2_day:"       , "name": "flourished2_day" },
      { "label": "notes_on_person:"       , "name": "notes_on_person" },
      { "label": "editors_notes:"         , "name": "editors_notes" }
    ]
  } );

  // New record
  $('a.editor_create').on('click', function (e) {
    e.preventDefault();

    editor
      .title( 'Create new record' )
      .buttons( { "label": "Add", "fn": function () { editor.submit() } } )
      .create();
  } );

  // Edit record
  $('#personTable').on('click', 'a.editor_edit', function (e) {
    e.preventDefault();

    editor
      .title( 'Edit record' )
      .buttons( { "label": "Update", "fn": function () { editor.submit() } } )
      .edit( $(this).closest('tr') );
  } );

  // Delete a record (without asking a user for confirmation for this example)
  $('#personTable').on('click', 'a.editor_remove', function (e) {
    e.preventDefault();

    editor
      .message( 'Are you sure you wish to remove this record?' )
      .buttons( { "label": "Delete", "fn": function () { editor.submit() } } )
      .remove( $(this).closest('tr') );
  } );

  var eventFired = function ( type ) {
    var n = $('#demo_info')[0];
    n.innerHTML += '<div>'+type+' event - '+new Date().getTime()+'</div>';
    n.scrollTop = n.scrollHeight;      
  }
  
  $('#personTable')
  .on( 'order.dt',  function () { eventFired( 'Order' ); } )
  .on( 'search.dt', function () { eventFired( 'Search' ); } )
  .on( 'page.dt',   function () { eventFired( 'Page' ); } )
  .dataTable( {
    dom        : "Tptrli",
    searching: true,
    ordering:  true,
    paging:    true,
    "pagingType": "full_numbers",
    "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
    processing : true,
    serverSide : true,
    ajax: {
      "url" : "/admin/person/persons",
      "data" : {
          "sSearch" : "Brahe1"
      }
    },
    columns: [
      { data: "upload_name", "defaultContent": ""   },
      { data: "iperson_id", "defaultContent": ""   },
      { data: "union_iperson_id", "defaultContent": ""   },
      { data: "primary_name", "defaultContent": ""  },
      { data: "alternative_names", "defaultContent": ""  },
      { data: "roles_or_titles", "defaultContent": ""  },
      { data: "gender", "defaultContent": ""  },
      { data: "is_organisation", "defaultContent": ""  },
      { data: "organisation_type", "defaultContent": ""  },
      { data: "date_of_birth_year", "defaultContent": ""  },
      { data: "date_of_birth_month", "defaultContent": ""  },
      { data: "date_of_birth_day", "defaultContent": ""  },
      { data: "date_of_birth_is_range", "defaultContent": ""  },
      { data: "date_of_birth2_year", "defaultContent": ""  },
      { data: "date_of_birth2_month", "defaultContent": ""  },
      { data: "date_of_birth2_day", "defaultContent": ""  },
      { data: "date_of_birth_inferred", "defaultContent": ""  },
      { data: "date_of_birth_uncertain", "defaultContent": ""  },
      { data: "date_of_birth_approx", "defaultContent": ""  },
      { data: "date_of_death_year", "defaultContent": ""  },
      { data: "date_of_death_month", "defaultContent": ""  },
      { data: "date_of_death_day", "defaultContent": ""  },
      { data: "date_of_death_is_range", "defaultContent": ""  },
      { data: "date_of_death2_year", "defaultContent": ""  },
      { data: "date_of_death2_month", "defaultContent": ""  },
      { data: "date_of_death2_day", "defaultContent": ""  },
      { data: "date_of_death_inferred", "defaultContent": ""  },
      { data: "date_of_death_uncertain", "defaultContent": ""  },
      { data: "date_of_death_approx", "defaultContent": ""  },
      { data: "flourished_year", "defaultContent": ""  },
      { data: "flourished_month", "defaultContent": ""  },
      { data: "flourished_day", "defaultContent": ""  },
      { data: "flourished_is_range", "defaultContent": ""  },
      { data: "flourished2_year", "defaultContent": ""  },
      { data: "flourished2_month", "defaultContent": ""  },
      { data: "flourished2_day", "defaultContent": ""  },
      { data: "notes_on_person", "defaultContent": ""  },
      { data: "editors_notes", "defaultContent": ""  },
      {
        data: null, 
        className: "center",
        defaultContent: '<a href="" class="editor_edit">Edit</a> / <a href="" class="editor_remove">Delete</a>'
      },
      { data: null, 
        render: function ( data, type, row ) {
          // Combine the first and last names into a single table field
          return data.primary_name+' '+data._id;
        } 
      }
    ],
    tableTools: {
      sRowSelect: "os",
      aButtons: [
      { sExtends: "editor_create", editor: editor },
      { sExtends: "editor_edit",   editor: editor },
      { sExtends: "editor_remove", editor: editor }
      ]
    }
  } );
} );

// Functions =============================================================
