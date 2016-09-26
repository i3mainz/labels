'use strict';

/**
 * @ngdoc service
 * @name labelsApp.LabelService
 * @description
 * # LabelService
 * Service in the labelsApp.
 */
angular.module('labelsApp')
  .factory('LabelService', function ($resource, $http, AuthService, ConfigService, ResourcesService) {

    var Concept = $resource(ConfigService.host + '/labels/:id', null, {
        'update': {
            method: 'PUT'
        },
        'remove': {
            method: 'DELETE',
            params: {
                user: "demo",
                type: "delete"
            }
        }
    });

    /**
     * returns the concept's thumbnail prefLabel.
     */
    Concept.prototype.getLabel = function() {
        var thumbnail = _.find(this.prefLabels, {isThumbnail: true});
        if (thumbnail) {
            return thumbnail.value;
        } else {
            return false;
        }
    };

    /**
     * returns the concept's prefLabels that are not the thumbnail prefLabel.
     * @returns {Object[]} Array of prefLabel Objects
     */
    Concept.prototype.getTranslations = function() {
        return _.filter(this.prefLabels, function(o) {
            return !o.isThumbnail;
        });
    };

    /**
     * Appends the new translation to the concept and calls the update function.
     */
    Concept.prototype.addTranslation = function(translation) {
        //translation.isThumbnail = false;  // so the user doesnt have to add it
        this.prefLabels.push(translation);
    };

    /**
     * Gets this concepts language.
     */
    Concept.prototype.getLang = function() {
        var thumbnail = _.find(this.prefLabels, {isThumbnail: true});
        if (thumbnail) {
            return thumbnail.lang;
        } else {
            return false;
        }
    };

    Concept.prototype.delete = function(successCallback, errorCallback) {
        var me = this;
        $http.delete(ConfigService.host + '/labels/' + me.id, {
            user: "demo",
            type: "delete"
        }).then(function() {
            successCallback();
        }, function() {
            errorCallback();
        });
    };

    /**
     * Sets the description and adds language automatically.
     */
    Concept.prototype.setDescription = function(value) {
        this.scopeNote = {
            value: value,
            lang: this.getLang()
        };
    };

    /**
     * Gets all of a concept's broader, narrower and related concepts and
     * returns a list of objects.
     * @param {Object} concept - A Labeling System concept (formerly 'label')
     * @param {String} relation - Relation to get concepts for
     * @param {function} callback - Callback that returns the related concepts
     */
     Concept.prototype.getRelatedConcepts = function(relation) {
         //console.log(Concept);
         var concept = this;

         // TODO: the concepts return dont have all the prototype functions
         // because LabelService is not used!!!
         // maybe its better to leave this as helperfunction for now

         return new Promise(function(resolve, reject) {
             var relatedConcepts = [];
             if (concept[relation]) {
                 concept[relation].forEach(function(resource, index, array) {

                     if (_.isString(resource)) {  // is internal concept ID
                        $http.get(ConfigService.host + '/labels/' + resource).then(function(res) {
                             relatedConcepts.push(res.data);
                             //console.log(res.data);
                             // callback when all done
                             if (index === array.length - 1) {
                                 resolve(relatedConcepts);
                             }
                         });

                     } else if (resource.uri) {  // is external resource
                         ResourcesService.get(resource.uri, function(relatedConcept) {
                             relatedConcepts.push(relatedConcept);

                             // callback when all done
                             if (index === array.length - 1) {
                                 resolve(relatedConcepts);
                             }
                         });
                     } else {
                         console.log("unknown resource:");
                         console.log(resource);
                     }
                 });
             } else {
                 resolve(relatedConcepts);
             }
         });

     };

    /**
     * Adds another concept, resource or wayback link to this concept.
     * @param {string} id - ID or URI
     * @param {string} relation - relation array to add child to (e.g. "broader")
     */
    Concept.prototype.addChild = function(concept, relation) {

        function isSiblingConcept() {
            return relation === "broader" || relation === "narrower" || relation === "related";
        }

        function isExternalConcept() {
            return relation === "narrowMatch" || relation === "broadMatch" || relation === "closeMatch" || relation === "relatedMatch" || relation === "exactMatch";
        }

        function isWaybackLink() {
            return relation === "seeAlso";
        }

        // init array if it doesnt exist already
        if (!this[relation]) {
            this[relation] = [];
        }

        if (isWaybackLink()) {
            this[relation].push({
                type: "wayback",
                uri: concept.uri
            });

        } else if (isSiblingConcept()) {

            // aquired via ResourcesService, extract id from uri
            if (concept.uri) {
                concept.id = concept.uri.split("/").pop();
            }
            this[relation].push(concept.id);

        } else if (isExternalConcept()) {
            // is external concept
            this[relation].push({
                type: concept.type,
                uri: concept.uri
            });
        } else {
            console.log("failed to add child because of unknown relation: " + relation);
        }
    };

    /**
     * Returns a score based on how many links to other concepts it has.
     */
    Concept.prototype.getScore = function() {
        var me = this;

        var qualityScore = 0;

        // gray boxes
        if (this.prefLabels) {
            qualityScore += this.prefLabels.length * ConfigService.scores.prefLabel;
        }
        if (this.altLabels) {
            qualityScore += this.altLabels.length * ConfigService.scores.altLabel;
        }
        if (this.scopeNote) {
            qualityScore += ConfigService.scores.scopeNote;
        }
        if (this.seeAlso) {
            qualityScore += ConfigService.scores.wayback;
        }

        // blue and green boxes
        var matchType = [
            "closeMatch",
            "exactMatch",
            "relatedMatch",
            "broadMatch",
            "narrowMatch"
        ];
        matchType.forEach(function(matchType) {
            if (me[matchType]) {
                me[matchType].forEach(function(match) {
                    if (ConfigService.scores[match.type]) {
                        qualityScore += ConfigService.scores[match.type];
                    }
                });
            }
        });

        // blue boxes
        if (this.broader) {
            qualityScore += this.broader.length * ConfigService.scores.concept;
        }
        if (this.related) {
            qualityScore += this.related.length * ConfigService.scores.concept;
        }
        if (this.narrower) {
            qualityScore += this.narrower.length * ConfigService.scores.concept;
        }

        function getMatchScore(matchType) {
            var score = 0;
            if (me[matchType]) {
                me[matchType].forEach(function(match) {
                    if (ConfigService.scores[match.type]) {
                        score += ConfigService.scores[match.type];
                    } else {
                        console.log("unknown match type: " + match.type + ". add score for this type in ConfigService!");
                    }
                });
            }
            return score;
        }

        //console.log(qualityScore);
        return qualityScore;
    };

    /**
     * Sends the current version of the concept tp the server to update it.
     */
    Concept.prototype.save = function(successCallback, errorCallback) {
        var me = this;
        $http.put(ConfigService.host + '/labels/' + me.id, {
            item: me,
            user: "demo"
        }).then(function() {
            successCallback();
        }, function() {
            errorCallback();
        });
    };


    return Concept;

  });
