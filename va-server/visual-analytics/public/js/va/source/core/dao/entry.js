import { ProjectDao, FileDao, VersionDao } from './index';

window.__module__ = window.__module__ || {};
window.__module__.Dao = window.__module__.Dao || {};

var Dao = window.__module__.Dao;
Dao.ProjectDao = ProjectDao;
Dao.FileDao = FileDao;
Dao.VersionDao = VersionDao;
