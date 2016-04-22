var config = require('./config/config');

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    open : {
      dev : {
        path: 'http://127.0.0.1:' + process.env.PORT
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
      client: {
        files: ['client/**/*'],
        tasks: ['copy:client']
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
        cwd: 'public/',
        src: ['**'],
        dest: 'dist/public/'
      },
      client: {
        expand: true,
        cwd: 'client/',
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
          port: config.port,
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

  grunt.registerTask('production', [
    'default', 'express', 'watch'
  ]);

  grunt.registerTask('development', [
    'default', 'express', 'open:dev', 'watch'
  ]);

}
