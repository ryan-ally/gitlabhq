import { lowlight } from 'lowlight/lib/core';
import { __, sprintf } from '~/locale';

/* eslint-disable @gitlab/require-i18n-strings */
// List of languages referenced from https://github.com/wooorm/lowlight#data
const CODE_BLOCK_LANGUAGES = [
  { syntax: '1c', label: '1C:Enterprise' },
  { syntax: 'abnf', label: 'Augmented Backus-Naur Form' },
  { syntax: 'accesslog', label: 'Apache Access Log' },
  { syntax: 'actionscript', variants: 'as', label: 'ActionScript' },
  { syntax: 'ada', label: 'Ada' },
  { syntax: 'angelscript', variants: 'asc', label: 'AngelScript' },
  { syntax: 'apache', variants: 'apacheconf', label: 'Apache config' },
  { syntax: 'applescript', variants: 'osascript', label: 'AppleScript' },
  { syntax: 'arcade', label: 'ArcGIS Arcade' },
  { syntax: 'arduino', variants: 'ino', label: 'Arduino' },
  { syntax: 'armasm', variants: 'arm', label: 'ARM Assembly' },
  { syntax: 'asciidoc', variants: 'adoc', label: 'AsciiDoc' },
  { syntax: 'aspectj', label: 'AspectJ' },
  { syntax: 'autohotkey', variants: 'ahk', label: 'AutoHotkey' },
  { syntax: 'autoit', label: 'AutoIt' },
  { syntax: 'avrasm', label: 'AVR Assembly' },
  { syntax: 'awk', label: 'Awk' },
  { syntax: 'axapta', variants: 'x++', label: 'X++' },
  { syntax: 'bash', variants: 'sh', label: 'Bash' },
  { syntax: 'basic', label: 'BASIC' },
  { syntax: 'bnf', label: 'Backus-Naur Form' },
  { syntax: 'brainfuck', variants: 'bf', label: 'Brainfuck' },
  { syntax: 'c', variants: 'h', label: 'C' },
  { syntax: 'cal', label: 'C/AL' },
  { syntax: 'capnproto', variants: 'capnp', label: "Cap'n Proto" },
  { syntax: 'ceylon', label: 'Ceylon' },
  { syntax: 'clean', variants: 'icl, dcl', label: 'Clean' },
  { syntax: 'clojure', variants: 'clj, edn', label: 'Clojure' },
  { syntax: 'clojure-repl', label: 'Clojure REPL' },
  { syntax: 'cmake', variants: 'cmake.in', label: 'CMake' },
  { syntax: 'coffeescript', variants: 'coffee, cson, iced', label: 'CoffeeScript' },
  { syntax: 'coq', label: 'Coq' },
  { syntax: 'cos', variants: 'cls', label: 'Caché Object Script' },
  { syntax: 'cpp', variants: 'cc, c++, h++, hpp, hh, hxx, cxx', label: 'C++' },
  { syntax: 'crmsh', variants: 'crm, pcmk', label: 'crmsh' },
  { syntax: 'crystal', variants: 'cr', label: 'Crystal' },
  { syntax: 'csharp', variants: 'cs, c#', label: 'C#' },
  { syntax: 'csp', label: 'CSP' },
  { syntax: 'css', label: 'CSS' },
  { syntax: 'd', label: 'D' },
  { syntax: 'dart', label: 'Dart' },
  { syntax: 'delphi', variants: 'dpr, dfm, pas, pascal', label: 'Delphi' },
  { syntax: 'diff', variants: 'patch', label: 'Diff' },
  { syntax: 'django', variants: 'jinja', label: 'Django' },
  { syntax: 'dns', variants: 'bind, zone', label: 'DNS Zone' },
  { syntax: 'dockerfile', variants: 'docker', label: 'Dockerfile' },
  { syntax: 'dos', variants: 'bat, cmd', label: 'Batch file (DOS)' },
  { syntax: 'dsconfig', label: 'DSConfig' },
  { syntax: 'dts', label: 'Device Tree' },
  { syntax: 'dust', variants: 'dst', label: 'Dust' },
  { syntax: 'ebnf', label: 'Extended Backus-Naur Form' },
  { syntax: 'elixir', variants: 'ex, exs', label: 'Elixir' },
  { syntax: 'elm', label: 'Elm' },
  { syntax: 'erb', label: 'ERB' },
  { syntax: 'erlang', variants: 'erl', label: 'Erlang' },
  { syntax: 'erlang-repl', label: 'Erlang REPL' },
  { syntax: 'excel', variants: 'xlsx, xls', label: 'Excel formulae' },
  { syntax: 'fix', label: 'FIX' },
  { syntax: 'flix', label: 'Flix' },
  { syntax: 'fortran', variants: 'f90, f95', label: 'Fortran' },
  { syntax: 'fsharp', variants: 'fs, f#', label: 'F#' },
  { syntax: 'gams', variants: 'gms', label: 'GAMS' },
  { syntax: 'gauss', variants: 'gss', label: 'GAUSS' },
  { syntax: 'gcode', variants: 'nc', label: 'G-code (ISO 6983)' },
  { syntax: 'gherkin', variants: 'feature', label: 'Gherkin' },
  { syntax: 'glsl', label: 'GLSL' },
  { syntax: 'gml', label: 'GML' },
  { syntax: 'go', variants: 'golang', label: 'Go' },
  { syntax: 'golo', label: 'Golo' },
  { syntax: 'gradle', label: 'Gradle' },
  { syntax: 'graphql', variants: 'gql', label: 'GraphQL' },
  { syntax: 'groovy', label: 'Groovy' },
  { syntax: 'haml', label: 'HAML' },
  {
    syntax: 'handlebars',
    variants: 'hbs, html.hbs, html.handlebars, htmlbars',
    label: 'Handlebars',
  },
  { syntax: 'haskell', variants: 'hs', label: 'Haskell' },
  { syntax: 'haxe', variants: 'hx', label: 'Haxe' },
  { syntax: 'hsp', label: 'HSP' },
  { syntax: 'http', variants: 'https', label: 'HTTP' },
  { syntax: 'hy', variants: 'hylang', label: 'Hy' },
  { syntax: 'inform7', variants: 'i7', label: 'Inform 7' },
  { syntax: 'ini', variants: 'toml', label: 'TOML, also INI' },
  { syntax: 'irpf90', label: 'IRPF90' },
  { syntax: 'isbl', label: 'ISBL' },
  { syntax: 'java', variants: 'jsp', label: 'Java' },
  { syntax: 'javascript', variants: 'js, jsx, mjs, cjs', label: 'Javascript' },
  { syntax: 'jboss-cli', variants: 'wildfly-cli', label: 'JBoss CLI' },
  { syntax: 'json', label: 'JSON' },
  { syntax: 'julia', label: 'Julia' },
  { syntax: 'julia-repl', variants: 'jldoctest', label: 'Julia REPL' },
  { syntax: 'kotlin', variants: 'kt, kts', label: 'Kotlin' },
  { syntax: 'lasso', variants: 'ls, lassoscript', label: 'Lasso' },
  { syntax: 'latex', variants: 'tex', label: 'LaTeX' },
  { syntax: 'ldif', label: 'LDIF' },
  { syntax: 'leaf', label: 'Leaf' },
  { syntax: 'less', label: 'Less' },
  { syntax: 'lisp', label: 'Lisp' },
  { syntax: 'livecodeserver', label: 'LiveCode' },
  { syntax: 'livescript', variants: 'ls', label: 'LiveScript' },
  { syntax: 'llvm', label: 'LLVM IR' },
  { syntax: 'lsl', label: 'LSL (Linden Scripting Language)' },
  { syntax: 'lua', label: 'Lua' },
  { syntax: 'makefile', variants: 'mk, mak, make', label: 'Makefile' },
  { syntax: 'markdown', variants: 'md, mkdown, mkd', label: 'Markdown' },
  { syntax: 'mathematica', variants: 'mma, wl', label: 'Mathematica' },
  { syntax: 'matlab', label: 'Matlab' },
  { syntax: 'maxima', label: 'Maxima' },
  { syntax: 'mel', label: 'MEL' },
  { syntax: 'mercury', variants: 'm, moo', label: 'Mercury' },
  { syntax: 'mipsasm', variants: 'mips', label: 'MIPS Assembly' },
  { syntax: 'mizar', label: 'Mizar' },
  { syntax: 'mojolicious', label: 'Mojolicious' },
  { syntax: 'monkey', label: 'Monkey' },
  { syntax: 'moonscript', variants: 'moon', label: 'MoonScript' },
  { syntax: 'n1ql', label: 'N1QL' },
  { syntax: 'nestedtext', variants: 'nt', label: 'Nested Text' },
  { syntax: 'nginx', variants: 'nginxconf', label: 'Nginx config' },
  { syntax: 'nim', label: 'Nim' },
  { syntax: 'nix', variants: 'nixos', label: 'Nix' },
  { syntax: 'node-repl', label: 'Node REPL' },
  { syntax: 'nsis', label: 'NSIS' },
  {
    syntax: 'objectivec',
    variants: 'mm, objc, obj-c, obj-c++, objective-c++',
    label: 'Objective-C',
  },
  { syntax: 'ocaml', variants: 'ml', label: 'OCaml' },
  { syntax: 'openscad', variants: 'scad', label: 'OpenSCAD' },
  { syntax: 'oxygene', label: 'Oxygene' },
  { syntax: 'parser3', label: 'Parser3' },
  { syntax: 'perl', variants: 'pl, pm', label: 'Perl' },
  { syntax: 'pf', variants: 'pf.conf', label: 'Packet Filter config' },
  { syntax: 'pgsql', variants: 'postgres, postgresql', label: 'PostgreSQL' },
  { syntax: 'php', label: 'PHP' },
  { syntax: 'php-template', label: 'PHP template' },
  { syntax: 'plaintext', variants: 'text, txt', label: 'Plain text' },
  { syntax: 'pony', label: 'Pony' },
  { syntax: 'powershell', variants: 'pwsh, ps, ps1', label: 'PowerShell' },
  { syntax: 'processing', variants: 'pde', label: 'Processing' },
  { syntax: 'profile', label: 'Python profiler' },
  { syntax: 'prolog', label: 'Prolog' },
  { syntax: 'properties', label: '.properties' },
  { syntax: 'protobuf', label: 'Protocol Buffers' },
  { syntax: 'puppet', variants: 'pp', label: 'Puppet' },
  { syntax: 'purebasic', variants: 'pb, pbi', label: 'PureBASIC' },
  { syntax: 'python', variants: 'py, gyp, ipython', label: 'Python' },
  { syntax: 'python-repl', variants: 'pycon', label: 'Python REPL' },
  { syntax: 'q', variants: 'k, kdb', label: 'Q' },
  { syntax: 'qml', variants: 'qt', label: 'QML' },
  { syntax: 'r', label: 'R' },
  { syntax: 'reasonml', variants: 're', label: 'ReasonML' },
  { syntax: 'rib', label: 'RenderMan RIB' },
  { syntax: 'roboconf', variants: 'graph, instances', label: 'Roboconf' },
  { syntax: 'routeros', variants: 'mikrotik', label: 'Microtik RouterOS script' },
  { syntax: 'rsl', label: 'RenderMan RSL' },
  { syntax: 'ruby', variants: 'rb, gemspec, podspec, thor, irb', label: 'Ruby' },
  { syntax: 'ruleslanguage', label: 'Oracle Rules Language' },
  { syntax: 'rust', variants: 'rs', label: 'Rust' },
  { syntax: 'sas', label: 'SAS' },
  { syntax: 'scala', label: 'Scala' },
  { syntax: 'scheme', label: 'Scheme' },
  { syntax: 'scilab', variants: 'sci', label: 'Scilab' },
  { syntax: 'scss', label: 'SCSS' },
  { syntax: 'shell', variants: 'console, shellsession', label: 'Shell Session' },
  { syntax: 'smali', label: 'Smali' },
  { syntax: 'smalltalk', variants: 'st', label: 'Smalltalk' },
  { syntax: 'sml', variants: 'ml', label: 'SML (Standard ML)' },
  { syntax: 'sqf', label: 'SQF' },
  { syntax: 'sql', label: 'SQL' },
  { syntax: 'stan', variants: 'stanfuncs', label: 'Stan' },
  { syntax: 'stata', variants: 'do, ado', label: 'Stata' },
  { syntax: 'step21', variants: 'p21, step, stp', label: 'STEP Part 21' },
  { syntax: 'stylus', variants: 'styl', label: 'Stylus' },
  { syntax: 'subunit', label: 'SubUnit' },
  { syntax: 'swift', label: 'Swift' },
  { syntax: 'taggerscript', label: 'Tagger Script' },
  { syntax: 'tap', label: 'Test Anything Protocol' },
  { syntax: 'tcl', variants: 'tk', label: 'Tcl' },
  { syntax: 'thrift', label: 'Thrift' },
  { syntax: 'tp', label: 'TP' },
  { syntax: 'twig', variants: 'craftcms', label: 'Twig' },
  { syntax: 'typescript', variants: 'ts, tsx', label: 'TypeScript' },
  { syntax: 'vala', label: 'Vala' },
  { syntax: 'vbnet', variants: 'vb', label: 'Visual Basic .NET' },
  { syntax: 'vbscript', variants: 'vbs', label: 'VBScript' },
  { syntax: 'vbscript-html', label: 'VBScript in HTML' },
  { syntax: 'verilog', variants: 'v, sv, svh', label: 'Verilog' },
  { syntax: 'vhdl', label: 'VHDL' },
  { syntax: 'vim', label: 'Vim Script' },
  { syntax: 'wasm', label: 'WebAssembly' },
  { syntax: 'wren', label: 'Wren' },
  { syntax: 'x86asm', label: 'Intel x86 Assembly' },
  { syntax: 'xl', variants: 'tao', label: 'XL' },
  {
    syntax: 'xml',
    variants: 'html, xhtml, rss, atom, xjb, xsd, xsl, plist, wsf, svg',
    label: 'HTML, XML',
  },
  { syntax: 'xquery', variants: 'xpath, xq', label: 'XQuery' },
  { syntax: 'yaml', variants: 'yml', label: 'YAML' },
  { syntax: 'zephir', variants: 'zep', label: 'Zephir' },
];
/* eslint-enable @gitlab/require-i18n-strings */

