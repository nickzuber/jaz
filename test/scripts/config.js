/*!
 * The first javascript file that is loaded. Set up all of the
 * required paths.
 */

requirejs.config({
    baseUrl: "scripts/",
    paths: {
        Status: 'status',
        Scope: 'scope',
        Intermission: 'intermission',
        Jaz: 'jaz'
    }
});