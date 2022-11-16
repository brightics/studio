/**
 * Created by jhoon80.park on 2016-01-27.
 */
(function () {
  "use strict";

  var root = this;

  var Brightics = root.Brightics;
  var PropertyControl = Brightics.VA.Core.Editors.Sheet.Controls.PropertyControl;

  ComboControl.prototype = Object.create(PropertyControl.prototype);

  function ComboControl(parentId, options) {
    PropertyControl.call(this, parentId, options);
  }

  ComboControl.prototype.setContents = function ($parents) {
    this.$contentsControl = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-combobox" style="margin: 10px;"/>');
    this.$contentsControl.jqxComboBox({
      theme        : Brightics.VA.Env.Theme,
      source       : this.options.value,
      selectedIndex: 0,
      height       : 25,
      width        : "85%"
    });

    if (this.options.value.length < 7) {
      this.$contentsControl.jqxComboBox({dropDownHeight: this.options.value.length * 25});
    }
    $parents.append(this.$contentsControl);

  };

  root.Brightics.VA.Core.Editors.Sheet.Controls.ComboControl = ComboControl;

}).call(this);
