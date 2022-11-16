/**
 * Created by gy84.bae on 2016-02-01.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function BluffPanel($parent, options) {
        this.$parent = $parent;
        this.options = options;
        this.createControls();
        // Brightics.VA.Core.Editors.Sheet.Panels.BasePanel.call(this, parentId, options);
    }

    // BluffPanel.prototype.createTopAreaControls = function ($parent) {
        // this.$header = $('' +
        //     '<div class="brtc-va-editors-sheet-panels-basepanel-header">' +
        //     '   <div class="brtc-va-editors-sheet-worksheet-selector"></div>' +
        //     '</div>' +
        //     '');

        // this.$selector = this.$header.find('.brtc-va-editors-sheet-worksheet-selector');
        // $parent.append(this.$header);

        // this.createTopAreaHeaderToolbar();

        // return this.$header;
    // };
                         
    BluffPanel.prototype.createControls = function () {
        this.$parent.addClass('brtc-style-flex-1');

        var $empty = $('<div class="brtc-va-editors-sheet-panels-basepanel-empty"></div>');
        this.$parent.append($empty);
        $empty.append('<h3>'+ this.options.label +'</h3');
        // this.createTopArea();
        // this.createContentsArea();
        // this.createBottomArea();

        // if (this.$topArea) {
        //     this.createTopAreaControls(this.$topArea);
        // }
        // if (this.$bottomArea) {
        //     this.createBottomAreaControls(this.$bottomArea);
        // }
        // if (this.$contentsArea) {
            // this.createContentsAreaControls(this.$contentsArea);
            // if (this.$contentsArea.hasClass('brtc-va-editors-sheet-panels-propertiespanel-contents-area')) {
            //     this.$contentsArea.perfectScrollbar();
            // }
        // }
    };

    Brightics.VA.Core.Editors.Sheet.Panels.BluffPanel = BluffPanel;
}).call(this);
