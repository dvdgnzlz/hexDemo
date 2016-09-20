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
	var version = "1.16.03.22.0001";
	// generate the name of the intermediate and final javascript files....
	var jsRootName = "public/javascript/min/BBS_EFS.";
	// generate the name of the intermediate and final html (JADE) file....
	var htmlRootName = "javascript/min/BBS_EFS.";
	var jsSuffixName = ".js";
	var jsMidName = "concat";
	var jsVersionName = jsMidName;
	//if (!buildForProduction){
		jsVersionName += "." + version;
	//}
	var jsFileName = jsRootName + jsVersionName + jsSuffixName;
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
	//"public/javascript/libraries/jquery/jquery-3.1.0.min.js",
	"public/javascript/libraries/jquery/jquery-2.2.4.min.js",
	//"public/javascript/libraries/jquery/jquery-1.11.3.js",
	//"public/javascript/libraries/angular-1.2.15/angular.min.js",
	//"public/javascript/libraries/angular-1.2.15/angular-route.min.js",
	//"public/javascript/libraries/angular-1.2.15/angular-animate.min.js",
	//"public/javascript/libraries/angular-1.2.15/angular-sanitize.min.js", 
	"public/javascript/libraries/angular-1.3.20/angular.min.js",
	"public/javascript/libraries/angular-1.3.20/angular-route.min.js",
	"public/javascript/libraries/angular-1.3.20/angular-animate.min.js",
	"public/javascript/libraries/angular-1.3.20/angular-sanitize.min.js", 
		"public/javascript/*.js",
		"public/javascript/libraries/*.js",
		"public/javascript/angularJs/**/*.js",
		"public/javascript/bbs_data/**/*.js",
		"public/javascript/emr_data/**/*.js",
	];
	var taskArray = [
		'jshint:checksome',//jshint the files....
		'concat:coreHtml',// generate head.jade file
		'concat:coreJs', // concat all js to jsFileName....
		'concat:coreJsReadable', //copy jsFileName to jsBuildFileName (readable file with non-changing name)...
		'ngAnnotate:appBbs', //convert jsFileName so it can be minified...
		'uglify:foo',//minify BBS_EFS_annotate.js to BBS_EFS.min.js
		//'watch'
	];
	var taskArrayWithWatch = [
		'jshint:checksome',//jshint the files....
		'concat:coreHtml',// generate head.jade file
		'concat:coreJs', // concat all js to jsFileName....
		'concat:coreJsReadable', //copy jsFileName to jsBuildFileName (readable file with non-changing name)...
		'ngAnnotate:appBbs', //convert jsFileName so it can be minified...
		'uglify:foo',//minify BBS_EFS_annotate.js to BBS_EFS.min.js
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
			coreJs:{
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
					banner: "// GENERATED FROM head_pre.jade BY GRUNT..." + _lf,
					footer: jsJadeLocation,
				},
				src: "views/includes/head_pre.jade",
				dest: "views/includes/head.jade",
			}

		},
		ngAnnotate:{
			appBbs: {
				files: {
					'public/javascript/min/BBS_EFS.annotate.js': [jsFileName]
				}
			}
		},
		uglify: {
			foo: {
				src: [
					"public/javascript/min/BBS_EFS.annotate.js",

				],
				dest: "public/javascript/min/BBS_EFS.min.js",
				options:{
					beautify: false,
					banner : "// COPYRIGHT 2016 - Blackbird Soloutions, Inc. -" + isoDate + _lf,
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
 				"public/javascript/bbs_data/**/*.js",
 				"public/javascript/emr_data/**/*.js",
 				"public/javascript/angularJs/ang*.js",
 				"public/javascript/angularJs/con*.js",
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