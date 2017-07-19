'use strict';

module.exports = function parse(output, options) {
  options = options || {};
  let separator = options.separator || ' ';
  let lines = output.split('\n');

  if (options.skipLines > 0) {
    lines.splice(0, options.skipLines);
  }

  let headers = lines.shift();
  let splitHeader = headers.split(separator);

  let limits = [];
  let countI = 0;
  let totalChar = 0;
  for (let i = 0; i < splitHeader.length; i++) {
    let colName = splitHeader[i].trim();
    totalChar = totalChar + 1;
    console.log('totalChar', totalChar)
    if (colName !== '') {
      if (countI == 0) {
        limits.push({
          label: colName,
          start: countI
        });
        totalChar = totalChar + colName.length;
        countI = colName.length + i;
      } else {
        console.log('colName', colName)
        console.log('i', i)
        console.log('countI', countI)
        console.log('totalChar', totalChar)
        limits.push({
          label: colName,
          start: countI
        });
        totalChar = totalChar + colName.length;
        countI = countI + colName.length + i;
      }

    }

  }
  console.log('limits', limits)
  let table = lines.map(function(line) {
    if (line) {
      let result = {};

      for (let key in limits) {
        let header = limits[key];

        let nextKey = parseInt(key) + 1;
        let start = header.start;
        let end = (limits[nextKey]) ? limits[nextKey].start : undefined;
        // console.log('header:', header, 'limits[key]:', limits[key])
        // console.log('nextKey:' + nextKey, 'limits[nextKey]:', limits[nextKey])

        result[header.label] = line.substr(start, end).trim();
        // console.log('start:' + start, 'end:' + end)
        // console.log(header.label, result[header.label])
      }

      return result;
    }
  });

  (table[table.length - 1] === undefined) && table.pop();

  return table;
};
