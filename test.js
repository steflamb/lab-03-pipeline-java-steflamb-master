var os = require('os');
var shell = require('shelljs');
var argv = require('yargs')
  .option(
    {'size': {
               alias: 's',
               describe: 'Size of the test',
               choices: ['small', 'large'],
               default: 'small'
             },
     'lang': {
               alias: 'l',
               describe: 'Language of program to test',
               choices: ['java', 'javascript', 'other'],
               default: 'java'
             },
     'main': {
               alias: 'm',
               describe: 'Main Java class or JavaScript file or command to run',
               default: 'TermFrequency'
             }
  })
  .argv

if (argv.lang == 'java') {
  console.log('==> Compiling Java classes');
  shell.exec('javac *.java');
}

var commandName = {'java': 'java', 'javascript': 'node', 'other': ''};
var inputFile = ['input-', argv.size, '.txt'].join('');
// to make 25 a parameter we can't have the expected value hardcoded
var command = [commandName[argv.lang], argv.main, inputFile, '25'].join(' ');

// run the program
console.log('==> Running \"' + command + '\"');
var stdout = shell.exec(command).stdout;

/**
 * Function to sort the produced output numerically by second column and as a second key
 * lexicographically by first column.
 */
var byFreqAndAlpha = function(a, b) {
  if (b[1] - a[1] != 0) {
    // Sort first by number.
    return b[1] - a[1];
  } else {
    // Sort second by name. Names can be compared but not subtracted.
    if (a[0] < b[0]) {
      return -1;
    } else if (a[0] > b[0]) {
      return 1;
    } else {
      return 0;
    }
  }
};

var sort = function(rawOutput, sortCriteria) {
  return rawOutput
    .trim()
    .split(os.EOL)
    .map(line => line.split('  -  '))
    .sort(sortCriteria)
    .map(x => x.join('  -  '));
}

var outputSortedByFreqAndAlpha = sort(stdout, byFreqAndAlpha);
var outputSortedByFreq = sort(stdout, (a, b) => b[1] - a[1]);

var expected =
  {
    'small': [
             'live  -  2',
             'mostly  -  2',
             'africa  -  1',
             'india  -  1',
             'lions  -  1',
             'tigers  -  1',
             'white  -  1',
             'wild  -  1'
    ],
    'large': [
             'mr  -  786',
             'elizabeth  -  635',
             'very  -  488',
             'darcy  -  418',
             'such  -  395',
             'mrs  -  343',
             'much  -  329',
             'more  -  327',
             'bennet  -  323',
             'bingley  -  306',
             'jane  -  295',
             'miss  -  283',
             'one  -  275',
             'know  -  239',
             'before  -  229',
             'herself  -  227',
             'though  -  226',
             'well  -  224',
             'never  -  220',
             'sister  -  218',
             'soon  -  216',
             'think  -  211',
             'now  -  209',
             'time  -  203',
             'good  -  201'
    ]
  };

console.log('==> Checking output');

// First compare raw output with output sorted only by frequency to know if it's sorted.
if (stdout.trim() != outputSortedByFreq.join(os.EOL)) {
  console.error('Test failed. Hint: your output should be sorted by frequency in descending order.');

// Once we know it's sorted by frequency, we sort both by frequency and alphabetically
// so we can have an exact comparison with the reference solution.
} else if (expected[argv.size].join() === outputSortedByFreqAndAlpha.join()) {
  console.log('ok');

} else {
  var msg = ['Test failed. Expected:', expected[argv.size].join(os.EOL), 'but found:', stdout.trim()].join(os.EOL);
  console.error(msg);
}
