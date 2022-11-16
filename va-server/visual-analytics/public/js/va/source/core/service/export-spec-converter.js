/* -----------------------------------------------------
 *  export-spec-converter.js
 *  Created by hyunseok.oh@samsung.com on 2018-04-12.
 * ---------------------------------------------------- */

import { File, Version, Project } from '../vomodels/index';
import { ExportFilesSpec } from './export-files-spec';
import { ExportProjectSpec } from './export-project-spec';

/* global Brightics, _ */

const ExportSpecConverter = (function () {
    const coreConverterAPI = function (contents, version) {
        const ajax = $.ajax({
            url: 'api/va/v2/convert/store',
            type: 'POST',
            data: JSON.stringify({
                contents: contents,
                version: version,
            }),
            contentType: 'application/json; charset=utf-8',
        });
        return Promise.resolve(ajax)
            .then(function (result) {
                return result.contents;
            })
            .catch(function (err) {
                err.responseJSON.errors[0].mid = contents.mid;
                throw err;
            });
    };

    const wrapFile = function (contents) {
        const wrapped =
            new File()
                .setFileId(contents.mid)
                .setLabel(contents.title)
                .setDescription('')
                .setCreator(Brightics.VA.Env.Session.userId)
                .setContents(contents);
        return wrapped;
    };

    const wrapVersion = function (contents) {
        const wrapped =
            new Version()
                .setVersionId(contents.version_id)
                .setFileId(contents.mid)
                .setLabel(contents.title)
                .setTags(contents.versionTags)
                .setDescription(contents.versionDescription)
                .setType(contents.type)
                .setMajorVersion(_.has(contents, 'majorVersion') ?
                    contents.majorVersion :
                    contents.major_version)
                .setMinorVersion(_.has(contents, 'minorVersion') ?
                    contents.minorVersion :
                    contents.minor_version)
                .setCreator(Brightics.VA.Env.Session.userId)
                .setIsManual(true);

        wrapped.setContents(_.omit(contents, [
            'versionId',
            'versionTags',
            'versionDescription',
            'majorVersion',
            'minorVersion',
        ]));

        return wrapped;
    };

    const toFile = (f) => new File(f);
    const toVersion = (v) => new Version(v);

    const convertFilesSpec = function (oldfilesSpec, version) {
        const toFiles = (spec) => spec.data.map(_.property('data'));
        const contentsArray = (function () {
            if (!version) return _.isArray(oldfilesSpec) ? oldfilesSpec : [oldfilesSpec];
            return toFiles(oldfilesSpec).map(_.property('contents'));
        }());
        return Promise.all(_.map(contentsArray, (contents) => coreConverterAPI(contents, version)))
            .then(function (coreConverted) {
                const legacy = (cvt) => cvt.map((c) => (c.version_id ? wrapVersion : wrapFile)(c));
                const legacy2 = (cvt) => _.zip(toFiles(oldfilesSpec), cvt).map(([f, c]) => {
                    const to = c.version_id ? toVersion : toFile;
                    return to(Object.assign({}, f, { contents: c }));
                });
                const matchedLegacy = version ? legacy2 : legacy;
                const exp = new ExportFilesSpec(matchedLegacy(coreConverted));
                return exp.toJSON();
            });
    };

    const convertProjectSpec = function (projectSpec, version) {
        const [files, versions, project] = (function () {
            if (!version) {
                const adjust = (r) => _.merge({
                    contents: {
                        gv: [],
                    },
                }, r);
                return [
                    projectSpec[0].files.map(adjust),
                    projectSpec[0].versions.map(adjust),
                    new Project(_.omit(projectSpec[0], ['files', 'versions'])),
                ];
            }
            const [files, versions] = _.partition(projectSpec.children, _.matchesProperty('type', 'file'))
                .map((els) => els.map(_.property('data')));
            return [
                files,
                versions,
                new Project(projectSpec.data),
            ];
        }());
        
        if (!projectSpec.children && files.length === 0 && versions.length === 0 && projectSpec.data instanceof Array)  {
            throw new Error('Not a valid project file.');
        }

        const convertContents = function (el) {
            return coreConverterAPI(el.contents, version)
                .then(function (convertedContents) {
                    return _.assign({}, el, { contents: convertedContents });
                });
        };


        const getConverter = function (to) {
            return function (x) {
                return convertContents(x).then(to);
            };
        };

        return Promise.all([].concat(
            _.map(files, getConverter(toFile)),
            _.map(versions, getConverter(toVersion))
        )).then(function (convertedChildren) {
            return (new ExportProjectSpec(project, convertedChildren)).toJSON();
        });
    };

    return {
        convertFilesSpec: convertFilesSpec,
        convertProjectSpec: convertProjectSpec,
    };
}());

export { ExportSpecConverter };
