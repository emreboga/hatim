module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),

		dustjs: {
			compile: {
				files: {
					"app/public/templates.js": ["app/templates/*.html"]
				}
			}
		},

		jshint: {
			all: ['Gruntfile.js', 'app/js/*.js']
		}
	});

	grunt.loadNpmTasks("grunt-dustjs");
	grunt.loadNpmTasks('grunt-contrib-jshint');

	grunt.registerTask("default", ["dustjs", "jshint"]);
};