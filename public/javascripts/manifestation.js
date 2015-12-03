console.log("loading manifestation.js",uploadUuid);

var objLI = { "" : "" },
	robjLI = { "" : "" },
	letterType,rletterType,
	manifest_editor; // use a global for the submit and return data rendering in the examples

repoLoad( uploadUuid, uploadUuid );
  
// DOM Ready =============================================================
$(document).ready(function() {
  console.log("readying manifestation.js");
  letterLoad("initialise");
  
// DataTable Editor ======================================================
  manifest_editor = new $.fn.dataTable.Editor( {
    ajax: {
      create: {
        type: 'POST',
        url:  '/work/work/'+iworkID+'/manifestation/'
      },
      edit: {
        type: 'PUT',
        url:  '/work/work/'+iworkID+'/manifestation/_id_'
      },
      remove: {
        type: 'DELETE',
        url:  '/work/work/'+iworkID+'/manifestation/_id_'
      }
    },
	  "events": {
		  "onInitEdit": function () {
			  setTimeout( updateChosen, 50 );
		  }
	  },
	  "table": "#manifestationTable",
    idSrc: "_id",
    "fields": [ 
      //{ "label": "id","name": "id", "type": "text" },
      {
        "label": "upload_uuid",
        "name": "upload_uuid",
        "default": uploadUuid ,
        "type": "hidden"
      },
      {
        "label": "manifestation_id",
        "name": "manifestation_id",
        "type": "hidden"
      },
      {
        "label": "iwork_id",
        "name": "iwork_id",
        "default": iworkID ,
        "type": "hidden"
      },
/*      {
        "label": "union_manifestation_id",
        "name": "union_manifestation_id",
        "type": "hidden"
      },
*/      {
        "label": "Type",
        "name": "manifestation_type",
        "type": "select",
        "ipOpts": letterType
      },
      {
        "label" : "Either: Repository",
        "name"  : "repository_id",
        "type"  : "select",
        "ipOpts": objLI
      },
      {
        "label": "and Shelfmark",
        "name": "id_number_or_shelfmark",
        "type": "textarea"
      },
      {
        "label": "Or: Printed edition details",
        "name": "printed_edition_details",
        "type": "textarea"
      },
      {
        "label": "Manifestation notes",
        "name": "manifestation_notes",
        "type": "textarea"
/*      },
      {
        "label": "Image filenames",
        "name": "image_filenames",
        "default": "" ,
        "type": "hidden"
*/      }
    ]
  } );



  // New record
  $('a.editor_create').on('click', function (e) {
    e.preventDefault();

    // Load the repository select arrays
    repoSelect("create");
    
    manifest_editor
      .title( 'Create new record' )
      .buttons( { "label": "Add", "fn": function () { manifest_editor.submit() } } )
      .create();
  } );

  // Edit record
  $('#manifestationTable').on('click', 'a.manifest_editor_edit', function (e) {
    e.preventDefault();

    // Load the repository select arrays
    repoSelect("edit");
    
    manifest_editor
      .title( 'Edit manifestation: Enter either repository and shelfmark or printed edition details.' )
      
      .buttons( { "label": "Update", "fn": function () { manifest_editor.submit() } } )
      .edit( $(this).closest('tr') );

	  updateChosen();
  } )

  // Delete a record (without asking a user for confirmation for this example)
  .on('click', 'a.manifest_editor_remove', function (e) {
    e.preventDefault();

    manifest_editor
      .message( 'Are you sure you wish to remove this record?' )
      .buttons( { "label": "Delete", "fn": function () { manifest_editor.submit() } } )
      .remove( $(this).closest('tr') );
  } )

  .DataTable( {
    dom        : "Tfrtip",
    processing : true,
    serverSide : true,
    ajax: {
      "url" : "/work/manifestation/" + uploadUuid+ '/' + iworkID,
      "data" : {
          "sSearch_1" : "Brahe1"
      }
    },
    columns: [
      {
        data: null, 
        className: "center",
        render: function (  ) {
          var editField = '<a href="'  ;
            editField += '" class="manifest_editor_edit">Edit</a>';
            editField +='/ <a href="" class="manifest_editor_remove">Delete</a>';
          return editField;
        }        
      },
      { "bVisible": false, "data": "upload_uuid"  },
      { "bVisible": false, "data": "manifestation_id"      },
      { "bVisible": false, "data": "iwork_id"   },
      //{ "bVisible": false, "data": "union_manifestation_id" },
      { "data": "manifestation_type", 
        render: function ( data ) {
          return rletterType[ data ] + " : " + data ;
        }         
      },
      { "data": "repository_id",
        render: function ( data ) {
          return robjLI[ data ] + " : " + data ;
        } 
      },
      { "data": "id_number_or_shelfmark" },
      { "data": "printed_edition_details" },
      { "data": "manifestation_notes"   }
      //,{ "data": "image_filenames" }
    ],
    tableTools: {
      sRowSelect: "os",
      aButtons: [
        { sExtends: "editor_create",
          "fnClick": function ( ) {

            // Load the repository select arrays
            repoSelect("create");

            // Invoke the manifest-editor (new)
            manifest_editor
            .title( 'New manifestation: Enter either repository and shelfmark or printed edition details.' )
            .buttons( { "label": "Add", "fn": function () { manifest_editor.submit() } } )
            .create();

	          updateChosen();
          },
          editor: manifest_editor 
        },
        { sExtends: "editor_edit",   editor: manifest_editor },
        { sExtends: "editor_remove", editor: manifest_editor }
      ]
    }
  } );
  
} );// End Document ready

// Functions =============================================================

function updateChosen() {
	$("#DTE_Field_repository_id").chosen({
		no_results_text: "No repository found.",
		allow_single_deselect: true,
		width: "150%",
		placeholder_text_single : "Repository...",
		search_contains : true
	})
		.trigger("chosen:updated");
}

function repoLoad(upload_uuid,reqterm) {
  //console.log("repoLoad");
  var strHTMLOutput = '';
  $.ajax('/autocomplete/' + 'repository/' + upload_uuid + '/' + reqterm, {
    dataType: 'json',
    error: function(){
      console.error("ajax error :(");
    },
    success: function (obj) {
      var data = obj.data;

      if (data.length > 0) {
        if (data.status && data.status === 'error'){
          strHTMLOutput = "<li>Error: " + data.error + "</li>";
        } else {
          var intItem,label,value,
            totalItems = data.length;
          for (intItem = 0 ; intItem < totalItems; intItem++) {
            label = (data[intItem].label||"(No city)")+data[intItem].label2;
            value = data[intItem].value;
            objLI[ label ] = value;
            robjLI[ value ] = label;
          }

        }
      }else{
        strHTMLOutput = "<li>You haven't created any works yet</li>";
      }
    }
  });
}

function repoSelect() {
  manifest_editor.field('repository_id').update( objLI );
  manifest_editor.field('manifestation_type').update( letterType );
}

function letterLoad() {

  letterType =  {
      "Letter"      : "ALS"
//    , "Digital"     : "Dig"
    , "Draft"       : "D"
    , "Extract"     : "E"
    , "Other"       : "O"
    , "Printed copy": "P"
    , "Scribal copy": "S"
  };

  rletterType = {};
  for(var key in letterType) {
    var val = letterType[key];
    rletterType[val] = key;
  }

  
}