/**
 * Collection of Reflect Types for easy maintenance
 */
export var DecoratorKeys;
(function (DecoratorKeys) {
    /** Get the Typescript assigned Type at runtime */
    DecoratorKeys["Type"] = "design:type";
    /**
     * "@prop" Cache
     * -> Use only for a class
     */
    DecoratorKeys["PropCache"] = "typegoose:properties";
    /**
     * Storage location for Model Options
     * -> Use only for a class
     */
    DecoratorKeys["ModelOptions"] = "typegoose:options";
    /**
     * Storage location for Indexes
     * -> Use only for a class
     */
    DecoratorKeys["Index"] = "typegoose:indexes";
    /**
     * Storage location for Plugins
     * -> Use only for a class
     */
    DecoratorKeys["Plugins"] = "typegoose:plugins";
    /**
     * Storage location for Pre-Hooks
     * -> Use only for a class
     */
    DecoratorKeys["HooksPre"] = "typegoose:hooksPre";
    /**
     * Storage location for Post-Hooks
     * -> Use only for a class
     */
    DecoratorKeys["HooksPost"] = "typegoose:hooksPost";
    /**
     * Storage location for Virtual Populates
     * -> Use only for a class
     */
    DecoratorKeys["VirtualPopulate"] = "typegoose:virtualPopulate";
    /**
     * Storage location for Query Methods
     * -> Use only for a class
     */
    DecoratorKeys["QueryMethod"] = "typegoose:queryMethod";
    /**
     * Storage location for Nested Discriminators
     * -> Use only for a class
     */
    DecoratorKeys["NestedDiscriminators"] = "typegoose:nestedDiscriminators";
})(DecoratorKeys || (DecoratorKeys = {}));
/** This Enum is meant for baseProp to decide for diffrent props (like if it is an arrayProp or prop or mapProp) */
export var PropType;
(function (PropType) {
    PropType[PropType["ARRAY"] = 0] = "ARRAY";
    PropType[PropType["MAP"] = 1] = "MAP";
    PropType[PropType["NONE"] = 2] = "NONE";
})(PropType || (PropType = {}));
// For Backwards-compatability
export const WhatIsIt = PropType;
/** Severity levels for soft-warnings */
export var Severity;
(function (Severity) {
    Severity[Severity["ALLOW"] = 0] = "ALLOW";
    Severity[Severity["WARN"] = 1] = "WARN";
    Severity[Severity["ERROR"] = 2] = "ERROR";
})(Severity || (Severity = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc3RhbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2ludGVybmFsL2NvbnN0YW50cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7R0FFRztBQUNILE1BQU0sQ0FBTixJQUFZLGFBZ0RYO0FBaERELFdBQVksYUFBYTtJQUN2QixrREFBa0Q7SUFDbEQscUNBQW9CLENBQUE7SUFDcEI7OztPQUdHO0lBQ0gsbURBQWtDLENBQUE7SUFDbEM7OztPQUdHO0lBQ0gsbURBQWtDLENBQUE7SUFDbEM7OztPQUdHO0lBQ0gsNENBQTJCLENBQUE7SUFDM0I7OztPQUdHO0lBQ0gsOENBQTZCLENBQUE7SUFDN0I7OztPQUdHO0lBQ0gsZ0RBQStCLENBQUE7SUFDL0I7OztPQUdHO0lBQ0gsa0RBQWlDLENBQUE7SUFDakM7OztPQUdHO0lBQ0gsOERBQTZDLENBQUE7SUFDN0M7OztPQUdHO0lBQ0gsc0RBQXFDLENBQUE7SUFDckM7OztPQUdHO0lBQ0gsd0VBQXVELENBQUE7QUFDekQsQ0FBQyxFQWhEVyxhQUFhLEtBQWIsYUFBYSxRQWdEeEI7QUFFRCxtSEFBbUg7QUFDbkgsTUFBTSxDQUFOLElBQVksUUFJWDtBQUpELFdBQVksUUFBUTtJQUNsQix5Q0FBSyxDQUFBO0lBQ0wscUNBQUcsQ0FBQTtJQUNILHVDQUFJLENBQUE7QUFDTixDQUFDLEVBSlcsUUFBUSxLQUFSLFFBQVEsUUFJbkI7QUFFRCw4QkFBOEI7QUFDOUIsTUFBTSxDQUFDLE1BQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQztBQUVqQyx3Q0FBd0M7QUFDeEMsTUFBTSxDQUFOLElBQVksUUFJWDtBQUpELFdBQVksUUFBUTtJQUNsQix5Q0FBSyxDQUFBO0lBQ0wsdUNBQUksQ0FBQTtJQUNKLHlDQUFLLENBQUE7QUFDUCxDQUFDLEVBSlcsUUFBUSxLQUFSLFFBQVEsUUFJbkIifQ==