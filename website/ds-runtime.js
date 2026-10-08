/* Moda DS runtime for preview cards & UI kits: loads component .jsx sources, transpiles, exposes window.Moda. */
(function(){ try {
  var base = (document.currentScript && document.currentScript.src || location.href).replace(/[^/]*$/, '');
  var files = ['core/Icon','brand/Wordmark','brand/Eyebrow','brand/ImageFrame','core/Button','core/IconButton','core/Badge','core/Tag','core/Avatar',
    'forms/Input','forms/Select','forms/Checkbox','forms/Radio','forms/Switch',
    'surfaces/Card','surfaces/Dialog','surfaces/Tooltip','surfaces/Toast','surfaces/Stat','navigation/Tabs'];
  var names = [], src = '';
  files.forEach(function(p){
    var x = new XMLHttpRequest(); x.open('GET', base + 'components/' + p + '.jsx', false); x.send();
    var code = x.responseText.replace(/^import .*$/gm, '').replace(/^export function (\w+)/gm, function(m, n){ names.push(n); return 'function ' + n; });
    src += '\n' + code;
  });
  src = '(function(React){' + src + '\nreturn {' + names.join(',') + '};})';
  var out = Babel.transform(src, { presets: ['react'] }).code;
  window.Moda = Object.assign(window.Moda || {}, (0, eval)(out)(React));
} catch (e) { console.error('[ds-runtime]', e && e.message, e && e.stack); } })();
