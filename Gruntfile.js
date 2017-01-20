module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        watch: {
            grunt: {
                files: ['Gruntfile.js']
            },

            options: {
                livereload: true
            },

            scripts: {
                files: ['src/javascript/*.js'],
                tasks: ['copy']
            },

            css: {
                files: 'src/sass/*.scss',
                tasks: ['buildcss']
            },

            html: {
                files: 'src/*.html',
                tasks: ['copy']
            }
        },

        jshint: {
            all: ['*.js', 'src/javascript/*.js'],
            options: {
                "esnext": true,
                "asi": true
            }
        },

        sass: {
            dist: {
                options: {
                    sourcemap: "none",
                    style: 'compact'
                },
                files: {
                    'build/stylesheets/main.css': 'src/sass/main.scss'
                }
            }
        },

        'http-server': {
            'dev': {
                debug: false,
                root: 'build/',
                port: 3000,
                host: "0.0.0.0",
                autoIndex: true,
                ext: "html",
                runInBackground: true,
                openBrowser: false,
                logFn: function(req, res, error) {
                    if (res.statusCode === 200) {
                        console.log(req.method.cyan, '(' + res.statusCode + ')', req.url);
                    } else if (res.statusCode != "/favicon") {
                        console.log(req.method.red, '(' + res.statusCode + ')', req.url);
                    }
                }
            }

        },

        copy: {
            main: {
                nonull: true,
                files: [{
                    src: 'src/index.html',
                    dest: 'build/index.html'
                }, {
                    expand: true,
                    flatten: true,
                    src: 'src/fonts/*',
                    dest: 'build/fonts/'
                }, {
                    expand: true,
                    flatten: true,
                    src: 'src/javascript/*.js',
                    dest: 'build/javascript/'
                }, {
                    expand: true,
                    flatten: true,
                    src: 'src/javascript/lib/*.js',
                    dest: 'build/javascript/lib/'
                }, {
                    expand: true,
                    flatten: true,
                    src: 'src/images/*',
                    dest: 'build/images/'
                }]
            },
        },
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-http-server');

    grunt.registerTask('default', ['buildAll', 'http-server', 'watch']);

    grunt.registerTask('buildcss', ['sass']);
    grunt.registerTask('buildAll', ['buildcss', 'copy']);
};
