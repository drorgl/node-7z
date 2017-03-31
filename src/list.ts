import path = require('path');
import when = require('when');

import run from '../util/run';
import { ISwitches } from "../util/switches";

interface ISpec {
  path?: string;
  type?: string;
  method?: string;
  physicalSize?: number;
  headersSize?: number;
  encrypted?: string;
}

interface IFileRecord {
  date: Date;
  attr: string;
  size: number;
  name: string;
}

/**
 * List contents of archive.
 * @promise List
 * @param archive {string} Path to the archive.
 * @param options {Object} An object of acceptable options to 7za bin.
 * @progress {array} Listed files and directories.
 * @resolve {Object} Tech spec about the archive.
 * @reject {Error} The error as issued by 7-Zip.
 */
export default function list_archive(archive: string, options?: ISwitches): when.Deferred<ISpec> {
  //return when.promise((resolve, reject) => {
  let defer = when.defer<ISpec>();

  let entries: IFileRecord[] = [];

  let spec: ISpec = {};
  /* jshint maxlen: 130 */
  let regex = /(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}) ([\.DHRSA]+)\s+(\d+)\s*(?:\d+)?\s+([\w\S\s]+)/;
  /* jshint maxlen: 80 */

  // Create a string that can be parsed by `run`.
  let command = '7z l "' + archive + '" ';

  let buffer = ""; //Store imcomplete line of a progress data.
  // Start the command
  run(command, options)

    // When a stdout is emitted, parse each line and search for a pattern. When
    // the pattern is found, extract the file (or directory) name from it and
    // pass it to an array. Finally returns this array.
    .promise.then((resolved_value) => {
      return defer.resolve(spec);
    }, (rejected_reason) => {
      return defer.reject(rejected_reason);
    }, (progress_data) => {
      // Last progress had an incomplete line. Prepend it to the data and clear
      // buffer.
      if (buffer.length > 0) {
        progress_data = buffer + progress_data;
        buffer = "";
      }

      progress_data.split('\n').forEach((line: string) => {
        line = line.trim();

        // Populate the tech specs of the archive that are passed to the
        // resolve handler.
        if (line.substr(0, 7) === 'Path = ') {
          spec.path = line.substr(7, line.length);
        } else if (line.substr(0, 7) === 'Type = ') {
          spec.type = line.substr(7, line.length);
        } else if (line.substr(0, 9) === 'Method = ') {
          spec.method = line.substr(9, line.length);
        } else if (line.substr(0, 16) === 'Physical Size = ') {
          spec.physicalSize = parseInt(line.substr(16, line.length), 10);
        } else if (line.substr(0, 15) === 'Headers Size = ') {
          spec.headersSize = parseInt(line.substr(15, line.length), 10);
        } else if (line.substr(0, 12) === 'Encrypted = ') {
          spec.encrypted = line.substr(12, line.length);
        } else {
          // Parse the stdout to find entries
          let res = regex.exec(line);
          if (res) {
            let return_date: Date;

            if (parseInt(res[1])) {
              return_date = new Date(res[1]);
            } else {
              return_date = null;
            }

            let e : IFileRecord = {
              date: return_date,
              attr: res[2],
              size: parseInt(res[3], 10),
              name: res[4].replace(path.sep, '/')
            };

            entries.push(e);
          }

          // Line may be incomplete, Save it to the buffer.
          else buffer = line;

        }

      });
      if (entries.length > 0){
        return defer.notify(entries);
      }
    });
  return defer;
}
