'use strict';
module.exports = function(grunt) {

    grunt.initConfig({

        config : {
            scripts: [
                'js/lodash.js',
                'js/classie.js',
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
        }

    });

    // Load tasks
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-sass');
};
