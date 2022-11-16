/**
 * Created by sds on 2017-07-17.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function Boat($parent, options) {
        this.$parent = $parent;
        this.options = {
            draggable: true,
            resizable: true
        };

        this.options = $.extend(true, this.options, options);

        this.init();
    }

    Boat.prototype.init = function () {
        this.createLayout();
        this.createContents();
    };

    Boat.prototype.getTitle = function () {
    };

    Boat.prototype.setPosition = function () {
    };

    Boat.prototype.createLayout = function () {
        var _this = this;

        this.$boatArea = $('' +
            '<div class="brtc-va-editors-diagram-minimap">' +
            '   <div class="brtc-va-editors-diagram-minimap-header">' +
            '       <div class="brtc-va-editors-diagram-minimap-title">'+ this.getTitle() +'</div>' +
            '       <div class="brtc-va-editors-diagram-minimap-collapse"><i class="fa fa-chevron-up" aria-hidden="true"></i></div>' +
            '   </div>' +
            '   <div class="brtc-va-editors-diagram-minimap-contents">' +
            '   </div>' +
            '</div>');
        this.$boat = this.$boatArea.find('.brtc-va-editors-diagram-minimap-contents');

        this.$parent.append(this.$boatArea);

        this.setPosition();

        if (this.options.draggable) {
            this.$boatArea.draggable({
                containment: 'parent',
                handle: '.brtc-va-editors-diagram-minimap-header',
                start: function () {
                    $(this).css('right', 'auto');
                },
                stop: function () {
                    var position = $(this).position();
                    if (position.left > $(this).parent().width() / 2) {
                        $(this).css('left', 'auto');
                        $(this).css('right', $(this).parent().width() - position.left - $(this).width());
                    }
                }
            });
        }

        if (this.options.resizable) {
            this.$boat.resizable({
                maxWidth: 1280,
                minWidth: 190,
                minHeight: 90,
                containment: '.brtc-va-editors-modeleditor-splitter',
                start: function (event, ui) {
                    _this.$boatArea.css('left', _this.$boatArea.position().left);
                    _this.$boatArea.css('right', 'initial');
                },
                stop: function (event, ui) {
                    var position = _this.$boatArea.position();
                    if (position.left > _this.$boatArea.parent().width() / 2) {
                        _this.$boatArea.css('left', 'initial');
                        _this.$boatArea.css('right', _this.$boatArea.parent().width() - position.left - _this.$boatArea.width());
                    }
                    _this.updateMiniMapWindow();
                }
            });
        }
        
        var $collapseButton = this.$boatArea.find('.brtc-va-editors-diagram-minimap-collapse');
        $collapseButton.on('click', function (event) {
            if ($collapseButton.find('i').hasClass('fa-chevron-down')) {
                $collapseButton.find('i').removeClass('fa-chevron-down');
                _this.$boat.removeClass('collapsed');
            }
            else {
                $collapseButton.find('i').addClass('fa-chevron-down');
                _this.$boat.addClass('collapsed');
            }
        });

        var $closeButton = this.$boatArea.find('.brtc-va-editors-diagram-minimap-close');
        $closeButton.on('click', function (event) {
            _this.$boatArea.addClass('closed');
        });
    };

    Boat.prototype.destroy = function () {
        this.$boatArea.remove();
    };
    Brightics.VA.Core.Editors.Diagram.Boat = Boat;

}).call(this);