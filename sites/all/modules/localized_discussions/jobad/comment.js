(function($){

var planetaryNavigation = {
	info: {
		'identifier' : 'kwarc.mmt.localized_discussions',
		'title' : 'Localized Discussions',
		'author': 'Mihnea Iancu',
		'description' : 'JOBAD support for localized discussions Planetary',
		'version' : '1.0',
		'dependencies' : [],
		'hasCleanNamespace': false
	},

    contextMenuEntries: function(target, JOBADInstance) {
      var commentTarget = target.closest("[id]");	
      var ld_xml_id = commentTarget.attr("id");
	  var ld_uri = '/node/add/local-discussion-question?xml_id=' + ld_xml_id + '&node_id=' + ld_nid;
	  var res = {
			'Discuss' : function() {window.open(ld_uri, '_blank');},
			};
	  return res;
	},
}


JOBAD.modules.register(planetaryNavigation);
})(jQuery);