/* -----------------------------------------------------
 *  entry.js
 *  Created by hyunseok.oh@samsung.com on 2018-02-13.
 * ----------------------------------------------------*/

import { Controls } from '../public/js/va/source/core/components/controls/index';
import { ProjectDao, FileDao, VersionDao, DatasourceDao } from '../public/js/va/source/core/dao/index';
import { HashMap, ProjectTree, TreeNode } from './data-structures/index';
import { ResourceManager } from '../public/js/va/source/core/resource-manager/resource-manager';
import { FnUnitUtils } from './fnunit/fnunit-utils';
import { FnUnitInputs } from './fnunit/fnunit-inputs';
import { KeyItems } from './fnunit/key-items';
import { StatusBoard } from './board/status-board';
import { EventEmitter } from './event-emitter/event-emitter';
import { Project, File, Version, PROP_KEY } from '../public/js/va/source/core/vomodels/index';
import { inherits } from './utils/inherits';
import IDGenerator from './idgenerator';
import { ResourceService } from '../public/js/va/source/core/service/index';
import { serial, parallel } from './utils/promise-utils';
import { get, updateProp, addProp, removeProp } from './utils/object-utils';
import crel from 'crel';
import { TabChannel } from './tab-channel/tab-channel';
import { DATA_TYPES } from './const/data-types';
import { modelDiff } from './model-diff/model-diff';
import * as ENV from './const/env';
import { languagePack } from './locale';
import { StorageUtils } from  './utils/storage-utils';

const langCode = StorageUtils.getValue('common.locale') || 'ko';
const locale =  languagePack[langCode];

// import './data-structures/entry';

/* global _ */

window.__module__ = window.__module__ || {};

window.brtc_require = function (moduleName) {
    return window.__module__[moduleName];
};

var attach = function (key, obj) {
    window.__module__[key] = window.__module__[key] || {};
    window.__module__[key] = obj;
};

attach('DataStructures', {
    HashMap: HashMap,
    ProjectTree: ProjectTree,
    TreeNode: TreeNode
});

attach('Dao', {
    ProjectDao: ProjectDao,
    FileDao: FileDao,
    VersionDao: VersionDao,
    DatasourceDao: DatasourceDao
});

attach('Controls', Controls);
attach('ResourceManager', ResourceManager);
attach('FnUnitUtils', FnUnitUtils);
attach('FnUnitInputs', FnUnitInputs);
attach('StatusBoard', StatusBoard);
attach('KeyItems', KeyItems);
attach('Vo', {
    Project: Project,
    File: File,
    Version: Version,
    PROP_KEY: PROP_KEY
});

_.forIn(PROP_KEY, function (val, key) {
    window[key] = val;
});

attach('EventEmitter', EventEmitter);

attach('ClassUtils', {
    inherits: inherits
});

attach('IDGenerator', IDGenerator);
attach('ResourceService', ResourceService);
attach('PromiseUtils', {
    serial: serial,
    parallel: parallel
});

attach('ObjectUtils', {
    get: get,
    updateProp: updateProp,
    addProp: addProp,
    removeProp: removeProp
});

attach('_', _);

window.crel = crel;
attach('crel', crel);

attach('TabChannel', TabChannel);
attach('DATA_TYPES', DATA_TYPES);
attach('modelDiff', modelDiff);
attach('ENV', ENV);
attach('locale', locale);
attach('StorageUtils', StorageUtils);