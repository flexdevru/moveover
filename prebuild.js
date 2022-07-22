var fs = require('fs');
var path = require('path');

var target = './src/utils/CompilationParams.ts';
var date = new Date();
var year = date.getFullYear();
var month = date.getMonth() + 1;
var day = date.getUTCDate();
var hours = date.getUTCHours();
var minutes = date.getMinutes();
var seconds = date.getSeconds();
if (day < 10) day = '0' + day;
if (month < 10) month = '0' + month;
if (hours == 0) hours = '00';
else if (hours < 10) hours = '0' + hours;
if (minutes == 0) minutes = '00';
else if (minutes < 10) minutes = '0' + minutes;
if (seconds == 0) seconds = '00';
else if (seconds < 10) seconds = '0' + seconds;
var res = day + '.' + month + '.' + year + ' ' + hours + ':' + minutes + ':' + seconds + ' UTC';
res = 'export class CompilationParams { public static COMPILATION_DATE: string = "' + res + '"; }';
fs.writeFileSync(target, res);
console.log('-> build date created...');

//----- fonts ------
var src = './fonts/fonts.css';
var target = './src/utils/FontsParams.ts';

var css_text = fs.readFileSync(src, { encoding: 'utf8', flag: 'r' });

var cssjs = require('jotform-css.js');
var parser = new cssjs.cssjs();
var parsed = parser.parseCSS(css_text);

var fonts_res = [];

for (var i = 0; i < parsed.length; i++)
{
  var rules = parsed[i].rules;
  for (var j = 0; j < rules.length; j++)
  {
    if (rules[j].directive == 'font-family')
    {
      var value = rules[j].value.split('\'').join('');
      fonts_res.push(value);
    }
  }
}

var res = 'export class FontsParams { public static FONTS: Array<string> = ' + JSON.stringify(fonts_res) + '; }';
fs.writeFileSync(target, res);
console.log('-> fonts parsed...');


//----- images ------

const images_folder = './data/images/';
target = './configs/images.json';

var tmp = images_folder.split('/').join('\\').substring(2);
var res = {};

function fileList(dir)
{
  return fs.readdirSync(dir).reduce(function (list, file)
  {
    var name = path.join(dir, file);
    var isDir = fs.statSync(name).isDirectory();
    return list.concat(isDir ? fileList(name) : [name]);
  }, []);
}

var list = fileList(images_folder);

for (var i = 0; i < list.length; i++)
{
  var file_path = list[i].split(tmp)[1];

  let index = file_path.lastIndexOf('\\');
  file_name = file_path.substr(index + 1);

  index = file_name.lastIndexOf('.');
  file_name = file_name.substr(0, index);

  res[file_name] = file_path.split('\\').join('/');

}

fs.writeFileSync(target, JSON.stringify(res));
console.log('-> images parsed...');

//----- sounds ------

const sounds_folder = './data/sounds/';
target = './configs/sounds.json';

var tmp = sounds_folder.split('/').join('\\').substring(2);
var res = {};

function fileList(dir)
{
  return fs.readdirSync(dir).reduce(function (list, file)
  {
    var name = path.join(dir, file);
    var isDir = fs.statSync(name).isDirectory();
    return list.concat(isDir ? fileList(name) : [name]);
  }, []);
}

if (fs.existsSync(sounds_folder))
{
  var list = fileList(sounds_folder);

  for (var i = 0; i < list.length; i++)
  {
    var file_path = list[i].split(tmp)[1];

    let index = file_path.lastIndexOf('\\');
    file_name = file_path.substr(index + 1);

    index = file_name.lastIndexOf('.');
    file_name = file_name.substr(0, index);

    res[file_name] = file_path.split('\\').join('/');
  }
}

fs.writeFileSync(target, JSON.stringify(res));
console.log('-> sounds parsed...');

//----- configs ------

const configs_folder = './configs/';
target = './src/utils/Data.ts';
tmp = configs_folder.split('/').join('\\').substring(2);

var res = '';


var list = fileList(configs_folder);

for (var i = 0; i < list.length; i++)
{
  var file_path = list[i].split(tmp)[1];

  let index = file_path.lastIndexOf('\\');
  file_name = file_path.substr(index + 1);

  index = file_name.lastIndexOf('.');
  file_name = file_name.substr(0, index);

  file_path = file_path.split('\\').join('/');
  var file_data = fs.readFileSync(configs_folder + file_path, 'utf8');

  file_data = JSON.parse(file_data);
  file_data = JSON.stringify(file_data);

  var file = '\tpublic static ' + file_name + ': string = \'' + Buffer.from(file_data).toString('base64') + '\';\n';
  res = res + file;
}
res = 'export class Data\n{\n' + res + '\n}';
fs.writeFileSync(target, res);

console.log('-> configs parsed...');

//----- variables ------

const variables = 'var showhelp_var = "%task%_showhelp";\nvar completed_var = "%task%_completed";\nvar store_var = "%task%_store";';
target = './src/variables.js';

var parts = process.cwd().split('\\');
var task = parts[parts.length - 1];
var res = variables.split('%task%').join(task);

fs.writeFileSync(target, res);

console.log('-> variables created...');