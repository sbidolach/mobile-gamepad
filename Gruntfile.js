module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    open : {
      dev : {
        path: 'http://127.0.0.1:9000/'
      }
    },

    watch: {
      options: {
        livereload: true
      },
      public: {
        files: ['client/public/**/*'],
        tasks: ['copy:public']
      },
      server: {
        files: ['config/config.js','server/*'],
        tasks: ['express:dev'],
        options: {
          spawn: false
        }
      }
    },

    copy: {
      public: {
        expand: true,
        cwd: 'client/public/',
        src: ['**'],
        dest: 'dist/public/'
      }
    },

    clean: {
      dist: ['dist/']
    },

    express: {
      dev: {
        options: {
          port: 9000,
          script: 'server/server.js',
          background: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-open');

  grunt.registerTask('default', [
    'clean', 'copy'
  ]);

  grunt.registerTask('server', [
    'default', 'express', 'open:dev', 'watch'
  ]);

}
