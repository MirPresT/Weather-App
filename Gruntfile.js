module.exports = function(grunt) {


    grunt.initConfig({
        sass: {
            dist: {
                files: {
                    'public/stylesheets/main.css': 'public/stylesheets/style.scss'
                }
            }
        },
        watch: {
            sass: {
                files: ['public/stylesheets/*.scss','views/*.hjs'],
                tasks: ['sass'],
                options: {
                    livereload: true
                },
            },
            js: {
                files: ['public/javascripts/script/*.js'],
                tasks: ['sass'],
                options: {
                    livereload: true
                },
            },
        },
        nodemon: {
            dev: {
                script: 'bin/www',
            }
        },
        concurrent: {
            target: {
                tasks: ['nodemon','watch'],
                options: {
                    logConcurrentOutput: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.registerTask('default',['sass','concurrent:target']);
};
