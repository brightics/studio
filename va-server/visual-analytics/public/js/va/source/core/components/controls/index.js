
import { ListWrapper } from './list/listwrapper';
import { JqxListWrapper } from './list/jqxlistwrapper';
import { DropdownWrapper } from './dropdown/dropdownwrapper';
import { JqxDropdownWrapper } from './dropdown/jqxdropdownwrapper';
import { Base } from './base/base';
import { ControlFactory } from './base/controlfactory';

var Controls = {
    Wrapper: {
        ListWrapper: ListWrapper,
        JqxListWrapper: JqxListWrapper,
        DropdownWrapper: DropdownWrapper,
        JqxDropdownWrapper: JqxDropdownWrapper
    },
    Base: Base,
    ControlFactory: ControlFactory
};
export { Controls };
