var Serializer = require("..").Serializer;
var vm = require("vm");

require("./lib/jasmine-promise");

describe("serialization", function() {
    var serializer;

    beforeEach(function() {
        serializer = new Serializer();
        serializer.setSerializationIndentation(4);
    });

    describe("native types serialization", function() {
        it("should serialize a string", function() {
            var object = "string",
                expectedSerialization,
                serialization;

            expectedSerialization = {
                root: {
                    value: "string"
                }
            };

            serialization = serializer.serializeObject(object);
            expect(JSON.parse(serialization)).toEqual(expectedSerialization);
        });

        describe("numbers", function() {
            it("should serialize a positive number", function() {
                var object = 42,
                    expectedSerialization,
                    serialization;

                expectedSerialization = {
                    root: {
                        value: 42
                    }
                };

                serialization = serializer.serializeObject(object);
                expect(JSON.parse(serialization))
                    .toEqual(expectedSerialization);
            });

            it("should serialize a negative number", function() {
                var object = -42,
                    expectedSerialization,
                    serialization;

                expectedSerialization = {
                    root: {
                        value: -42
                    }
                };

                serialization = serializer.serializeObject(object);
                expect(JSON.parse(serialization))
                    .toEqual(expectedSerialization);
            });

            it("should serialize a rational number", function() {
                var object = 3.1415,
                    expectedSerialization,
                    serialization;

                expectedSerialization = {
                    root: {
                        value: 3.1415
                    }
                };

                serialization = serializer.serializeObject(object);
                expect(JSON.parse(serialization))
                    .toEqual(expectedSerialization);
            });
        });

        describe("booleans", function() {
            it("should serialize true", function() {
                var object = true,
                    expectedSerialization,
                    serialization;

                expectedSerialization = {
                    root: {
                        value: true
                    }
                };

                serialization = serializer.serializeObject(object);
                expect(JSON.parse(serialization))
                    .toEqual(expectedSerialization);
            });

            it("should serialize false", function() {
                var object = false,
                    expectedSerialization,
                    serialization;

                expectedSerialization = {
                    root: {
                        value: false
                    }
                };

                serialization = serializer.serializeObject(object);
                expect(JSON.parse(serialization))
                    .toEqual(expectedSerialization);
            });
        });

        it("should serialize a null value", function() {
            var object = null,
                expectedSerialization,
                serialization;

            expectedSerialization = {
                root: {
                    value: null
                }
            };

            serialization = serializer.serializeObject(object);
            expect(JSON.parse(serialization))
                .toEqual(expectedSerialization);
        });

        it("shouldn't serialize an undefined value", function() {
            var object,
                expectedSerialization,
                serialization;

            expectedSerialization = {
            };

            serialization = serializer.serializeObject(object);
            expect(JSON.parse(serialization)).toEqual(expectedSerialization);
        });
    });

    describe("native objects serialization", function() {
        describe("array", function() {
            it("should serialize an empty array", function() {
                var object = [],
                    expectedSerialization,
                    serialization;

                expectedSerialization = {
                    root: {
                        value: []
                    }
                };

                serialization = serializer.serializeObject(object);
                expect(JSON.parse(serialization))
                    .toEqual(expectedSerialization);
            });

            it("should serialize an array with native values", function() {
                var object = [
                        "string",
                        42,
                        /regexp/gi,
                         true
                    ],
                    expectedSerialization,
                    serialization;

                expectedSerialization = {
                    root: {
                        value: [
                            "string",
                            42,
                            {"/": {source: "regexp", flags: "gi"}},
                            true
                        ]
                    }
                };

                serialization = serializer.serializeObject(object);
                expect(JSON.parse(serialization))
                    .toEqual(expectedSerialization);
            });

            it("should serialize composed arrays", function() {
                var object = [[true], [[false]]],
                    expectedSerialization,
                    serialization;

                expectedSerialization = {
                    root: {
                        value: [[true], [[false]]]
                    }
                };

                serialization = serializer.serializeObject(object);
                expect(JSON.parse(serialization))
                    .toEqual(expectedSerialization);
            });

            it("should serialize different references to the same array", function() {
                var child = ["string"],
                    object = {
                        child1: child,
                        child2: child
                    },
                    expectedSerialization,
                    serialization;

                expectedSerialization = {
                    array: {
                        value: ["string"]
                    },

                    root: {
                        value: {
                            child1: {"@": "array"},
                            child2: {"@": "array"}
                        }
                    }
                };

                serialization = serializer.serializeObject(object);
                expect(JSON.parse(serialization))
                    .toEqual(expectedSerialization);
            });

            it("should serialize an array with a reference to itself", function() {
                var object = [],
                    expectedSerialization,
                    serialization;

                object.push(object);

                expectedSerialization = {
                    root: {
                        value: [
                            {"@": "root"}
                        ]
                    }
                };

                serialization = serializer.serializeObject(object);
                expect(JSON.parse(serialization))
                    .toEqual(expectedSerialization);
            });

        });

        it("should serialize a RegExp", function() {
            var object = /this \/ "\/ regexp/gm,
                expectedSerialization,
                serialization;

            expectedSerialization = {
                root: {
                    value: {"/": {
                        source: "this \\\/ \"\\\/ regexp",
                        flags: "gm"}}
                }
            };

            serialization = serializer.serializeObject(object);
            expect(JSON.parse(serialization)).toEqual(expectedSerialization);
        });

        describe("object literal", function() {
            it("should serialize an empty object literal", function() {
                var object = {},
                    expectedSerialization,
                    serialization;

                expectedSerialization = {
                    root: {
                        value: {}
                    }
                };

                serialization = serializer.serializeObject(object);
                expect(JSON.parse(serialization))
                    .toEqual(expectedSerialization);
            });

            it("should serialize an object literal with native values", function() {
                var object = {
                        string: "string",
                        number: 42,
                        regexp: /regexp/gi,
                        boolean: true
                    },
                    expectedSerialization,
                    serialization;

                expectedSerialization = {
                    root: {
                        value: {
                            string: "string",
                            number: 42,
                            regexp: {"/": {source: "regexp", flags: "gi"}},
                            boolean: true
                        }
                    }
                };

                serialization = serializer.serializeObject(object);
                expect(JSON.parse(serialization))
                    .toEqual(expectedSerialization);
            });

            it("should serialize composed object literals", function() {
                var object = {
                        child: {
                            child: {
                                leaf: true
                            }
                        },
                    },
                    expectedSerialization,
                    serialization;

                expectedSerialization = {
                    root: {
                        value: {
                            child: {
                                child: {
                                    leaf: true
                                }
                            }
                        }
                    }
                };

                serialization = serializer.serializeObject(object);
                expect(JSON.parse(serialization))
                    .toEqual(expectedSerialization);
            });

            it("should serialize different references to the same object literal ", function() {
                var child = {
                        string: "string"
                    },
                    object = {
                        child1: child,
                        child2: child
                    },
                    expectedSerialization,
                    serialization;

                expectedSerialization = {
                    object: {
                        value: {
                            string: "string"
                        }
                    },

                    root: {
                        value: {
                            child1: {"@": "object"},
                            child2: {"@": "object"}
                        }
                    }
                };

                serialization = serializer.serializeObject(object);
                expect(JSON.parse(serialization))
                    .toEqual(expectedSerialization);
            });

            it("should serialize an object literal with a reference to itself", function() {
                var object = {},
                    expectedSerialization,
                    serialization;

                object.self = object;

                expectedSerialization = {
                    root: {
                        value: {
                            self: {"@": "root"}
                        }
                    }
                };

                serialization = serializer.serializeObject(object);
                expect(JSON.parse(serialization))
                    .toEqual(expectedSerialization);
            });
        });

        describe("different document", function() {
            it("should serialize an object literal created in a different document", function() {
                var object = vm.runInNewContext("({})"),
                    expectedSerialization,
                    serialization;

                expectedSerialization = {
                    root: {
                        value: {}
                    }
                };

                serialization = serializer.serializeObject(object);
                expect(JSON.parse(serialization))
                    .toEqual(expectedSerialization);
            });

            it("should serialize a regexp created in a different document", function() {
                var object = vm.runInNewContext("(/regexp/gi)"),
                    expectedSerialization,
                    serialization;

                expectedSerialization = {
                    root: {
                        value: {"/": {source: "regexp", flags: "gi"}}
                    }
                };

                serialization = serializer.serializeObject(object);
                expect(JSON.parse(serialization))
                    .toEqual(expectedSerialization);
            });
        });

        describe("labels", function() {
            it("should serialize a reference to an object using its given label", function() {
                var object = {},
                    anotherObject = {name: "anotherObject"},
                    serialization,
                    expectedSerialization;

                expectedSerialization = {
                    root: {
                        value: {
                            object1: {"@": "anotherObject"},
                            object2: {"@": "anotherObject"}
                        }
                    },

                    anotherObject: {
                        value: {
                            name: "anotherObject"
                        }
                    }
                };

                object.object1 = anotherObject;
                object.object2 = anotherObject;

                serialization = serializer.serialize({root: object, anotherObject: anotherObject});
                expect(JSON.parse(serialization))
                .toEqual(expectedSerialization);
            });

            it("should avoid name clashes between given labels and generated labels from the type of object", function() {
                var object = {},
                    anotherObject = {name: "anotherObject"},
                    serialization,
                    expectedSerialization;

                expectedSerialization = {
                    object: {
                        value: {
                            anotherObject1: {"@": "object3"},
                            anotherObject2: {"@": "object3"}
                        }
                    },

                    object2: {
                        value: {}
                    },

                    object3: {
                        value: {
                            name: "anotherObject"
                        }
                    }
                };

                object.anotherObject1 = anotherObject;
                object.anotherObject2 = anotherObject;

                serialization = serializer.serialize({object: object, object2: {}});
                expect(JSON.parse(serialization))
                    .toEqual(expectedSerialization);
            });
        });
    });

    it("should be oblivious to Object.prototype aditions", function() {
        Object.defineProperty(Object.prototype, "clear", {
            value: function() {},
            writable: true,
            configurable: true,
            enumerable: true
        });

        var object = "a string",
            serialization,
            expectedSerialization;

        expectedSerialization = {
            "clear": {
                "value": "a string"
            }
        };

        serialization = serializer.serialize({clear: object});
        expect(JSON.parse(serialization))
        .toEqual(expectedSerialization);

        delete Object.prototype.clear;
    })
});