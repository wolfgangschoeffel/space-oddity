'use strict';
module.exports = function(grunt) {

    grunt.initConfig({

        config : {
            scripts: [
                'js/lodash.js',
                //'js/map-range.js',
                'js/classie.js',
                //'js/gator.js',
                //'js/easing.js',
                //'js/animated-scroll.js',
                'js/transition.js',
                'js/tween.js',
                'js/main.js'
            ],
        },

        sass: {// Task
            dist: {
                options: {
                    includePaths: require('node-bourbon').includePaths
                },                            // Target
                files: {                        // Dictionary of files
                    'css/main.min.css': 'css/master.scss'     // 'destination': 'source'
                }
            }
        },

        uglify: {
            scripts: {
                options: {
                    sourceMap: true,
                    //sourceMapName:  'js/sourcemap.map',
                    beautify: false
                },
                files: {
                    'js/main.min.js': '<%=config.scripts%>'
                }
            }
        },

        watch: {
            sass: {
                files: [
                    'css/*.scss'
                ],
                tasks: ['sass']
            },

            js: {
                files: '<%=config.scripts%>',
                tasks: ['uglify']
            },

            livereload: {
                // Browser live reloading
                // https://github.com/gruntjs/grunt-contrib-watch#live-reloading
                options: {
                    livereload: true
                },
                files: [
                    'css/main.min.css',
                    'js/main.min.js',
                    '*.html'
                ]
            }
        },

        clean: {
            dist: [
                'css/main.min.css'
            ]
        },

        modernizr: {

            dist: {
                // [REQUIRED] Path to the build you're using for development.
                'devFile' : 'js/modernizr-latest.js',
                // [REQUIRED] Path to save out the built file.
                'outputFile' : 'js/modernizr-custom.js',

                // Based on default settings on http://modernizr.com/download/
                'extra' : {
                    'shiv' : true,
                    'printshiv' : false,
                    'load' : false,
                    'mq' : false,
                    'cssclasses' : true
                },

                // Based on default settings on http://modernizr.com/download/
                'extensibility' : {
                    'addtest' : false,
                    'prefixed' : false,
                    'teststyles' : false,
                    'testprops' : false,
                    'testallprops' : false,
                    'hasevents' : false,
                    'prefixes' : false,
                    'domprefixes' : false
                },

                // By default, source is uglified before saving
                'uglify' : false,

                // Define any tests you want to implicitly include.
                'tests' : [ 'touch'],

                // By default, this task will crawl your project for references to Modernizr tests.
                // Set to false to disable.
                'parseFiles' : false,

                // When parseFiles = true, matchCommunityTests = true will attempt to
                // match user-contributed tests.
                'matchCommunityTests' : true,

                // Have custom Modernizr tests? Add paths to their location here.
                'customTests' : []
            }

        }

    });

    // Load tasks
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-modernizr');
};
