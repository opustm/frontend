// Returns the page location type
// 0 (falsey) = Local file, direct from disk (file://path/to/file.html)
// 1 (truthy) = Virtually remote file, from local server (http://localhost)
// 2 (truthy) = Remote file from remote server (http://example.com)
// Source: https://stackoverflow.com/questions/3920892/how-to-detect-if-a-web-page-is-running-from-a-website-or-local-file-system

function locationType() {
    // Override: Connect to remote API server while local.
    // return 2; 
    if( window.location.protocol === 'file:' ){ return 0; }
    if( !window.location.host.replace( /localhost|127\.0\.0\.1/i, '' ) ){ return 1; }
    return 2;

}

function APIHost() {
    return (locationType() < 2) ? 
    'http://localhost:8000/': 'http://opustm-api-staging.herokuapp.com/';
}

export default APIHost;