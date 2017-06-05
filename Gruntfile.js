module.exports = function(grunt) {
    grunt.initConfig({
        copy: {
            main: {
                files: [{
                        expand: true,
                        cwd: 'src/',
                        src: ['*'],
                        dest: 'app/',
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        cwd: 'src/assets/img',
                        src: ['*'],
                        dest: 'app/assets/img',
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        cwd: 'src/js',
                        src: ['*'],
                        dest: 'app/js',
                        filter: 'isFile'
                    }


                ]

            }
        },

        sass: { // Task
            dist: { // Target
                options: { // Target options
                    style: 'expanded',
                    'sourcemap': 'none',
                    'style': 'compressed'

                },
                files: { // Dictionary of files
                    'app/css/main.css': 'src/scss/main.scss',

                }

            }
        },



        watch: {

            css: {
                files: ['src/scss/main.scss'],
                tasks: ['sass'],
            },

            html: {
                files: ['src/*'],
                tasks: ['copy'],
            },

            js: {
                files: ['src/js/main.js'],
                tasks: ['copy'],
            },

            img: {
                files: ['src/img/*'],
                tasks: ['copy'],
            }

        }
    });



    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['copy','sass' ]);
};
