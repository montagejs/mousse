var Deserializer = require("..").Deserializer,
    deserialize = require("..").deserialize;

require("./lib/jasmine-promise");

describe("deserialization", function() {
    it("should deserialize a serialization string", function() {
        var serialization = {
                "string": {
                    "value": "a string"
                },

                "number": {
                    "value": 42
                },

                "literal": {
                    "value": {
                        "string": "a string",
                        "number": 42
                    }
                }
            },
            serializationString = JSON.stringify(serialization),
            expectedResult = {
                string: "a string",
                number: 42,
                literal: {
                    string: "a string",
                    number: 42
                }
            },
            deserializer = new Deserializer(serializationString);

        return deserializer.deserialize().then(function(objects) {
            expect(objects).toEqual(expectedResult);
        });
    });

    it("should deserialize an object from a serialization string", function() {
        var serialization = {
                "root": {
                    "value": "a string"
                }
            },
            serializationString = JSON.stringify(serialization),
            deserializer = new Deserializer(serializationString);

        return deserializer.deserializeObject().then(function(object) {
            expect(object).toBe("a string");
        });
    });

    it("should deserialize an external object from a serialization string", function() {
        var serialization = {
                "external": {}
            },
            userObjects = {
                "external": {}
            },
            serializationString = JSON.stringify(serialization),
            deserializer = new Deserializer(serializationString);

        return deserializer.deserialize(userObjects).then(function(objects) {
            expect(userObjects.external).toBe(objects.external);
        });
    });

    it("should fail deserializing a missing external object from a serialization string", function() {
        var serialization = {
                "external": {}
            },
            serializationString = JSON.stringify(serialization),
            deserializer = new Deserializer(serializationString);

        return deserializer.deserialize().then(function(objects) {
            expect("test").toBe("fail");
        }, function() {
            expect(true).toBe(true);
        });
    });

    it("should be oblivious to Object.prototype aditions", function() {
        Object.defineProperty(Object.prototype, "clear", {
            value: function() {},
            writable: true,
            configurable: true
        });

        var serialization = {
                "clear": {
                    "value": "a string"
                }
            },
            serializationString = JSON.stringify(serialization),
            deserializer = new Deserializer(serializationString);

        return deserializer.deserialize().then(function(object) {
            delete Object.prototype.clear;

            expect(object.clear).toBe("a string");
        });
    });

    describe("shorthand", function() {
        it("should deserialize an object from a serialization string", function() {
            var serialization = {
                    "root": {
                        "value": "a string"
                    }
                },
                serializationString = JSON.stringify(serialization);

            return deserialize(serializationString).then(function(object) {
                expect(object).toEqual("a string");
            });
        });
    });

    describe("errors", function() {
        it("should warn about invalid format", function() {
            // property name is missing quotes
            var serializationString = '{string: "a string"}';

            return deserialize(serializationString).then(function(objects) {
                // never executed
            }, function(reason) {
                expect(reason).toBeDefined();
            });
        })
    });
});