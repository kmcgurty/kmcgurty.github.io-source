module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		watch: {
			grunt: {
				files: ['Gruntfile.js']
			},

			options: {
				spawn: false,
				livereload: {
					host: '192.168.1.12'
				}
			},

			scripts: {
				files: ['src/javascript/*.js'],
				tasks: ['buildjs']
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
			all: [	'*.js', 'src/javascript/*.js'],
			options: {
				"esnext": true
			}
		},

		uglify: {
			main: {
				options: {
					sourceMap: false,
					banner: '/* \n' +
						' Source: https://github.com/kmcgurty/ \n' +
						' Build date: <%= grunt.template.today("mm-dd-yyyy") %> \n' +
						'*/ \n "use strict" \n',
				},
				files: {
					'build/javascript/main.min.js': ['src/javascript/*.js']
				}
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
					} else {
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
					src: 'src/javascript/libs/*.js',
					dest: 'build/javascript/libs/'
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
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-http-server');

	grunt.registerTask('default', ['buildAll', 'http-server', 'watch']);

	grunt.registerTask('buildjs', ['jshint', 'uglify']);
	grunt.registerTask('buildcss', ['sass']);
	grunt.registerTask('buildAll', ['buildjs', 'buildcss', 'copy']);
};