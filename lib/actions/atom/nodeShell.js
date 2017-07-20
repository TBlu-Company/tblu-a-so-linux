'use strict';

module.exports = function parse(output, options, header) {
  options = options || {};
  let separator = options.separator || ' ';
  let lines = output.split('\n');

  if (options.skipLines > 0) {
    lines.splice(0, options.skipLines);
  }
  let limits = [];
  if (header) {
    limits = header;
    if (options.removeHeader) {
      lines.shift();
    }
  } else {
    let headers = lines.shift();
    let splitHeader = headers.split(separator);

    let tmp = false;
    let chars = 0;
    let start = 0;
    let end = 0;
    let tempColName = '';
    let charsAdd = 0;
    // console.log('splitHeader', splitHeader)
    for (let i = 0; i < splitHeader.length; i++) {
      let colName = splitHeader[i].trim();
      if (colName !== '') {
        if ((start > end) && !tmp) {
          chars = 0;
          tmp = true;
          tempColName = colName;
        } else {
          if (tmp) {
            chars += tempColName.length
            limits.push({
              label: tempColName,
              start: start,
              chars: chars
            });
            start = end + tempColName.length + 1;
            chars = 0;
            tmp = false;
          }
        }
        if (end > start) {
          charsAdd += colName.length;
          chars += colName.length
          limits.push({
            label: colName,
            start: start,
            chars: chars
          });
          start = end + charsAdd + 1;
          chars = 0;
        }
        if (i == splitHeader.length - 1) {
          limits.push({
            label: colName,
            start: start,
            chars: undefined
          });
        }
      } else {
        end += 1;
        chars += 1;
      }
    }
  };

  let table = lines.map(function(line) {
    if (line) {
      let result = {};
      for (let key in limits) {
        let header = limits[key];
        let start = header.start;
        let end = header.chars;
        let tmp = line.substr(start, end).trim();
        if (typeof header.type == 'undefined') {
          if (isNaN(tmp)) {
            if (Date.parse(tmp)) {
              result[header.label] = new Date(tmp).getTime()
            } else {
              result[header.label] = tmp
            }
          } else {
            result[header.label] = Number(tmp);
          }
        } else {
          if (header.type == 'nummber') {
            result[header.label] = Number(tmp);
          } else if (header.type == 'date') {
            result[header.label] = new Date(tmp).getTime()
          } else {
            result[header.label] = tmp
          }
        };

      }

      return result;
    }
  });
  (table[table.length - 1] === undefined) && table.pop();
  return table;
};
