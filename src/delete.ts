import when = require('when');

import transform_files from '../util/files';
import run from '../util/run';
import { ISwitches } from '../util/switches';

/**
 * Delete content to an archive.
 * @promise Delete
 * @param archive {string} Path to the archive.
 * @param files {string|array} Files to add.
 * @param options {Object} An object of acceptable options to 7za bin.
 * @resolve {array} Arguments passed to the child-process.
 * @reject {Error} The error as issued by 7-Zip.
 */
export default function delete_from_archive(archive: string, files_: string[] | string, options?: ISwitches): when.Deferred<string[]> {
  //return when.promise(function (resolve, reject) {
  let defer = when.defer<string[]>();

  // Convert array of files into a string if needed.
  let files = transform_files(files_);

  // Create a string that can be parsed by `run`.
  var command = '7z d "' + archive + '" ' + files;

  // Start the command
  run(command, options)
    .promise.then((resolve_value) => {
      return defer.resolve(resolve_value);
    }, (reject_reason) => {
      return defer.reject(reject_reason);
    });

  return defer;
};
