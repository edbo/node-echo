exports.mergeOptions = function(objectToSet,acceptableOptions,newOptions){
    for(var key in newOptions){
        if(acceptableOptions.indexOf(key) !== -1){
            if(typeof newOptions[key] === 'function'){
                objectToSet[key] = newOptions[key];
            }
            else if(newOptions[key] instanceof Object){
                for(var subKey in newOptions[key]){
                    objectToSet[key][subKey] = newOptions[key][subKey];
                }
            }
        }
    }
};

Object.defineProperty(Object.prototype, "bind", {value: function (fn) {
    var scope = this;
    return function () {
        fn.apply(scope, arguments);
    };
}});

//From http://howtonode.org/prototypical-inheritance
Object.defineProperty(Object.prototype, "spawn", {value: function (props,args) {
  var defs = {}, key;
  for (key in props) {
    if (props.hasOwnProperty(key)) {
      defs[key] = {value: props[key], enumerable: true};
    }
  }
  var newObject = Object.create(this, defs);
  if(typeof newObject.ctor === 'function')newObject.ctor(args);
  return newObject;
}});