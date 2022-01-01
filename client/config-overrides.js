const webpack = require('webpack');

module.exports = {
    webpack: function(config, env) {
        // add NormalModuleReplacementPlugin to webpack to rewrite .*/server/.* -> "transparent-typed-rpc"
        config.plugins.unshift(new webpack.NormalModuleReplacementPlugin(
            /.*\/server\/.*/,
            (resource) => {
                resource.request = 'transparent-typed-rpc';
            }
        ));

        return config;
    },
};
