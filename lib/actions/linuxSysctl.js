'use strict'
const exec = require('child_process').exec;
const os = require('os');
const _ = require('lodash');

const formataValor = (valor) => new Promise((resolve, reject) => {
  try {
    let result = undefined;
    if (valor == '' || typeof valor == 'undefined' || valor == null) {
      result = valor;
      resolve(valor);
    } else if (!isNaN(valor)) {
      result = Number(valor);
      resolve(result);
    } else if (valor.toLowerCase() == 'false' || valor.toLowerCase() == 'true') {
      result = Boolean(valor);
      resolve(result);
    } else if ((valor.split('\t')).length > 1) {
      result = [];
      let pall = [];
      let arrayS = valor.split('\t');
      arrayS.forEach(v => {
        let t = v.replace(/ /g, '').trim();
        if (t.length >= 1) {
          pall.push(formataValor(v.trim()));
        };

      });
      Promise.all(pall).then(result2 => {
        result = result2;
        resolve(result);
      })
    } else {
      result = valor;
      resolve(result);
    }
  } catch (e) {
    reject(e);
  }
});

const formataObjetoSplit = (obj, valor) => new Promise((resolve, reject) => {
  try {
    let tempS = obj.split('.');
    if (tempS.length > 1) {
      let temp = {};
      let pall = [];
      tempS.forEach((o, i) => {
        pall.push(formataObjeto(temp, o.trim(), i, tempS.length, valor));
      });
      Promise.all(pall).then(result => {
        resolve(temp);
      }).catch(e => reject(e));
    } else {
      resolve(obj);
    }
  } catch (e) {
    reject(e);
  }
});

const formataObjeto = (obj, key, i, tamanho, valor) => new Promise((resolve, reject) => {
  try {
    if (Object.keys(obj).length === 0) {
      if (i < tamanho - 1) {
        obj[key] = {};
      } else {
        obj[key] = valor;
      }
      resolve(obj);
    } else {
      for (let k in obj) {
        formataObjeto(obj[k], key, i, tamanho, valor).then(result => {
          resolve(result);
        }).catch(e => reject(e));
      }
    }
  } catch (e) {
    reject(e);
  }
});

const formataLinha = (line, resultado) => new Promise((resolve, reject) => {
  let array = line.split('=');
  formataValor(array[1].substr(1, array[1].length)).then(valor => {
    if (valor.toString().length >= 1) {
      formataObjetoSplit(array[0], valor).then(mObj => {
        resultado = _.mergeWith(resultado, mObj, customizer);
        resolve(true);
      }).catch(e => reject(e));
    } else {
      resolve(true);
    }
  }).catch(e => reject(e));
})

function customizer(objValue, srcValue) {
  if (_.isArray(objValue)) {
    if (_.isArray(objValue[0])) {
      let temp = objValue;
      temp.push(srcValue);
      return temp;
    } else {
      let temp = [];
      temp.push(objValue);
      temp.push(srcValue);
      return temp;
    }
  } else {
    if (typeof objValue != 'undefined' && Object.keys(objValue).length === 0) {
      let temp = [];
      temp.push(objValue);
      temp.push(srcValue);
      return temp;
    }
  }
}

module.exports = (data) => new Promise((resolve, reject) => {
  try {
    exec("sysctl -a", function(err, stdout) {
      if (err) {
        reject(err);
      } else {
        let result = {};
        let lines = stdout.trim().split(os.EOL);
        let pall = lines.map(e => {
          return formataLinha(e, result);
        });
        Promise.all(pall).then(result1 => {
          resolve(result);
        }).catch(e => reject(e));
      }
    });
  } catch (e) {
    reject(e);
  };
});
