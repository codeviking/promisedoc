/**
 * JSDoc 3 Promise Documentation Plugin
 *
 * @author Sam Skjonsberg <skoneberg@gmail.com>
 *
 * This plugin enables the addition of the following tags, which aid in the documentation of methods that return promises.
 *
 * @resolvedwith {type} name description
 * @rejectedwith {type} name description
 * @notifiedwity {type} name description
 *
 * Sure, name doesn't matter (the developer can name the argument whatever they want), but it provides the utility of
 * documenting object's and their properties, ie:
 *
 * @resolvedwith {object} obj       Some object.
 * @resolvedwith {object} obj.prop  Some property of some object.
 *
 * These provide a standard way of describing the result of a promise.
 *
 * The tags MUST be present in a block that contains an @returns tag.  It doesn't matter if the tags are positioned before
 * or after the @returns tag, but they've got to be in there.
 *
 * @license MIT License
 */
(function(require) {

        // Regular expression for parsing the tag, {type} name description
    var regExpArg = /{(\S+)}\s+(\S+)\s*(.*)/,
        // Returns the "doclet" for a promise attached to the specified doclet.  If a promise doclet doesn't exist already
        // on the specified doclet, it creates and attaches one.
        getPromiseDoclet = function(doclet) {
            if(!doclet.promise) {
                doclet.promise = {
                    resolvedwith : [],
                    rejectedwith : [],
                    notifiedwith : []
                }
            }
            return doclet.promise;
        };

    // Private class for a promise argument.
    var Argument = function(type, name, desc) {
        this.type           = { names : [] };
        this.name           = name;
        this.description    = desc;
        this.parseType(type);
    };

    // Parse the type parameter and format the data in a way that matches that of method params so that we can
    // use the params template for display purposes
    Argument.prototype.parseType = function(type) {
        var types       = type.split('|');
        this.type.names = this.type.names.concat(types);
        return this;
    };

    // Returns the tag definition for a promise tag with the given tagname
    var getPromiseTagDefinition = function(tagname) {
        return {
            mustHaveValue   : true,
            canHaveName     : true,
            canHaveType     : true,
            onTagged        : function(doclet, tag) {
                var parsed,
                    promiseDoclet;
                // No @returns block? Complain...
                if(!doclet.returns) {
                    require('jsdoc/util/error').handle(new Error('@' + tagname + ' must come after a @returns'));
                }
                // Time to parse the tag
                parsed = tag.text && tag.text.match(regExpArg);
                if(parsed) {
                    // Ditch the first (it's the full match, we don't care about it)
                    parsed.shift();
                    if(parsed.length > 0) {
                        // Process each @returns block
                        // TODO: If a method has multiple @returns, we may need to decorate ONLY the method
                        // that returns a promise.
                        doclet.returns.forEach(function(returnDoclet) {
                            promiseDoclet = getPromiseDoclet(returnDoclet);
                            promiseDoclet[tagname].push(
                                new Argument(
                                    // type
                                    parsed.length >= 1 ? parsed[0] : undefined,
                                    // name
                                    parsed.length >= 2 ? parsed[1] : undefined,
                                    // description
                                    parsed.length >= 3 ? parsed[2] : undefined
                                )
                            );
                        });
                    }
                }
            }
        };
    };

    // Define the tags we want to support
    exports.defineTags = function(dictionary) {
        [
            'resolvedwith',
            'rejectedwith',
            'notifiedwith'
        ].forEach(function(t) {
            dictionary.defineTag(t, getPromiseTagDefinition(t));
        });
    };

}(require));