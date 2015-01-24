var isArray = require("is_array"),
    isNumber = require("is_number"),
    isBoolean = require("is_boolean"),
    isString = require("is_string");


function argv(options) {
    options = createOptions(options);

    return {
        options: options.values,

        parse: function(args) {
            var out = {},
                parsedArgs, key, value, option, values;

            args = isArray(args) ? args : process.argv.slice(2);
            parsedArgs = parseArgs(args);

            for (key in parsedArgs) {
                value = parsedArgs[key];
                option = options.values[key] || options.aliases[key] || createOption(key, []);

                out[option.name] = parseValue(key, value, option.type, option.defaults);
            }

            values = options.values;

            for (key in values) {
                if (out[key] == null) {
                    out[key] = values[key].defaults;
                }
            }

            return out;
        }
    };
}

function parseValue(key, value, typeStr, defaults) {
    if (value === false) {
        return false;
    }

    if (value === undefined || value === null) {
        return defaults;
    }

    if (typeStr === "string") {
        if (isString(value)) {
            return value;
        } else {
            throw new Error("invalid type passed for " + key + ", wanted string");
        }
    } else if (typeStr === "number") {
        value = +value;

        if (isNumber(value)) {
            return value;
        } else {
            throw new Error("invalid type passed for " + key + ", wanted number");
        }
    } else if (typeStr === "array") {
        return type.isArray(value) ? value : [value];
    } else if (typeStr === "bool" || typeStr === "boolean") {
        if (isBoolean(value)) {
            return value;
        }

        if (value === "true" || value === "1" || value === 1) {
            return true;
        } else if (value === "false" || value === "0" || value === 0) {
            return false;
        }

        throw new Error("invalid type passed for " + key + ", wanted boolean");
    }

    return value;
}

function createOptions(options) {
    var values = {},
        aliases = {},
        key, option;

    for (key in options) {
        option = values[key] = createOption(key, options[key]);
        if (option.alias) aliases[option.alias] = option;
    }

    return {
        values: values,
        aliases: aliases
    };
}

function createOption(key, options) {
    return {
        name: key,
        alias: isString(options[0]) ? options[0] : false,
        desc: isString(options[1]) ? options[1] : "",
        type: isString(options[2]) ? options[2].toLowerCase() : "",
        defaults: options[3] != null ? options[3] : undefined
    };
}

function parseArgs(args) {
    var out = {},
        i = -1,
        length = args.length - 1,
        arg;

    while (i++ < length) {
        arg = args[i];

        if (isNot(arg)) {
            pushArg(out, arg.slice(5), false, true);
            continue;
        }
        if (isArg(arg)) {
            i = parseArg(out, (arg[1] === "-" ? arg.slice(2) : arg.slice(1)), i, args);
        }
    }

    return out;
}

function parseArg(out, arg, i, args) {
    var split = (arg || "").split("="),
        key = split[0],
        value = split[1],
        j = i,
        length = args.length,
        next;

    pushArg(out, key, value);

    while (++j < length) {
        next = args[j];

        if (isArg(next)) break;

        i = j;
        pushArg(out, key, next);
    }

    return i;
}

function pushArg(out, key, value, forceFlat) {
    var item;

    key = camelcase(key);
    item = out[key];

    if (forceFlat) {
        out[key] = value;
        return;
    }

    if (item) {
        if (isArray(item)) {
            item.push(value);
        } else {
            item = out[key] = [item];
            if (value) item.push(value);
        }
    } else {
        out[key] = value;
    }
}

function isArg(str) {

    return str && str[0] === "-";
}

function isNot(str) {

    return str && str.indexOf("--no-") === 0;
}

function capitalize(str) {

    return str[0].toUpperCase() + str.slice(1).toLowerCase();
}

function camelcase(str) {
    var parts = (str || "").split("-"),
        i = parts.length;

    while (i-- > 1) parts[i] = capitalize(parts[i]);
    return parts.join("");
}


module.exports = argv;
