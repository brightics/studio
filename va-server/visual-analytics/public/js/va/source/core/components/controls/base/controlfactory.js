/**
 * hyunseok.oh@samsung.com
 * 2018. 01. 23
 */

'use strict';
import { JqxListWrapper } from '../list/jqxlistwrapper';
import { JqxDropdownWrapper } from '../dropdown/jqxdropdownwrapper';

var ControlFactory = (function () {
    var createListControl = function ($parent, options) {
        return new JqxListWrapper($parent, options);
    };

    var createDropdownControl = function ($parent, options) {
        return new JqxDropdownWrapper($parent, options);
    };

    return {
        createListControl: createListControl,
        createDropdownControl: createDropdownControl
    };
}());

export { ControlFactory };
