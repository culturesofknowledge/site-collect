var repo_editor; // use a global for the submit and return data rendering in the examples

// DOM Ready =============================================================
$(document).ready(function() {
  console.log("readying repo.js");
  
// DataTable Editor ======================================================
  repo_editor = new $.fn.dataTable.Editor( {
    ajax: {
      create: {
        type: 'POST',
        url:  '/admin/repo/repos/'
      },
      edit: {
        type: 'PUT',
        url:  '/admin/repo/repos/_id_'
      },
      remove: {
        type: 'DELETE',
        url:  '/admin/repo/repos/_id_'
      }
    },
    "table": "#repoTable",
    idSrc: "_id",
    "fields": [
    { "label": "_id:", "name": "_id", "type": "hidden" },
    { "label": "upload_id:",
    "name": "upload_id" ,
    "type": "hidden",
    "def" : uploadID 
    },
    { "label": "institution_id:", "type": "hidden" , "name": "institution_id" },
    { "label": "union_institution_id:" ,
    "name": "union_institution_id",
    "type": "hidden",
    "def" : "" 
    },
    { "label": "name:", "name": "institution_name" },
    { "label": "city:", "name": "institution_city" },
    { "label": "country:", "name": "institution_country" },
    { "label": "synonyms:", "name": "institution_synonyms" },
    { "label": "city_synonyms:", "name": "institution_city_synonyms" },
    { "label": "country_synonyms:", "name": "institution_country_synonyms" }    
    ]
  } );

  // New record
  $('a.editor_create').on('click', function (e) {
    e.preventDefault();

    repo_editor
      .title( 'Create new record' )
      .buttons( { "label": "Add", "fn": function () { repo_editor.submit() } } )
      .create();
  } );

  // Edit record
  $('#repoTable').on('click', 'a.repo_editor_edit', function (e) {
    e.preventDefault();

    repo_editor
      .title( 'Edit repo entry' )
      .buttons( { "label": "Update", "fn": function () { repo_editor.submit() } } )
      .edit( $(this).closest('tr') );
  } );

  // Delete a record (without asking a user for confirmation for this example)
  $('#repoTable').on('click', 'a.repo_editor_remove', function (e) {
    e.preventDefault();

    repo_editor
      .message( 'Are you sure you wish to remove this record?' )
      .buttons( { "label": "Delete", "fn": function () { repo_editor.submit() } } )
      .remove( $(this).closest('tr') );
  } );

  $('#repoTable').DataTable( {
    dom        : "Tfrtip",
    processing : true,
    serverSide : true,
    ajax: {
      "url" : "/admin/repo/forupload/" + uploadID,
      "data" : {
          "sSearch_1" : "Brahe1"
      }
    },
    columns: [
      {
        data: null, 
        className: "center",
        render: function ( data, type, row ) {
          var editfield = '<a href="'  ;
          editfield += '" class="repo_editor_edit">Edit</a>';
          //if ( data.manifestations == null ) {
            editfield +='/ <a href="" class="repo_editor_remove">Delete</a>';
          //}
          return editfield;
        } 
      },
      //{ data: "upload_id"  },
      //{ data: "institution_id" },
      { data: "institution_name" },
      { data: "institution_city" },
      { data: "institution_country" },
      { data: "institution_synonyms" },
      { data: "institution_city_synonyms" },
      { data: "institution_country_synonyms" }
    ],
    tableTools: {
      sRowSelect: "os",
      aButtons: [
      { sExtends: "editor_create", editor: repo_editor },
      { sExtends: "editor_edit",   editor: repo_editor },
      { sExtends: "editor_remove", editor: repo_editor }
      ]
    }
  } );
} );

// Functions =============================================================