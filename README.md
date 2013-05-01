##promisedoc

A plugin for jsdoc3 that enables additional documentation tags helpful in documenting the promise pattern.

This plugin enables the addition of the following tags, which aid in the documentation of methods that return promises.

```
@resolvedwith {type} name description
@rejectedwith {type} name description
@notifiedwity {type} name description
```

Sure, name doesn't matter (the developer can name the argument whatever they want), but it provides the utility of
documenting object's and their properties, ie:

```
@resolvedwith {object} obj       Some object.
@resolvedwith {object} obj.prop  Some property of some object.
```

These provide a standard way of describing the result of a promise.

The tags MUST be present in a block that contains an @returns tag.  It doesn't matter if the tags are positioned before
or after the @returns tag, but they've got to be in there.

## Installation

Edit your jsdoc configuration file and add a link pointing at the promise plugin:

```
"plugins": [
    // .. other plugins
    "./jsdoc3-plugins/promise"
]
```

You'll also want to edit your template to include the promise output.  I've included two sample templates in the `templates`
directory.

The `promise.tmpl` is a self-standing template that outputs the promise documentation similar to method parameters.

The `returns.tmpl` is an edited version of the default `returns.tmpl` that includes the `promise.tmpl` partial template 
as is appropriate:

```
<?js if (data.promise) { ?>
    <dt>Promise Detail:</dt>
	<dd>
	    <?js= this.partial('promise.tmpl', data.promise) ?>
	</dd>
<?js } ?>


Ultimately you can massage your output into whatever format you need.  Simply check out `promise.tmpl` for an example
of how to parse and display the output.

```

## Usage

Let's say you had a method that returned a promise.  The promise is resolved with a single object which has the `value`
property.

```
/**
 * Gets a promise for the value.
 *
 * @returns {module:lib/Promise} A promise for the value.
 * @resolvedwith {object} obj The value object.
 * @resolvedwith {number} obj.value The value
 */
 ```

 It's that simple!

## Issues

 * Currently I treat all parameters in the returns collection (multiple returns) as though they are promises.  I need
to enhance this such that only the return values that are promises are actually tied to the promise documentation output.

Feel free to file issues or reach out to me directly if you encounter issues.  Happy documenting!
