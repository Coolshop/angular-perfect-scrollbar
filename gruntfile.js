module.exports = function(grunt) {

  grunt.initConfig({
    babel: {
      options: {
        "sourceMap": true
      },
      dist: {
        files: [{
          "expand": true,
          "cwd": "src/js",
          "src": ["**/*.js"],
          "dest": "dist/js-compiled/",
          "ext": "-compiled.js"
        }]
      }
    },
    uglify: {
      all_src : {
        options : {
          sourceMap : true,
          sourceMapName : 'src/build/sourceMap.map'
        },
        src : 'dist/js-compiled/**/*-compiled.js',
        dest : 'dist/build/angular-perfect-scrollbar.min.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.registerTask("default", ["babel", "uglify"]);
};