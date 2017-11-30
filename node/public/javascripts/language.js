console.log("loading language.js");
var langLI = new Object();
var rlangLI = new Object();
var language_editor; // use a global for the submit and return data rendering in the examples

// Load the language select array
langLoad("initialise");

// DOM Ready =============================================================
$(document).ready(function() {
  console.log("readying language.js");
  
// DataTable Editor ======================================================
  language_editor = new $.fn.dataTable.Editor( {
    ajax: {
      create: {
        type: 'POST',
        url:  '/work/work/'+workID+'/language/'
      },
      edit: {
        type: 'PUT',
        url:  '/work/work/'+workID+'/language/_id_'
      },
      remove: {
        type: 'DELETE',
        url:  '/work/work/'+workID+'/language/_id_'
      }
    },
    "table": "#languageTable",
    idSrc: "_id",
    "fields": [
      {
        "label": "language_code",
        "name" : "language_name",
        "type" : "hidden"
      },
      {
        "label": "Language",
        "name" : "language_code",
        "type" : "select",
        "ipOpts": langLI
      },
      {
        "label": "Note",
        "name": "language_note",
        "type": "hidden"
      }    
    ]
  } );

  // New record
  $('a.language_editor_create').on('click', function (e) {
    e.preventDefault();

    // Load the language select array
    langSelect("Eaa");
    
    language_editor
      .title( 'Add new language' )
      .buttons( { "label": "Add", "fn": function () { language_editor.submit() } } )
      .create();
  } );

  // Edit record
  $('#languageTable').on('click', 'a.language_editor_edit', function (e) {
    e.preventDefault();
    
    // Load the language select array
    langSelect("Baa");
    language_editor
      .title( 'Edit language entry' )
      .buttons( { "label": "Update", "fn": function () { language_editor.submit() } } )
      .edit( $(this).closest('tr') );
  } );

  // Delete a record (without asking a user for confirmation for this example)
  $('#languageTable').on('click', 'a.language_editor_remove', function (e) {
    e.preventDefault();
    language_editor
      .message( 'Are you sure you wish to remove this record?' )
      .buttons( { "label": "Delete", "fn": function () { language_editor.submit() } } )
      .remove( $(this).closest('tr') );
  } );

  $('#languageTable').DataTable( {
    dom        : "Tfrtip",
    processing : true,
    serverSide : true,
    ajax: {
      "url" : "/work/language/"  + workID,
      "data" : {
          "sSearch_1" : ""
      }
    },
    columns: [
      {
        data: null, 
        className: "center",
        render: function ( data, type, row ) {
          var editfield = '<a href="'  ;
          editfield += '" class="language_editor_edit">Edit</a>';
            editfield +='/ <a href="" class="language_editor_remove">Delete</a>';
          return editfield;
        } 
      },
      {
        "data": "language_code",
        render: function ( data, type, row ) {
          console.log("render - language_code", data, type, row )
          console.log("editfield = ",rlangLI[ data ] , " : " ,data  )
          var editfield = rlangLI[ data ] + " : " + data ;
          return editfield;
        } 
      },
      //{ "data": "language_note"  }
    ],
    tableTools: {
      sRowSelect: "os",
      aButtons: [
      { sExtends: "editor_create", 
        "fnClick": function ( nButton, oConfig, oFlash ) {
          console.log("fnclick", nButton, oConfig, oFlash)
          // Load the language select array
          langSelect("Aaa");
          // Invoke the language_editor (new)
          language_editor
          .title( 'Create new record' )
          .buttons( { "label": "Add", "fn": function () { language_editor.submit() } } )
          .create();
        },
      },
      { sExtends: "editor_edit",   editor: language_editor },
      { sExtends: "editor_remove", editor: language_editor }
      ]
    }
  } );

  $( 'select', language_editor.node( 'language_code' ) ).on( 'change', function () {
    console.log("language_editor.node value:",this  );
    //langSelect("Caa");
  } );  
  
  
} ); // End Document ready

// Functions =============================================================

function langLoad(reqterm) {
  console.log("langLoad");
  var strHTMLOutput = '';
  $.ajax('/autocomplete/' + 'language/' + reqterm, {
    dataType: 'json',
    error: function(){
      console.log("ajax error :(");
    },
    success: function (obj) {
      var data = obj.data;
      //console.log(data);
      if (data.length > 0) {
        if (data.status && data.status === 'error'){
          strHTMLOutput = "<li>Error: " + data.error + "</li>";
        } else {
          var intItem,
         totalItems = data.length,
         arrLI = [];
         for (intItem = 0 ; intItem < totalItems; intItem++) {
           langLI[ data[intItem].language_name ] = data[intItem].language_code;
           rlangLI[ data[intItem].language_code ] = data[intItem].language_name;
         }
         console.log("ajax success langLi",langLI);
         //callback;
         //strHTMLOutput = "<li>" + arrLI.join('</li><li>') + "</li>";
        }
      }else{
        strHTMLOutput = "<li>You haven't created any languages yet</li>";
      }
      //$('#myworks').html(strHTMLOutput);
    }
  });
}

function langSelect(reqterm) {
  console.log("langselect ",reqterm);
  language_editor.field('language_code').update( langLI );
}