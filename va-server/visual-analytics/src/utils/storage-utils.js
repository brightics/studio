
const StorageUtils = {
  getValue: function (key) {
    let value = StorageUtils.DEFAULT_SETTINGS[key]; // default value

    if (typeof (Storage) !== 'undefined') {
      value = localStorage.getItem(key) !== null ? localStorage.getItem(key) : value;
    } else {
      value = typeof ($.cookie(key)) !== 'undefined' ? $.cookie(key) : value;
    }

    return value;
  },
  getCurrentLanguage: function () {
    return StorageUtils.getValue('common.locale');
  },
  setLanguage: function (lang) {
    StorageUtils.setValue('common.locale', lang);
  },
  setValue: function (key, value) {
    if (typeof (Storage) !== 'undefined') {
      localStorage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : value);
    } else {
      $.cookie(key, typeof value === 'object' ? JSON.stringify(value) : value);
    }
  },
  setToDefault: function (key) {
    if (typeof (Storage) !== 'undefined') {
      localStorage.removeItem(key);
    } else {
      $.removeCookie(key);
    }
  },
  clear: function () {
    if (typeof (Storage) !== 'undefined') {
      localStorage.clear();
    } else {
      for (var key in StorageUtils.DEFAULT_SETTINGS) {
        $.removeCookie(key);
      }
    }
  },
  DEFAULT_SETTINGS: {
    'common.scroll.indicate.mouseover': 'true',
    'common.locale': 'ko',
    'common.document.useonline': 'false',
    'common.document.onlinedocurl': '',
    'common.persist.mode': 'storage-mode',
    'editor.diagram.autoconnect': 'true',
    'editor.minimap.visible': 'true',
    'editor.function.add.doubleclick': 'true',
    'editor.variable.visible': 'true',
    'editor.datapanel.chart.table.pivotsinglerow': 'false',
    'editor.datapanel.defaultrowcount': '1000',
    'chart.table.formatter.use': 'false',
    'chart.table.formatter.double': '9',
    'chart.table.formatter.integer': '0',
    'chart.table.formatter.exponential': '2',
    'chart.table.formatter.type': 'number',
    'chart.table.formatter.pivot': 'false',
    'editor.maxfuncnum': '120',
    'editor.closePanelOnClick': 'true',
    'chart.style.selectedColorSet': 'Brightics',
    'chart.style.colorSet': JSON.stringify([
      {
        name: 'Brightics',
        colors: [
          '#FD026C', '#4682B8', '#A5D22D', '#F5CC0A', '#FE8C01', '#6B9494', '#B97C46',
          '#84ACD0', '#C2E173', '#F9DD5B', '#FE569D', '#FEB356', '#9CB8B8', '#D0A884',
          '#2E6072', '#6D8C1E', '#A48806', '#A90148', '#A95E01', '#476363', '#7B532F'
        ]
      },
      {
        name: 'Rainbow',
        colors: [
          '#FF0000', '#FF9D00', '#EEFF00', '#34B545', '#3E6DC4', '#4B0082', '#863DCC'
        ]
      }
    ])
  },
  SETTINGS: {}
};

export {
  StorageUtils
}