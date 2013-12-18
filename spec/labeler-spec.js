var Labeler = require("../serialization/labeler").Labeler;

require("./lib/jasmine-promise");

describe("labeler", function() {

    var labeler, object;

    beforeEach(function() {
        labeler = new Labeler();
        object = {anObject: true};
    });

    describe("user labels", function() {
        it("should initialize with user labels", function() {
            labeler.initWithObjects({
                "object": object
            });

            expect(labeler.getObjectLabel(object)).toBe("object");
        });

        it("should recognize user defined labels", function() {
            labeler.initWithObjects({
                "object": object
            });

            expect(labeler.isUserDefinedLabel("object")).toBe(true);
        });

        it("should not recognize new labels as user defined", function() {
            labeler.initWithObjects();
            labeler.setObjectLabel(object, "object");

            expect(labeler.isUserDefinedLabel("object")).toBe(false);
        });
    });

    describe("labels", function() {
        it("should know when a label is defined", function() {
            var label;

            labeler.initWithObjects();
            label = labeler.getObjectLabel(object);

            expect(labeler.isLabelDefined(label)).toBe(true);
        });

        it("should return the same label for the same object", function() {
            var label;

            labeler.initWithObjects();
            label = labeler.getObjectLabel(object);

            expect(labeler.getObjectLabel(object)).toBe(label);
        });

        it("should find a label by object", function() {
            var label;

            labeler.initWithObjects();
            label = labeler.getObjectLabel(object);

            expect(labeler.getObjectByLabel(label)).toBe(object);
        });
    });

    describe("label generation", function() {
        describe("object names", function() {
            it("should find the appropriate object name for an object", function() {
                var name = labeler.getObjectName({});

                expect(name).toBe("object");
            });

            it("should find the appropriate object name for a number", function() {
                var name = labeler.getObjectName(42);

                expect(name).toBe("number");
            });

            it("should find the appropriate object name for a string", function() {
                var name = labeler.getObjectName("a string");

                expect(name).toBe("string");
            });
        })
    });
});