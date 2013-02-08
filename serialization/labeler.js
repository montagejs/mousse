(function(ns) {
    function Labeler() {
        this._objectsLabels = Object.create(null);
        this._objects = Object.create(null);
        this._objectNamesIndex = Object.create(null);
        this._userDefinedLabels = Object.create(null);
    }

    Object.defineProperties(Labeler.prototype, {
        // hash(object) -> label
        _objectsLabels: {value: null, writable: true},
        _objects: {value: null, writable: true},
        // Labels generation sequence is "label", "label2", "label3", ..., hence
        // starting at 2.
        _INITIAL_LABEL_NUMBER: {value: 2},
        _objectNamesIndex: {value: null, writable: true},
        _userDefinedLabels: {value: null, writable: true},

        initWithObjects: {
            value: function(labels) {
                for (var label in labels) {
                    this.setObjectLabel(labels[label], label);
                    this._userDefinedLabels[label] = true;
                }
            }
        },

        cleanup: {
            value: function() {
                this._objectsLabels = null;
                this._objects = null;
                this._objectNamesIndex = null;
                this._userDefinedLabels = null;
            }
        },

        getObjectName: {
            value: function(object) {
                if (Array.isArray(object)) {
                    return "array";
                } else if (RegExp.isRegExp(object)) {
                    return "regexp";
                } else {
                    return "object";
                }
            }
        },

        generateObjectLabel: {
            value: function(object) {
                var objectName = this.getObjectName(object),
                    index = this._objectNamesIndex[objectName],
                    objectLabel;

                do {
                    if (index) {
                        objectLabel = objectName + index;
                        this._objectNamesIndex[objectName] = index = index + 1;
                    } else {
                        objectLabel = objectName;
                        this._objectNamesIndex[objectName] = index = this._INITIAL_LABEL_NUMBER;
                    }
                } while (objectLabel in this._objects);

                return objectLabel;
            }
        },

        getObjectLabel: {
            value: function(object) {
                var hash = Object.hash(object),
                    label;

                if (hash in this._objectsLabels) {
                    label = this._objectsLabels[hash];
                } else {
                    label = this.generateObjectLabel(object);

                    this._objectsLabels[hash] = label;
                    this._objects[label] = object;
                }

                return label;
            }
        },

        setObjectLabel: {
            value: function(object, label) {
                if (typeof object !== "undefined") {
                    var hash = Object.hash(object);

                    this._objectsLabels[hash] = label;
                    this._objects[label] = object;
                }
            }
        },

        getObjectByLabel: {
            value: function(label) {
                return this._objects[label];
            }
        },

        isUserDefinedLabel: {
            value: function(label) {
                return label in this._userDefinedLabels;
            }
        }
    });

    ns.Labeler = Labeler;
})(exports);
