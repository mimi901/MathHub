define(function(require) { return function(ace) { var core = require("scripts/core-cjucovschi-0.0.1"); core.setAce(ace); core.embbedText(core.getSelectedRange(), "\\textit\{", "}");
core.focus();
core.clearSelection();}});