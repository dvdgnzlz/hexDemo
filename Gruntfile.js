module.exports = function( grunt ){
	// grunt - will build all files for production
	// grunt watch - will watch for changes to the javascript files
	console.log("Starting Grunt tasks....");
	var _lf = grunt.util.linefeed;
	// SET TO TRUE FOR FINAL BUILD....
	var buildForProduction=false;
	var today = new Date();
	var year = today.getFullYear();
	var isoDate = today.toISOString();
	var version = "0001";
	// generate the name of the intermediate and final javascript files....
	var jsRootName = "public/javascript/minified/hexDemo.";
	// generate the name of the intermediate and final html (JADE) file....
	var htmlRootName = "javascript/minified/hexDemo.";
	var jsSuffixName = ".js";
	var jsMidName = "concat";
	var jsVersionName = jsMidName;
	//if (!buildForProduction){
		jsVersionName += "." + version;
	//}
	var jsFileName = jsRootName + jsVersionName + jsSuffixName; // CONCATENATED JAVASCRIPT... 
	var jsBuildFileName = jsRootName + jsMidName + jsSuffixName;
	var htmlFileName = htmlRootName + jsVersionName + jsSuffixName;
	if( buildForProduction){
		htmlFileName = htmlRootName + "min" + jsSuffixName;
	}
	var jsJadeLocation = "script(src='" + htmlFileName + "', type='text/javascript')" + _lf;
	var useStrictString ="'use strict';" + _lf + "// TEST BUILD - (using 'use strict' to find errors during development, but should not use in production with older code)." + _lf;
	if (buildForProduction){
		useStrictString = "// PRODUCTION BUILD" + _lf;
	}
	console.log(jsJadeLocation);

	var listOfJavascriptFiles = [
	"public/javascript/library-3rd-party/Snap.svg-0.4.1/dist/snap.svg.js",
	"public/javascript/library-3rd-party/socket.io.js",
	"public/javascript/library/*.js",
	"public/javascript/*.js",
	"public/javascript/service/**/*.js",
	"public/javascript/controller/**/*.js",
	];
	var taskArray = [
		//'jshint:checksome',//jshint the files....
		'concat:coreHtml',// generate head.jade file
		'concat:concatCoreJs', // concat all js to jsFileName....
		'concat:coreJsReadable', //copy jsFileName to jsBuildFileName (readable file with non-changing name)...
		'ngAnnotate:annotateJs', //convert jsFileName so it can be minified...
		'uglify:uglifyJs',//minify hexDemo_annotate.js to hexDemo.min.js
		//'watch'
	];
	var taskArrayWithWatch = [
		//'jshint:checksome',//jshint the files....
		'concat:coreHtml',// generate head.jade file
		'concat:concatCoreJs', // concat all js to jsFileName....
		'concat:coreJsReadable', //copy jsFileName to jsBuildFileName (readable file with non-changing name)...
		'ngAnnotate:annotateJs', //convert jsFileName so it can be minified...
		'uglify:uglifyJs',//minify hexDemo_annotate.js to hexDemo.min.js
		'watch'
	];
	grunt.initConfig({
		watch: {
			scripts: {
		    	files: listOfJavascriptFiles,
		    	tasks: taskArray,
		    	options: {debounceDelay: 250 },
			},
		},
		concat: {
			concatCoreJs:{
				options: {
					seperator: ";",
					banner: useStrictString + "// VERSION: " +  version + _lf,
				},
				src: listOfJavascriptFiles,
				dest: jsFileName,
			},
			coreJsReadable: {
				options: {
					seperator: ";",
					banner: "",
				},
				src: jsFileName,
				dest: jsBuildFileName,				
			},
			coreHtml:{
				options: {
					seperator: "",
					banner: "//- GENERATED FROM head_post.jade BY GRUNT..." + _lf,
					footer: _lf + "//- THIS LINE ADDED VIA GRUNT..." + _lf + jsJadeLocation,
				},
				src: "views/head.jade",
				dest: "views/head_post.jade",
			}

		},
		ngAnnotate:{
			annotateJs: {
				files: {
					'public/javascript/minified/hexDemo.annotate.js': [jsFileName]
				}
			}
		},
		uglify: {
			uglifyJs: {
				src: [
					"public/javascript/minified/hexDemo.annotate.js"
				],
				dest: "public/javascript/minified/hexDemo.min.js",
				options:{
					beautify: false,
					banner : "// COPYRIGHT 2016 - David Gonzalez -" + isoDate + _lf,
					//mangle: true,
					mangle: {except: ['$q']}, // DON'T MANGE $q OR OBJECTS LIKE assessPlanViewCtrl WONT BE ABLE TO USE PROMISES TO LOAD DATA (e.g. PODs)...
					screwIE8: false 
				}
			}
		},
// grunt http:download
		http: {
  		download: {
  			options: {url: ['http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js']},
  			dest: 'public/javascript/stage/jquery.min.js'
  		}
  	},
	  jshint: {
  		options:{
  			browser: true,
  			devel: true,
  			strict: false,
  			force: false,
  			undef: true,
  			unused: "vars",
  			multistr: true,
  			maxerr: 20,
  			globals:{
  				"$":true,
  				"angular":true,
  			}
  		},
 			checksome: [
				"public/javascript/*.js",
				"public/javascript/library/*.js",
				"public/javascript/service/*.js"
 			],
 			newstuff:[
 				"public/javascript/angularJs/ang_bbs.js"
 			]
 		},	
	});
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-ng-annotate');
	grunt.loadNpmTasks('grunt-http');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.registerTask('default',  taskArrayWithWatch);
};