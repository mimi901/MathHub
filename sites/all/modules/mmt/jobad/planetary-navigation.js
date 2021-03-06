/*************************************************************************
* This file is part of the MathHub.info System  (http://mathhub.info).   *
* It is hosted at https://github.com/KWARC/MathHub                       *
* Copyright (c) 2015 by the KWARC group (http://kwarc.info)              *
* Licensed under GPL3, see http://www.gnu.org/licenses/gpl.html          *
**************************************************************************/

(function($){

var planetaryNavigation = {
	info: {
		'identifier' : 'kwarc.mmt.planetary.navigation',
		'title' : 'MMT Navigation Service in Planetary',
		'author': 'MMT developer team',
		'description' : 'The navigation service for browsing MMT repositories in Planetary',
		'version' : '1.0',
		'dependencies' : [],
		'hasCleanNamespace': false
	},
  

    leftClick: function(target, JOBADInstance) {
    	//navigate only for when data-relative is set (i.e. for virtdocs where links were relative)
    	//TODO: now after URI fix (removed /source/) this should be refactored (attr renamed)
		if(target.hasAttribute(mmtattr.symref) && target.hasAttribute('data-relative')) {
			var uri = target.attr(mmtattr.symref);
			var uriEnc = planetary.relNavigate(uri);
		}

		//disable this for now, context menu navigation should be enough
		/*var flag = target.hasAttribute(mmtattr.symref);
		if(target.parent().hasAttribute(mmtattr.symref)) {
			var url = planetary.URIToURL(target.parent().attr(mmtattr.symref));
			window.location = url;
		}
		*/
		return false;
    },

    contextMenuEntries: function(target, JOBADInstance) {
    	var res = {};
		if (target.hasAttribute(mmtattr.symref)) {			
			var mr = $(target).closest('mrow');
			var select = (mr.length === 0) ? target : mr[0];
			mmt.setSelected(select);
			var uri = target.attr(mmtattr.symref);
			var me = this;
			var lang = locale.getLanguage(target);
			var goDeclS = locale.translate("Go To Declaration", lang);
			var showDefS = locale.translate("Show Definition", lang);
			
			res[goDeclS] = function() {planetary.navigate(uri);};
			if (uri.match(/\?/g).length >= 2) {	
				res[showDefS] = function() {
					$.ajax({ 
						'url': mmtUrl + "/:planetary/getRelated",
	   	  				'type' : 'POST',
				    	'data' : '{ "subject" : "' + uri + '",' + 
				    		'"relation" : "isDefinedBy",' + 
				    		'"return" : "planetary"}',
				    	'dataType' : 'html',
				    	'processData' : 'false',
		       			'contentType' : 'text/plain',
		            	'crossDomain': true,
	                	'success': function cont(data) {
		                  	var elem = $("#def_lookup_content");
		                  	var result = me.parseServerResponse(data);
		                  	if (elem.length == 0) { //not exists => creating modal 
			          			$('<div id="def_lookup_main">')
			          				.addClass('modal fade')
			          				.attr({
			          					'tabindex':'-1', 
			          					'role':"dialog"
			          				})
			      				.append(
			      					$('<div>')
			  						.addClass("modal-dialog")
			      					.append(
			      						$('<div id="def_lookup_content">')
			      							.addClass("modal-content")
			      							.append(
			      								$('<div>')
				      								.addClass("modal-header")
				      								.append(
				      									$("<button>")
				      										.addClass("close")
				      										.attr({
				      											"type":"button", 
				      											"data-dismiss":"modal", 
				      											"aria-label":"Close"})
				      										.append(
				      											$("<span>")
				      												.attr("aria-hidden","true")
				      												.html("&times;")
				      										)
				      								)
				      								.append(
		      											$("<h4>")
		      												.addClass("modal-title")
		      												.attr("id", "definition-title")
		      										)
			      							)
			      							.append(
			      								$("<div>")
			      									.addClass("modal-body")
			      									.attr("id", "definition-content")
			      							)
			      					)
			      				).appendTo('body');
			      			}
		      			 	//updating content
		      				$("#definition-title").html(result['title']);

		      				if (result['content']) {
		      					$("#definition-content").html(me.buildTabs(result['content']));
		      				} else {
		      					$("#definition-content").html("<div class=\"error\">Not found</div>");
		      				}

		      				$("#def_lookup_main").modal();
		                 },
	                  	'error' : function( reqObj, status, error ) {
							console.log( "ERROR:", error, "\n ",status );
			    	  	},
	                });
				};
			}
		}
		return res;
	},
	
	/**
	* @param response Response from MMT server
	* @return JS object 
	*			title The title of definition
	*			content The content as JS object (to use in buildTabs()) or 
	*					false if no definition found
	*/
	parseServerResponse: function(response) {
		var subject = $(response).attr("data-subject");
		var definitions = $(response).find("result");
		var result = {};
		result['title'] = subject;
		if (definitions.length <= 0) {
			result['content'] = false;
		} else {
			var content = {};
			jQuery.each(definitions, function(key, definition) {
				var lang = $(definition).attr("data-lang");
				content[lang] = $(definition).html();
			});
			result['content'] = content;
		}
		return result;
	},

	/**
	 * @param data Object where key is tab title and value is content of the tab
	 * @return JS object of the bootstrap implementation of tabs
	 * first pair is active by default
	 */
	buildTabs: function(data) {
		var out = $("<div>");
		var navs = $("<ul>").addClass("nav nav-tabs").attr("role", "tablist");
		var tabs = $("<div>").addClass("tab-content");
		var active = true;
		$.each(data, function(title, content) {
			var nav = $("<li>")
				.attr("role", "presentation")
				.append(
					$("<a>")
						.attr({
							"href":"#" + title,
							"aria-controls":title,
							"role":"tab",
							"data-toggle":"tab",
						})
						.html(title)
				);
			var tab = $("<div>")
				.addClass("tab-pane")
				.attr({
					role:"tabpanel",
					id:title
				})
				.html(content);
			
			if (active) {
				nav.addClass("active");
				tab.addClass("active");
				active = false;
			}

			navs.append(nav);
			tabs.append(tab);
		});
		out.append(navs).append(tabs);
		return out;
	},
    
};

JOBAD.modules.register(planetaryNavigation);
})(jQuery);
	