const codeBlockLanguageLoader = {
  lowlight,

  allLanguages: CODE_BLOCK_LANGUAGES,

  findLanguageBySyntax(value) {
    const lowercaseValue = value?.toLowerCase() || 'plaintext';
    return (
      this.allLanguages.find(
        ({ syntax, variants }) =>
          syntax === lowercaseValue || variants?.toLowerCase().split(', ').includes(lowercaseValue),
      ) || {
        syntax: lowercaseValue,
        label: sprintf(__(`Custom (%{language})`), { language: lowercaseValue }),
      }
    );
  },

  filterLanguages(value) {
    if (!value) return this.allLanguages;

    const lowercaseValue = value?.toLowerCase() || '';
    return this.allLanguages.filter(
      ({ syntax, label, variants }) =>
        syntax.toLowerCase().includes(lowercaseValue) ||
        label.toLowerCase().includes(lowercaseValue) ||
        variants?.toLowerCase().includes(lowercaseValue),
    );
  },

  isLanguageLoaded(language) {
    return this.lowlight.registered(language);
  },

  loadLanguagesFromDOM(domTree) {
    const languages = [];

    domTree.querySelectorAll('pre').forEach((preElement) => {
      languages.push(preElement.getAttribute('lang'));
    });

    return this.loadLanguages(languages);
  },

  loadLanguageFromInputRule(match) {
    const { syntax } = this.findLanguageBySyntax(match[1]);

    this.loadLanguages([syntax]);

    return { language: syntax };
  },

  loadLanguages(languageList = []) {
    const loaders = languageList
      .filter((languageName) => !this.isLanguageLoaded(languageName))
      .map((languageName) => {
        return import(
          /* webpackChunkName: 'highlight.language.js' */ `highlight.js/lib/languages/${languageName}`
        )
          .then(({ default: language }) => {
            this.lowlight.registerLanguage(languageName, language);
          })
          .catch(() => false);
      });

    return Promise.all(loaders);
  },
};

export default codeBlockLanguageLoader;
