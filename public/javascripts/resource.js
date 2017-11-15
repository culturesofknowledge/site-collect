var resource_editor; // use a global for the submit and return data rendering in the examples

// DOM Ready =============================================================
$(document).ready(function() {
  console.log("readying resource.js");
  
// DataTable Editor ======================================================
  resource_editor = new $.fn.dataTable.Editor( {
    ajax: {
      create: {
        type: 'POST',
        url:  '/work/work/'+workID+'/resource/'
      },
      edit: {
        type: 'PUT',
        url:  '/work/work/'+workID+'/resource/_id_'
      },
      remove: {
        type: 'DELETE',
        url:  '/work/work/'+workID+'/resource/_id_'
      }
    },
    "table": "#resourceTable",
    idSrc: "_id",
    "fields": [
      {
        "label": "Resource name, e.g. Printed copy (editor name) on The Internet Archive",
        "name": "resource_name",
        "type": "text"
      },
      {
        "label": "Details (complete only if full bibliographic details not provided elsewhere in letter record)",
        "name": "resource_details",
        "type": "textarea"
      },
      {
        "label": "URL",
        "name": "resource_url",
        "type": "textarea"
      }    
    ]
  } );

  // New record
  $('a.editor_create').on('click', function (e) {
    e.preventDefault();

    resource_editor
      .title( 'Create new record' )
      .buttons( { "label": "Add", "fn": function () { resource_editor.submit() } } )
      .create();
  } );

  // Edit record
  $('#resourceTable').on('click', 'a.resource_editor_edit', function (e) {
    e.preventDefault();

    resource_editor
      .title( 'Edit resource' )
      .buttons( { "label": "Update", "fn": function () { resource_editor.submit() } } )
      .edit( $(this).closest('tr') );
  } );

  // Delete a record (without asking a user for confirmation for this example)
  $('#resourceTable').on('click', 'a.resource_editor_remove', function (e) {
    e.preventDefault();

    resource_editor
      .message( 'Are you sure you wish to remove this record?' )
      .buttons( { "label": "Delete", "fn": function () { resource_editor.submit() } } )
      .remove( $(this).closest('tr') );
  } );

  $('#resourceTable').DataTable( {
    dom        : "Tfrtip",
    processing : true,
    serverSide : true,
    ajax: {
      "url" : "/work/resource/" + workID,
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
          editfield += '" class="resource_editor_edit">Edit</a>';
          //if ( data.manifestations == null ) {
            editfield +='/ <a href="" class="resource_editor_remove">Delete</a>';
          //}
          return editfield;
        } 
      },
    //  { data: "iwork_id", "defaultContent": ""  },
    //  { "bVisible": false, "data": "upload_name"  },
    //  { "data": "resource_id"  },
      { "data": "resource_name"  },
      { "data": "resource_details" },
      { "data": "resource_url"   }
    ],
    tableTools: {
      sRowSelect: "os",
      aButtons: [
      { sExtends: "editor_create", editor: resource_editor },
      { sExtends: "editor_edit",   editor: resource_editor },
      { sExtends: "editor_remove", editor: resource_editor }
      ]
    }
  } );
} );

// Functions =============================================================